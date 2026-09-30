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

def collect_techniques(d3fend_doc):
    techniques = {}

    def ensure(tid):
        if not tid or not str(tid).startswith("T"):
            return None
        tid = str(tid)
        return techniques.setdefault(tid, {
            "id": tid,
            "name": tid,
            "url": f"https://attack.mitre.org/techniques/{tid.replace('.', '/')}/",
            "scenarios": [],
            "scorecards": [],
            "defensive_context": [],
        })

    for path in sorted((ROOT / "examples/scenarios").glob("*.yaml")):
        doc = load_yaml(path) or {}
        for tid in (doc.get("mappings", {}) or {}).get("attack", []) or []:
            item = ensure(tid)
            if item:
                item["scenarios"].append({
                    "id": doc.get("scenario_id"),
                    "name": doc.get("name"),
                    "source": str(path.relative_to(ROOT)),
                })

    for path in sorted((ROOT / "examples/purple-team").glob("scorecard-*.yaml")):
        doc = load_yaml(path) or {}
        scenario = doc.get("scenario", {}) or {}
        for ref in doc.get("techniques", []) or []:
            tid = ref.get("id") if isinstance(ref, dict) else ref
            item = ensure(tid)
            if item:
                item["scorecards"].append({
                    "scenario_id": scenario.get("id"),
                    "phase": scenario.get("phase"),
                    "date": scenario.get("execution_date"),
                    "source": str(path.relative_to(ROOT)),
                })

    for row in d3fend_doc.get("examples", []) or []:
        item = ensure(row.get("attack_id"))
        if item:
            item["name"] = row.get("attack_name") or item["name"]
            item["defensive_context"].append({
                "relationship_type": row.get("relationship_type"),
                "defensive_actions": row.get("defensive_actions", []),
                "source": row.get("source"),
                "note": row.get("use"),
            })

    return sorted(techniques.values(), key=lambda item: item["id"])

def normalize():
    framework_doc = load_yaml(ROOT / "frameworks.yaml")
    catalog_doc = load_yaml(ROOT / "catalog.yaml")
    rel_doc = load_yaml(ROOT / "relationships.yaml")
    resources_doc = load_yaml(ROOT / "resources.yaml")
    learning_doc = load_yaml(ROOT / "learning-paths.yaml")
    standards_doc = load_yaml(ROOT / "data/standards-intelligence.yaml") if (ROOT / "data/standards-intelligence.yaml").exists() else {"standards": []}
    successors_doc = load_yaml(ROOT / "data/successors.yaml") if (ROOT / "data/successors.yaml").exists() else {"transitions": []}
    ai_crosswalk_doc = load_yaml(ROOT / "data/ai-crosswalk.yaml") if (ROOT / "data/ai-crosswalk.yaml").exists() else {"crosswalks": []}
    d3fend_doc = load_yaml(ROOT / "data/attack-d3fend-examples.yaml") if (ROOT / "data/attack-d3fend-examples.yaml").exists() else {"examples": []}
    health_path = ROOT / "upstream-health.json"
    health_doc = json.loads(health_path.read_text(encoding="utf-8")) if health_path.exists() else {"repositories": []}
    health_by_id = {row["id"]: row for row in health_doc.get("repositories", [])}
    items = []

    for entry in framework_doc.get("frameworks", []):
        item = {
            "id": entry.get("id"),
            "name": entry.get("name"),
            "aliases": as_list(entry.get("aliases")),
            "type": entry.get("type", "framework"),
            "domains": as_list(entry.get("domain")),
            "status": entry.get("status", "verified"),
            "model": entry.get("model", "reference"),
            "url": entry.get("url"),
            "summary": "; ".join(as_list(entry.get("best_for"))),
            "source": "frameworks.yaml",
            "kind": "framework",
            "version": entry.get("version"),
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
            "kind": "tool",
            "version": entry.get("version"),
            "evidence_tier": entry.get("evidence_tier", "B" if entry.get("url") else "C"),
            "last_reviewed": entry.get("last_reviewed", catalog_doc.get("updated")),
            "verification_note": entry.get("verification_note"),
        }
        enrich_provenance(item, health_by_id)
        items.append(item)

    known = {item["id"] for item in items}
    relationships = [
        edge for edge in rel_doc.get("relationships", [])
        if edge.get("from") in known and edge.get("to") in known
    ]
    techniques = collect_techniques(d3fend_doc)
    updated = max(
        str(framework_doc.get("updated", "")),
        str(catalog_doc.get("updated", "")),
        str(rel_doc.get("updated", "")),
        str(resources_doc.get("updated", "")),
        str(learning_doc.get("updated", "")),
    )
    return {
        "generated_from": ["frameworks.yaml", "catalog.yaml", "relationships.yaml", "resources.yaml", "learning-paths.yaml"],
        "updated": updated,
        "items": sorted(items, key=lambda item: (item["name"] or "").lower()),
        "relationships": relationships,
        "resources": resources_doc,
        "learning_paths": learning_doc,
        "techniques": techniques,
        "_framework_doc": framework_doc,
        "_catalog_doc": catalog_doc,
        "_relationships_doc": rel_doc,
        "_standards_doc": standards_doc,
        "_successors_doc": successors_doc,
        "_ai_crosswalk_doc": ai_crosswalk_doc,
        "_d3fend_doc": d3fend_doc,
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
    upstream = f'<a class="primary-button" href="{html.escape(item["url"])}" rel="noopener">Canonical source ↗</a>' if item.get("url") else ""
    verification = (
        f'<div class="notice-card"><div class="notice-icon">!</div><div><strong>NOT VERIFIED</strong>'
        f'<p>{html.escape(item.get("verification_note") or "Research candidate only; provenance not yet confirmed.")}</p></div></div>'
        if item.get("status") == "not-verified" else ""
    )
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="{html.escape(item.get("summary") or item["name"])}">
  <title>{html.escape(item["name"])} · RedFrameworks</title>
  <link rel="stylesheet" href="../../styles.css">
</head>
<body>
  <main class="entity-main">
    <a class="back-link" href="../../">← RedFrameworks</a>
    <section class="entity-hero">
      <p class="section-kicker">{html.escape(item.get("kind", "entity"))} · {html.escape(item["type"])}</p>
      <h1>{html.escape(item["name"])}</h1>
      <p class="hero-summary">{html.escape(item.get("summary") or "")}</p>
      <div class="badges"><span class="badge">{html.escape(item["status"])}</span>{domains}</div>
      <div class="hero-actions">{upstream}</div>
      {verification}
    </section>
    <section class="entity-grid">
      <article class="entity-panel"><span>Provenance</span><strong>{item["provenance_score"]}/100</strong><small>Tier {html.escape(item["evidence_tier"])}</small></article>
      <article class="entity-panel"><span>Model</span><strong>{html.escape(item["model"])}</strong><small>{html.escape(str(item.get("last_reviewed") or "—"))}</small></article>
    </section>
    <section class="entity-panel"><span>Relationships</span><ul>{''.join(relation_rows) or '<li>No curated relationships yet.</li>'}</ul></section>
  </main>
</body></html>"""

def technique_page(item):
    defensive = []
    for context in item.get("defensive_context", []):
        actions = ", ".join(context.get("defensive_actions", []))
        defensive.append(f"<li><strong>{html.escape(context.get('relationship_type') or 'context')}</strong>: {html.escape(actions)}</li>")
    usage = [
        f"<li>{html.escape(row.get('name') or row.get('id') or 'scenario')}</li>"
        for row in item.get("scenarios", [])
    ]
    return f"""<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(item['id'])} · Technique Intelligence · RedFrameworks</title>
<link rel="stylesheet" href="../../styles.css"></head>
<body><main class="entity-main">
<a class="back-link" href="../../#techniques">← Technique Intelligence</a>
<section class="entity-hero">
<p class="section-kicker">ATT&CK technique intelligence</p>
<h1>{html.escape(item['id'])} · {html.escape(item.get('name') or item['id'])}</h1>
<p class="hero-summary">Public RedFrameworks context for defensive validation, evidence and framework relationships. This page does not provide exploitation instructions.</p>
<div class="hero-actions"><a class="primary-button" href="{html.escape(item['url'])}" rel="noopener">MITRE ATT&CK ↗</a></div>
</section>
<section class="entity-grid">
<article class="entity-panel"><span>Validation references</span><strong>{len(item.get('scenarios', [])) + len(item.get('scorecards', []))}</strong></article>
<article class="entity-panel"><span>Defensive mappings</span><strong>{len(item.get('defensive_context', []))}</strong></article>
</section>
<section class="entity-panel"><span>Scenario context</span><ul>{''.join(usage) or '<li>No structured scenario references.</li>'}</ul></section>
<section class="entity-panel"><span>D3FEND context</span><ul>{''.join(defensive) or '<li>No curated D3FEND context yet.</li>'}</ul></section>
</main></body></html>"""

def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False, default=str) + "\n", encoding="utf-8")

def write_api(output, payload):
    api = output / "api"
    v1, v2, v3 = api / "v1", api / "v2", api / "v3"
    for directory in (v1, v2, v3):
        directory.mkdir(parents=True, exist_ok=True)

    items = payload["items"]
    relationships = payload["relationships"]
    not_verified = [item for item in items if item.get("status") == "not-verified"]
    verification_path = ROOT / "verification-queue.json"
    verification = json.loads(verification_path.read_text(encoding="utf-8")) if verification_path.exists() else {"count": len(not_verified), "entries": []}

    write_json(v1 / "catalog.json", items)
    write_json(v1 / "relationships.json", relationships)

    for target in (v2, v3):
        write_json(target / "catalog.json", items)
        write_json(target / "relationships.json", relationships)
        write_json(target / "frameworks.json", payload["_framework_doc"])
        write_json(target / "not-verified.json", not_verified)
        write_json(target / "standards.json", payload["_standards_doc"])
        write_json(target / "successors.json", payload["_successors_doc"])
        write_json(target / "ai-crosswalk.json", payload["_ai_crosswalk_doc"])
        write_json(target / "attack-d3fend.json", payload["_d3fend_doc"])

    write_json(v3 / "resources.json", payload["resources"])
    write_json(v3 / "learning-paths.json", payload["learning_paths"])
    write_json(v3 / "verification-queue.json", verification)
    write_json(v3 / "techniques.json", payload["techniques"])

    lifecycle_path = ROOT / "data/lifecycle.yaml"
    changelog_path = ROOT / "data/changelog.yaml"
    if lifecycle_path.exists():
        lifecycle = load_yaml(lifecycle_path)
        write_json(v2 / "lifecycle.json", lifecycle)
        write_json(v3 / "lifecycle.json", lifecycle)
    if changelog_path.exists():
        changelog = load_yaml(changelog_path)
        write_json(v2 / "changelog.json", changelog)
        write_json(v3 / "changelog.json", changelog)

    release_dir = ROOT / "data/releases"
    if release_dir.exists():
        for target in (v2 / "releases", v3 / "releases"):
            target.mkdir(parents=True, exist_ok=True)
            for release in release_dir.glob("*.json"):
                shutil.copy2(release, target / release.name)

    counts = {
        "entries": len(items),
        "frameworks": len(payload["_framework_doc"].get("frameworks", [])),
        "tools": len(payload["_catalog_doc"].get("entries", [])),
        "books": len(payload["resources"].get("books", [])),
        "certifications": len(payload["resources"].get("certifications", [])),
        "learning_paths": len(payload["learning_paths"].get("paths", [])),
        "not_verified": len(not_verified),
        "relationships": len(relationships),
        "techniques": len(payload["techniques"]),
    }
    index = {
        "api": "RedFrameworks Static API",
        "current": "v3",
        "supported": ["v1", "v2", "v3"],
        "updated": payload["updated"],
        "counts": counts,
        "endpoints": {
            "catalog": "catalog.json",
            "relationships": "relationships.json",
            "frameworks": "frameworks.json",
            "resources": "resources.json",
            "learning_paths": "learning-paths.json",
            "verification_queue": "verification-queue.json",
            "techniques": "techniques.json",
            "standards": "standards.json",
            "successors": "successors.json",
        },
    }
    write_json(v3 / "index.json", index)
    write_json(api / "version.json", index)

    for name, value in {
        "catalog.json": items,
        "relationships.json": relationships,
        "frameworks.json": payload["_framework_doc"],
        "resources.json": payload["resources"],
        "learning-paths.json": payload["learning_paths"],
        "techniques.json": payload["techniques"],
        "verification-queue.json": verification,
    }.items():
        write_json(api / name, value)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="_site")
    args = parser.parse_args()
    output = ROOT / args.output
    if output.exists():
        shutil.rmtree(output)
    shutil.copytree(ROOT / "site", output)

    if (ROOT / "schemas").exists():
        shutil.copytree(ROOT / "schemas", output / "schemas")
    if (ROOT / "sdk").exists():
        shutil.copytree(ROOT / "sdk", output / "sdk")

    payload = normalize()
    private_keys = [
        "_framework_doc", "_catalog_doc", "_relationships_doc", "_standards_doc",
        "_successors_doc", "_ai_crosswalk_doc", "_d3fend_doc"
    ]
    private = {key: payload.pop(key) for key in private_keys}

    data_dir = output / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    write_json(data_dir / "catalog.json", {
        "updated": payload["updated"],
        "items": payload["items"],
        "relationships": payload["relationships"],
    })
    write_json(data_dir / "resources.json", payload["resources"])
    write_json(data_dir / "learning-paths.json", payload["learning_paths"])
    write_json(data_dir / "techniques.json", payload["techniques"])
    write_json(data_dir / "standards-intelligence.json", private["_standards_doc"])
    write_json(data_dir / "ai-crosswalk.json", private["_ai_crosswalk_doc"])
    write_json(data_dir / "attack-d3fend.json", private["_d3fend_doc"])

    metrics_dir = ROOT / "generated-metrics"
    if metrics_dir.exists():
        for metric_file in metrics_dir.glob("*.json"):
            shutil.copy2(metric_file, data_dir / metric_file.name)

    verification_path = ROOT / "verification-queue.json"
    if verification_path.exists():
        shutil.copy2(verification_path, data_dir / "verification-queue.json")

    payload.update(private)
    write_api(output, payload)

    item_map = {item["id"]: item for item in payload["items"]}
    for item in payload["items"]:
        target = output / "entity" / item["id"]
        target.mkdir(parents=True, exist_ok=True)
        (target / "index.html").write_text(entity_page(item, payload["relationships"], item_map), encoding="utf-8")

    for item in payload["techniques"]:
        target = output / "technique" / item["id"].lower()
        target.mkdir(parents=True, exist_ok=True)
        (target / "index.html").write_text(technique_page(item), encoding="utf-8")

    (output / ".nojekyll").write_text("", encoding="utf-8")
    print(
        f"Built {len(payload['items'])} catalog entries, {len(payload['relationships'])} relationships, "
        f"{len(payload['resources'].get('books', []))} books, "
        f"{len(payload['resources'].get('certifications', []))} certifications, "
        f"{len(payload['techniques'])} technique pages and API v3 into {output}"
    )

if __name__ == "__main__":
    main()
