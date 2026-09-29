#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import date, datetime
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]


def load(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def parse_date(value):
    if isinstance(value, date):
        return value
    return datetime.strptime(str(value), "%Y-%m-%d").date()


def as_list(value):
    if value is None:
        return []
    return value if isinstance(value, list) else [value]


def cadence(entry):
    status = entry.get("status", "")
    kind = entry.get("type", entry.get("category", ""))
    domains = set(as_list(entry.get("domain")) + as_list(entry.get("domains")))

    if status == "legacy":
        return 365
    if status == "community" or {"ai-genai", "cloud", "kubernetes"} & domains:
        return 90
    if status == "commercial":
        return 180
    if kind in {"methodology", "standard", "assessment-guidance", "threat-led-testing-framework"}:
        return 180
    return 180


def collect(today):
    docs = [
        ("frameworks.yaml", load(ROOT / "frameworks.yaml"), "frameworks"),
        ("catalog.yaml", load(ROOT / "catalog.yaml"), "entries"),
    ]
    records = []

    for source, doc, key in docs:
        inherited = parse_date(doc["updated"])
        for entry in doc.get(key, []):
            reviewed = parse_date(entry.get("last_reviewed", inherited))
            days = (today - reviewed).days
            limit = cadence(entry)
            records.append({
                "source": source,
                "id": entry.get("id"),
                "name": entry.get("name"),
                "last_reviewed": reviewed.isoformat(),
                "age_days": days,
                "cadence_days": limit,
                "stale": days > limit,
            })
    return records


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--report", default="freshness-report.md")
    parser.add_argument("--json", default="freshness-report.json")
    parser.add_argument("--today", help="YYYY-MM-DD override for testing")
    args = parser.parse_args()

    today = parse_date(args.today) if args.today else date.today()
    records = collect(today)
    stale = [r for r in records if r["stale"]]

    lines = [
        "# Catalog freshness report",
        "",
        f"- Generated: **{today.isoformat()}**",
        f"- Entries checked: **{len(records)}**",
        f"- Stale entries: **{len(stale)}**",
        "",
    ]

    if stale:
        lines += ["| Entry | Source | Last reviewed | Age | Cadence |", "|---|---|---:|---:|---:|"]
        for row in stale:
            lines.append(
                f"| {row['name']} | {row['source']} | {row['last_reviewed']} | "
                f"{row['age_days']}d | {row['cadence_days']}d |"
            )
    else:
        lines.append("All reviewed entries are within their configured freshness window.")

    Path(args.report).write_text("\n".join(lines) + "\n", encoding="utf-8")
    Path(args.json).write_text(
        json.dumps({"date": today.isoformat(), "stale_count": len(stale), "records": records}, indent=2) + "\n",
        encoding="utf-8",
    )
    print(len(stale))


if __name__ == "__main__":
    main()
