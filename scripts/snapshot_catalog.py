#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]

def load_yaml(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)

def canonical_hash(paths):
    digest = hashlib.sha256()
    for path in paths:
        data = path.read_bytes()
        digest.update(path.name.encode())
        digest.update(b"\0")
        digest.update(data)
        digest.update(b"\0")
    return digest.hexdigest()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument("--version", required=True)
    args = parser.parse_args()

    fw = load_yaml(ROOT / "frameworks.yaml")
    cat = load_yaml(ROOT / "catalog.yaml")
    rel = load_yaml(ROOT / "relationships.yaml")

    entries = []
    for item in fw.get("frameworks", []):
        entries.append({
            "id": item["id"], "name": item["name"], "status": item.get("status"),
            "type": item.get("type"), "domains": sorted(item.get("domain", [])),
            "source": "frameworks.yaml"
        })
    for item in cat.get("entries", []):
        entries.append({
            "id": item["id"], "name": item["name"], "status": item.get("status"),
            "type": item.get("type"), "domains": sorted(item.get("domains", [])),
            "source": "catalog.yaml"
        })
    entries.sort(key=lambda item: item["id"])

    relationships = sorted([
        {
            "from": edge["from"], "to": edge["to"], "relation": edge["relation"],
            "confidence": edge.get("confidence"), "provenance": edge.get("provenance")
        }
        for edge in rel.get("relationships", [])
    ], key=lambda edge: (edge["from"], edge["relation"], edge["to"]))

    files = [ROOT / "frameworks.yaml", ROOT / "catalog.yaml", ROOT / "relationships.yaml"]
    snapshot = {
        "snapshot_schema": "1.0",
        "version": args.version,
        "dataset_updated": max(str(fw.get("updated", "")), str(cat.get("updated", "")), str(rel.get("updated", ""))),
        "source_sha256": canonical_hash(files),
        "counts": {"entries": len(entries), "relationships": len(relationships)},
        "entries": entries,
        "relationships": relationships,
    }

    path = ROOT / args.output
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(snapshot["counts"]))

if __name__ == "__main__":
    main()
