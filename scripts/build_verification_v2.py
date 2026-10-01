#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import date, datetime
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]

TIER = {"A": 100, "B": 80, "C": 60, "D": 30}
SLA = {"verified": 180, "commercial": 120, "community": 120, "not-verified": 60, "legacy": 365}

def load_yaml(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}

def parse_date(value):
    if not value:
        return None
    try:
        return datetime.strptime(str(value), "%Y-%m-%d").date()
    except ValueError:
        return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--health", default="upstream-health.json")
    parser.add_argument("--output", default="generated-metrics/verification-v2.json")
    args = parser.parse_args()

    catalog = load_yaml(ROOT / "catalog.yaml")
    health_path = ROOT / args.health
    health_doc = json.loads(health_path.read_text(encoding="utf-8")) if health_path.exists() else {"repositories": []}
    health = {row["id"]: row for row in health_doc.get("repositories", [])}

    rows = []
    today = date.today()
    for item in catalog.get("entries", []):
        upstream = health.get(item["id"], {})
        reviewed = parse_date(item.get("last_reviewed"))
        age = (today - reviewed).days if reviewed else None
        freshness = 100 if age is not None and age <= 90 else 80 if age is not None and age <= 180 else 55 if age is not None and age <= 365 else 25
        lifecycle = {"healthy": 100, "stale": 60, "archived": 20, "unreachable": 10}.get(upstream.get("health"), 40)
        license_spdx = upstream.get("license_spdx")
        dimensions = {
            "canonical_source": 100 if item.get("url") else 0,
            "maintainer_identity": 100 if upstream.get("owner") else (55 if item.get("url") else 0),
            "license_metadata": 100 if license_spdx and license_spdx != "NOASSERTION" else 35,
            "lifecycle": lifecycle,
            "freshness": freshness,
            "evidence": TIER.get(item.get("evidence_tier"), 40),
        }
        confidence = round(sum(dimensions.values()) / len(dimensions))
        sla = SLA.get(item.get("status"), 180)
        review_due = bool(age is None or age > sla)
        rows.append({
            "id": item["id"], "name": item["name"], "status": item.get("status"),
            "evidence_tier": item.get("evidence_tier"), "confidence": confidence,
            "dimensions": dimensions, "review_age_days": age, "review_sla_days": sla,
            "review_due": review_due, "upstream_health": upstream.get("health", "not-checked"),
            "owner": upstream.get("owner"), "license_spdx": license_spdx,
        })

    out = {
        "schema_version": "2.0",
        "generated_at": today.isoformat(),
        "policy": "Confidence is a transparent project-local research score, not an authoritative product ranking.",
        "summary": {
            "entries": len(rows),
            "review_due": sum(1 for row in rows if row["review_due"]),
            "not_verified": sum(1 for row in rows if row["status"] == "not-verified"),
            "average_confidence": round(sum(row["confidence"] for row in rows) / max(len(rows), 1), 1),
        },
        "entries": sorted(rows, key=lambda row: (row["review_due"] is False, row["confidence"], row["name"].lower()))
    }
    path = ROOT / args.output
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(out["summary"]))

if __name__ == "__main__":
    main()
