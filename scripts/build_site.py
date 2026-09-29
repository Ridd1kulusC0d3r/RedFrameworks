#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]


def load_yaml(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def as_list(value):
    if value is None:
        return []
    return value if isinstance(value, list) else [value]


def normalize():
    framework_doc = load_yaml(ROOT / "frameworks.yaml")
    catalog_doc = load_yaml(ROOT / "catalog.yaml")

    items = []

    for entry in framework_doc.get("frameworks", []):
        items.append({
            "id": entry.get("id"),
            "name": entry.get("name"),
            "type": entry.get("type", entry.get("category", "framework")),
            "domains": as_list(entry.get("domain")),
            "status": entry.get("status", "verified"),
            "model": entry.get("model", "reference"),
            "url": entry.get("url"),
            "summary": "; ".join(as_list(entry.get("best_for"))),
            "source": "frameworks.yaml",
            "last_reviewed": entry.get("last_reviewed", framework_doc.get("updated")),
        })

    for entry in catalog_doc.get("entries", []):
        items.append({
            "id": entry.get("id"),
            "name": entry.get("name"),
            "type": entry.get("type", "tool"),
            "domains": as_list(entry.get("domains")),
            "status": entry.get("status", "community"),
            "model": entry.get("model", "unknown"),
            "url": entry.get("url"),
            "summary": entry.get("role", ""),
            "source": "catalog.yaml",
            "last_reviewed": entry.get("last_reviewed", catalog_doc.get("updated")),
        })

    for name in catalog_doc.get("watchlist", []):
        items.append({
            "id": "watch-" + name.lower().replace(" ", "-"),
            "name": name,
            "type": "candidate",
            "domains": ["research-watchlist"],
            "status": "watchlist",
            "model": "unverified",
            "url": None,
            "summary": "Candidate awaiting provenance, maintenance and scope review.",
            "source": "catalog.yaml",
            "last_reviewed": catalog_doc.get("updated"),
        })

    return {
        "generated_from": ["frameworks.yaml", "catalog.yaml"],
        "updated": max(str(framework_doc.get("updated", "")), str(catalog_doc.get("updated", ""))),
        "items": sorted(items, key=lambda x: (x["name"] or "").lower()),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="_site")
    args = parser.parse_args()

    output = ROOT / args.output
    static = ROOT / "site"

    if output.exists():
        shutil.rmtree(output)
    shutil.copytree(static, output)

    data_dir = output / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    payload = normalize()
    (data_dir / "catalog.json").write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (output / ".nojekyll").write_text("", encoding="utf-8")

    print(f"Built {len(payload['items'])} catalog entries into {output}")


if __name__ == "__main__":
    main()
