#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]

def load_yaml(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", default="verification-queue.json")
    parser.add_argument("--report", default="verification-queue.md")
    args = parser.parse_args()

    catalog = load_yaml(ROOT / "catalog.yaml")
    health_path = ROOT / "upstream-health.json"
    health = json.loads(health_path.read_text(encoding="utf-8")) if health_path.exists() else {"repositories": []}
    health_by_id = {row["id"]: row for row in health.get("repositories", [])}

    queue = []
    for entry in catalog.get("entries", []):
        if entry.get("status") != "not-verified":
            continue
        checks = {
            "canonical_url": bool(entry.get("url")),
            "model": bool(entry.get("model") and entry.get("model") != "unknown"),
            "evidence_tier": entry.get("evidence_tier") in {"A", "B", "C"},
            "review_date": bool(entry.get("last_reviewed")),
            "domains": bool(entry.get("domains")),
            "verification_note": bool(entry.get("verification_note")),
        }
        upstream = health_by_id.get(entry["id"])
        if upstream:
            checks["upstream_reachable"] = upstream.get("health") not in {"unreachable", "archived"}
        passed = sum(1 for value in checks.values() if value)
        total = len(checks)
        queue.append({
            "id": entry["id"],
            "name": entry["name"],
            "domains": entry.get("domains", []),
            "readiness_percent": round(passed / total * 100),
            "checks": checks,
            "upstream_health": upstream.get("health") if upstream else "not-checked",
            "next_actions": [name for name, ok in checks.items() if not ok],
        })

    queue.sort(key=lambda item: (-item["readiness_percent"], item["name"].lower()))
    payload = {"count": len(queue), "entries": queue}
    Path(args.json).write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lines = [
        "# NOT VERIFIED verification queue", "",
        f"- Candidates: **{len(queue)}**", "",
        "| Entry | Readiness | Upstream | Missing |",
        "|---|---:|---|---|",
    ]
    for item in queue:
        lines.append(
            f"| {item['name']} | {item['readiness_percent']}% | {item['upstream_health']} | "
            f"{', '.join(item['next_actions']) or 'manual promotion review'} |"
        )
    Path(args.report).write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"count": len(queue)}))

if __name__ == "__main__":
    main()
