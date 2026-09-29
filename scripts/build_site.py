#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import shutil
from datetime import date, datetime
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]

def load_yaml(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)

def as_list(value):
    if value is None:
        return []
    return value if isinstance(value, list) else [value]

def parse_date(value):
    if not value:
        return None
    if isinstance(value, date):
        return value
    try:
        return datetime.strptime(str(value), "%Y-%m-%d").date()
    except ValueError:
        return None

def provenance_score(item, health=None):
    tier_points = {"A": 80, "B": 70, "C": 55, "D": 30}
    status_delta = {"verified": 10, "community": 2, "commercial": 4, "legacy": -18, "watchlist": -20, "not-verified": -20}
    score = tier_points.get(item.get("evidence_tier"), 50)
    score += status_delta.get(item.get("status"), 0)
    if item.get("url"):
        score += 5
    reviewed = parse_date(item.get("last_reviewed"))
    if reviewed:
        age = (date.today() - reviewed).days
        if age <= 90:
            score += 5
        elif age > 365:
            score -= 10
        elif age > 180:
            score -= 5
    if health:
        signal = health.get("health")
        if signal == "healthy":
            score += 5
        elif signal == "stale":
            score -= 7
        elif signal == "archived":
            score -= 18
        elif signal == "unreachable":
            score -= 12
    return max(0, min(100, score))

def enrich_provenance(item, health_by_id):
    health = health_by_id.get(item["id"])
    item["provenance_score"] = provenance_score(item, health)
    item["upstream_health"] = health.get("health") if health else "not-checked"
    item["last_activity"] = health.get("pushed_at") if health else None
    item["latest_release"] = health.get("latest_release") if health else None

def normalize():
    framework_doc = load_yaml(ROOT / "frameworks.yaml")
    catalog_doc = load_yaml(ROOT / "catalog.yaml")
    rel_doc = load_yaml(ROOT / "relationships.yaml")
    health_path = ROOT / "upstream-health.json"
    health_doc = json.loads(health_path.read_text(encoding="utf-8")) if health_path.exists() else {"repositories": []}
    health_by_id = {row["id"]: row for row in health_doc.get("repositories", [])}
    items = []

    for entry in framework_doc.get("frameworks", []):
        item = {
            "id": entry.get("id"),
            "name": entry.get("name"),
            "aliases": as_list(entry.get("aliases")),
            "type": entry.get("type", entry.get("category", "framework")),
            "domains": as_list(entry.get("domain")),
            "status": entry.get("status", "verified"),
            "model": entry.get("model", "reference"),
            "url": entry.get("url"),
            "summary": "; ".join(as_list(entry.get("best_for"))),
            "source": "frameworks.yaml",
            "evidence_tier": entry.get("evidence_tier", "A"),
            "last_reviewed": entry.get("last_reviewed", framework_doc.get("updated")),
        }
        enrich_provenance(item, health_by_id)
        items.append(item)

    for entry in catalog_doc.get("entries", []):
        item = {
            "id": entry.get("id"),
            "name": entry.get("name"),
            "aliases": as_list(entry.get("aliases")),
            "type": entry.get("type", "tool"),
            "domains": as_list(entry.get("domains")),
            "status": entry.get("status", "community"),
            "model": entry.get("model", "unknown"),
            "url": entry.get("url"),
            "summary": entry.get("role", ""),
            "source": "catalog.yaml",
            "evidence_tier": entry.get("evidence_tier", "B" if entry.get("url") else "C"),
            "last_reviewed": entry.get("last_reviewed", catalog_doc.get("updated")),
            "verification_note": entry.get("verification_note"),
        }
        enrich_provenance(item, health_by_id)
        items.append(item)

    for candidate in catalog_doc.get("watchlist", []):
        name = candidate.get("name") if isinstance(candidate, dict) else candidate
        domains = as_list(candidate.get("domains")) if isinstance(candidate, dict) else ["research-watchlist"]
        note = candidate.get("note") if isinstance(candidate, dict) else None
        item = {
            "id": "watch-" + str(name).lower().replace(" ", "-"),
            "name": name,
            "aliases": [],
            "type": "candidate",
            "domains": domains or ["research-watchlist"],
            "status": "watchlist",
            "model": "unverified",
            "url": None,
            "summary": note or "Candidate awaiting provenance, maintenance and scope review.",
            "source": "catalog.yaml",
            "evidence_tier": "D",
            "last_reviewed": catalog_doc.get("updated"),
        }
        enrich_provenance(item, health_by_id)
        items.append(item)

    known = {item["id"] for item in items}
    relationships = [
        edge for edge in rel_doc.get("relationships", [])
        if edge.get("from") in known and edge.get("to") in known
    ]
    return {
        "generated_from": ["frameworks.yaml", "catalog.yaml", "relationships.yaml"],
        "updated": max(
            str(framework_doc.get("updated", "")),
            str(catalog_doc.get("updated", "")),
            str(rel_doc.get("updated", "")),
        ),
        "items": sorted(items, key=lambda item: (item["name"] or "").lower()),
        "relationships": relationships,
        "_framework_doc": framework_doc,
        "_catalog_doc": catalog_doc,
        "_relationships_doc": rel_doc,
    }

def entity_page(item, relationships, item_map):
    edges = [edge for edge in relationships if edge["from"] == item["id"] or edge["to"] == item["id"]]
    relation_rows = []
    for edge in edges:
        other_id = edge["to"] if edge["from"] == item["id"] else edge["from"]
        other = item_map.get(other_id)
        direction = "→" if edge["from"] == item["id"] else "←"
        if other:
            relation_rows.append(
                f'<li><span>{html.escape(edge["relation"])} · {html.escape(edge.get("confidence", "unrated"))}</span> {direction} '
                f'<a href="../{html.escape(other_id)}/">{html.escape(other["name"])}</a></li>'
            )
    domains = "".join(f'<span class="badge">{html.escape(value)}</span>' for value in item.get("domains", []))
    upstream = (
        f'<a class="button primary" href="{html.escape(item["url"])}" rel="noopener">Upstream ↗</a>'
        if item.get("url") else ""
    )
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="{html.escape(item.get("summary") or item["name"])}">
  <title>{html.escape(item["name"])} · RedFrameworks</title>
  <link rel="stylesheet" href="../../styles.css">
</head>
<body>
  <header class="topbar"><a class="brand" href="../../"><span class="brand-mark">RF</span><span>RedFrameworks</span></a></header>
  <main class="entity-main">
    <a class="back-link" href="../../">← Back to catalog</a>
    <section class="entity-hero">
      <p class="kicker">{html.escape(item["type"])}</p>
      <h1>{html.escape(item["name"])}</h1>
      <p class="lede">{html.escape(item.get("summary") or "")}</p>
      <div class="badges"><span class="badge {html.escape(item["status"])}">{html.escape(item["status"])}</span>{domains}</div>
      <div class="hero-actions">{upstream}</div>
    </section>
    <section class="entity-grid">
      <article class="panel"><p class="kicker">Provenance</p><h2>{item["provenance_score"]}/100</h2><p>Evidence tier {html.escape(item["evidence_tier"])} · reviewed {html.escape(str(item["last_reviewed"]))}</p></article>
      <article class="panel"><p class="kicker">Model</p><h2>{html.escape(item["model"])}</h2><p>Source: {html.escape(item["source"])}</p></article>
    </section>
    <section class="panel entity-relations"><p class="kicker">Relationships</p><h2>Inbound & outbound context</h2><ul>{"".join(relation_rows) or "<li>No curated relationships yet.</li>"}</ul></section>
  </main>
</body>
</html>"""

def write_api(output, payload):
    api = output / "api"
    api.mkdir(parents=True, exist_ok=True)
    items = payload["items"]
    (api / "catalog.json").write_text(json.dumps(items, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (api / "relationships.json").write_text(json.dumps(payload["relationships"], indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (api / "frameworks.json").write_text(json.dumps(payload["_framework_doc"], indent=2, ensure_ascii=False, default=str) + "\n", encoding="utf-8")
    (api / "watchlist.json").write_text(json.dumps(payload["_catalog_doc"].get("watchlist", []), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    lifecycle_path = ROOT / "data/lifecycle.yaml"
    changelog_path = ROOT / "data/changelog.yaml"
    release_dir = ROOT / "data/releases"
    if lifecycle_path.exists():
        (api / "lifecycle.json").write_text(json.dumps(load_yaml(lifecycle_path), indent=2, ensure_ascii=False, default=str) + "\n", encoding="utf-8")
    if changelog_path.exists():
        (api / "changelog.json").write_text(json.dumps(load_yaml(changelog_path), indent=2, ensure_ascii=False, default=str) + "\n", encoding="utf-8")
    if release_dir.exists():
        target = api / "releases"
        target.mkdir(parents=True, exist_ok=True)
        for release in release_dir.glob("*.json"):
            shutil.copy2(release, target / release.name)

    (api / "version.json").write_text(json.dumps({
        "schema": "RedFrameworks static API v1",
        "updated": payload["updated"],
        "entries": len(items),
        "relationships": len(payload["relationships"]),
        "endpoints": [
            "catalog.json", "frameworks.json", "relationships.json", "watchlist.json",
            "lifecycle.json", "changelog.json", "releases/"
        ]
    }, indent=2) + "\n", encoding="utf-8")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="_site")
    args = parser.parse_args()

    output = ROOT / args.output
    if output.exists():
        shutil.rmtree(output)
    shutil.copytree(ROOT / "site", output)
    schemas_source = ROOT / "schemas"
    if schemas_source.exists():
        shutil.copytree(schemas_source, output / "schemas")

    payload = normalize()
    framework_doc = payload.pop("_framework_doc")
    catalog_doc = payload.pop("_catalog_doc")
    relationships_doc = payload.pop("_relationships_doc")
    private_docs = {"_framework_doc": framework_doc, "_catalog_doc": catalog_doc, "_relationships_doc": relationships_doc}

    data_dir = output / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    (data_dir / "catalog.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    trend_source = ROOT / "examples/trends/coverage-trend.json"
    if trend_source.exists():
        shutil.copy2(trend_source, data_dir / "coverage-trend.json")

    payload.update(private_docs)
    write_api(output, payload)

    item_map = {item["id"]: item for item in payload["items"]}
    for item in payload["items"]:
        target = output / "entity" / item["id"]
        target.mkdir(parents=True, exist_ok=True)
        (target / "index.html").write_text(entity_page(item, payload["relationships"], item_map), encoding="utf-8")

    (output / ".nojekyll").write_text("", encoding="utf-8")
    print(
        f"Built {len(payload['items'])} entries, {len(payload['relationships'])} relationships, "
        f"{len(payload['items'])} entity pages and static API endpoints into {output}"
    )

if __name__ == "__main__":
    main()
