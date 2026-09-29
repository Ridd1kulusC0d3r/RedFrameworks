#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urlparse

import yaml
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]

def load_yaml(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)

def load_json(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)

def validate_schema(data_path, schema_path):
    data = load_yaml(ROOT / data_path)
    schema = load_json(ROOT / schema_path)
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    errors = sorted(validator.iter_errors(data), key=lambda e: list(e.absolute_path))
    if errors:
        lines = []
        for error in errors:
            location = ".".join(str(x) for x in error.absolute_path) or "<root>"
            lines.append(f"{data_path}:{location}: {error.message}")
        raise SystemExit("\n".join(lines))
    print(f"OK schema: {data_path}")
    return data

def main():
    framework_doc = validate_schema("frameworks.yaml", "schemas/frameworks.schema.json")
    catalog_doc = validate_schema("catalog.yaml", "schemas/catalog.schema.json")
    relationships_doc = validate_schema("relationships.yaml", "schemas/relationships.schema.json")

    entries = list(framework_doc.get("frameworks", [])) + list(catalog_doc.get("entries", []))
    ids = [entry["id"] for entry in entries]
    duplicates = sorted({value for value in ids if ids.count(value) > 1})
    if duplicates:
        raise SystemExit("Duplicate IDs: " + ", ".join(duplicates))

    names = {}
    for entry in entries:
        names.setdefault(entry["name"].strip().casefold(), []).append(entry["id"])
    dup_names = {name: refs for name, refs in names.items() if len(refs) > 1}
    if dup_names:
        raise SystemExit("Duplicate names: " + json.dumps(dup_names, ensure_ascii=False))

    known = set(ids)
    seen = set()
    for edge in relationships_doc.get("relationships", []):
        if edge["from"] not in known or edge["to"] not in known:
            raise SystemExit("Broken relationship: " + json.dumps(edge))
        if edge["from"] == edge["to"]:
            raise SystemExit("Self relationship: " + json.dumps(edge))
        key = (edge["from"], edge["to"], edge["relation"])
        if key in seen:
            raise SystemExit("Duplicate relationship: " + json.dumps(edge))
        seen.add(key)

    promoted = {entry["name"].strip().casefold() for entry in entries}
    watch = []
    for item in catalog_doc.get("watchlist", []):
        watch.append((item["name"] if isinstance(item, dict) else item).strip().casefold())
    overlap = sorted(promoted.intersection(watch))
    if overlap:
        raise SystemExit("Promoted entries still in watchlist: " + ", ".join(overlap))

    for entry in entries:
        url = entry.get("url")
        if not url:
            continue
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise SystemExit(f"Invalid URL for {entry['id']}: {url}")

    scenario_schema = load_json(ROOT / "schemas/scenario.schema.json")
    scenario_validator = Draft202012Validator(scenario_schema, format_checker=FormatChecker())
    scenario_count = 0
    for path in sorted((ROOT / "examples/scenarios").glob("*.yaml")):
        scenario = load_yaml(path)
        errors = sorted(scenario_validator.iter_errors(scenario), key=lambda e: list(e.absolute_path))
        if errors:
            lines = []
            for error in errors:
                location = ".".join(str(x) for x in error.absolute_path) or "<root>"
                lines.append(f"{path.relative_to(ROOT)}:{location}: {error.message}")
            raise SystemExit("\n".join(lines))
        scenario_count += 1
        print(f"OK scenario schema: {path.relative_to(ROOT)}")

    print(f"OK integrity: {len(entries)} entries, {len(seen)} relationships, {len(watch)} watchlist candidates, {scenario_count} scenarios")

if __name__ == "__main__":
    main()
