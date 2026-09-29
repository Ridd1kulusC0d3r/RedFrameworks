#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
NS = uuid.UUID("f8b4ee99-7e6c-4fd2-b989-6a761bf56e31")

def load_yaml(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)

def stix_id(prefix, value):
    return f"{prefix}--{uuid.uuid5(NS, value)}"

def timestamp():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

def build_bundle():
    fw = load_yaml(ROOT / "frameworks.yaml")
    cat = load_yaml(ROOT / "catalog.yaml")
    rel = load_yaml(ROOT / "relationships.yaml")
    created = timestamp()

    identity_id = stix_id("identity", "RedFrameworks")
    objects = [{
        "type": "identity",
        "spec_version": "2.1",
        "id": identity_id,
        "created": created,
        "modified": created,
        "name": "RedFrameworks",
        "identity_class": "organization",
        "description": "Curated offensive-security and threat-informed validation knowledge base."
    }]

    entries = []
    for item in fw.get("frameworks", []):
        entries.append({
            "id": item["id"], "name": item["name"], "type": item.get("type", "framework"),
            "summary": "; ".join(item.get("best_for", [])), "url": item.get("url"),
            "domains": item.get("domain", []), "status": item.get("status", "verified")
        })
    for item in cat.get("entries", []):
        entries.append({
            "id": item["id"], "name": item["name"], "type": item.get("type", "tool"),
            "summary": item.get("role", ""), "url": item.get("url"),
            "domains": item.get("domains", []), "status": item.get("status", "community")
        })

    note_ids = {}
    for item in entries:
        note_id = stix_id("note", item["id"])
        note_ids[item["id"]] = note_id
        refs = [item["url"]] if item.get("url") else []
        objects.append({
            "type": "note",
            "spec_version": "2.1",
            "id": note_id,
            "created_by_ref": identity_id,
            "created": created,
            "modified": created,
            "abstract": item["name"],
            "content": item["summary"] or item["name"],
            "object_refs": [identity_id],
            "external_references": [{"source_name": "upstream", "url": url} for url in refs],
            "x_redframeworks_id": item["id"],
            "x_redframeworks_type": item["type"],
            "x_redframeworks_domains": item["domains"],
            "x_redframeworks_status": item["status"]
        })

    for edge in rel.get("relationships", []):
        if edge["from"] not in note_ids or edge["to"] not in note_ids:
            continue
        objects.append({
            "type": "relationship",
            "spec_version": "2.1",
            "id": stix_id("relationship", f"{edge['from']}:{edge['relation']}:{edge['to']}"),
            "created_by_ref": identity_id,
            "created": created,
            "modified": created,
            "relationship_type": "related-to",
            "source_ref": note_ids[edge["from"]],
            "target_ref": note_ids[edge["to"]],
            "description": edge["relation"],
            "x_redframeworks_relation": edge["relation"]
        })

    bundle = {"type": "bundle", "id": stix_id("bundle", created), "objects": objects}
    return bundle

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", default="exports")
    args = parser.parse_args()
    out = ROOT / args.output_dir
    out.mkdir(parents=True, exist_ok=True)

    bundle = build_bundle()
    raw = json.dumps(bundle, indent=2, ensure_ascii=False) + "\n"
    (out / "redframeworks-stix-2.1.json").write_text(raw, encoding="utf-8")

    manifest = {
        "format": "STIX 2.1",
        "consumer": "OpenCTI-compatible STIX import pipeline",
        "generated_sha256": hashlib.sha256(raw.encode()).hexdigest(),
        "objects": len(bundle["objects"]),
        "bundle_file": "redframeworks-stix-2.1.json"
    }
    (out / "opencti-import-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest))

if __name__ == "__main__":
    main()
