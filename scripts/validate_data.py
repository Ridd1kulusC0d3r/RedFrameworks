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
    resources_doc = validate_schema("resources.yaml", "schemas/resources.schema.json")
    learning_doc = validate_schema("learning-paths.yaml", "schemas/learning-paths.schema.json")
    adversary_doc = validate_schema("data/adversaries.yaml", "schemas/adversaries.schema.json")
    intelligence_sources_doc = validate_schema("data/intelligence-sources.yaml", "schemas/intelligence-sources.schema.json")
    emulation_plans_doc = validate_schema("data/emulation-plans.yaml", "schemas/emulation-plans.schema.json")

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
        for source_ref in edge.get("source_refs", []) or []:
            if source_ref not in known:
                raise SystemExit("Broken relationship source_ref: " + json.dumps(edge))
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

    framework_ids = {entry["id"] for entry in framework_doc.get("frameworks", [])}
    tool_ids = {entry["id"] for entry in catalog_doc.get("entries", [])}
    book_ids = {entry["id"] for entry in resources_doc.get("books", [])}
    cert_ids = {entry["id"] for entry in resources_doc.get("certifications", [])}

    adversary_ids = [entry["id"] for entry in adversary_doc.get("adversaries", [])]
    adversary_attack_ids = [entry["attack_id"] for entry in adversary_doc.get("adversaries", [])]
    if len(adversary_ids) != len(set(adversary_ids)):
        raise SystemExit("Duplicate adversary IDs")
    if len(adversary_attack_ids) != len(set(adversary_attack_ids)):
        raise SystemExit("Duplicate adversary ATT&CK IDs")

    source_ids = [entry["id"] for entry in intelligence_sources_doc.get("sources", [])]
    if len(source_ids) != len(set(source_ids)):
        raise SystemExit("Duplicate intelligence source IDs")

    plan_ids = [entry["id"] for entry in emulation_plans_doc.get("plans", [])]
    if len(plan_ids) != len(set(plan_ids)):
        raise SystemExit("Duplicate emulation plan IDs")

    resource_ids = list(book_ids) + list(cert_ids)
    resource_duplicates = sorted({value for value in resource_ids if resource_ids.count(value) > 1})
    if resource_duplicates:
        raise SystemExit("Duplicate resource IDs: " + ", ".join(resource_duplicates))

    for path in learning_doc.get("paths", []):
        checks = [
            ("frameworks", framework_ids),
            ("tools", tool_ids),
            ("books", book_ids),
            ("certifications", cert_ids),
        ]
        for field, known_set in checks:
            missing = sorted(set(path.get(field, [])) - known_set)
            if missing:
                raise SystemExit(f"Learning path {path['id']} has unknown {field}: {', '.join(missing)}")

    scorecard_schema = load_json(ROOT / "schemas/scorecard.schema.json")
    scorecard_validator = Draft202012Validator(scorecard_schema, format_checker=FormatChecker())
    scorecard_count = 0
    for path in sorted((ROOT / "examples/purple-team").glob("scorecard-*.yaml")):
        scorecard = load_yaml(path)
        errors = sorted(scorecard_validator.iter_errors(scorecard), key=lambda e: list(e.absolute_path))
        if errors:
            lines = []
            for error in errors:
                location = ".".join(str(x) for x in error.absolute_path) or "<root>"
                lines.append(f"{path.relative_to(ROOT)}:{location}: {error.message}")
            raise SystemExit("\n".join(lines))
        scorecard_count += 1
        print(f"OK scorecard schema: {path.relative_to(ROOT)}")

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

    print(
        f"OK integrity: {len(entries)} entries, {len(seen)} relationships, "
        f"{len(resources_doc.get('books', []))} books, {len(resources_doc.get('certifications', []))} certifications, "
        f"{len(learning_doc.get('paths', []))} learning paths, "
        f"{len(adversary_doc.get('adversaries', []))} adversaries, {len(intelligence_sources_doc.get('sources', []))} CTI sources, "
        f"{len(emulation_plans_doc.get('plans', []))} emulation plans, {scenario_count} scenarios, {scorecard_count} scorecards"
    )

if __name__ == "__main__":
    main()
