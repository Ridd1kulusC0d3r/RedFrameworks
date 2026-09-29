#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
FLOW_EXTENSION = "extension-definition--fb9c968a-745b-4ade-9b25-c324172197f4"


def load_json(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def validate_navigator(path):
    layer = load_json(path)
    assert layer["name"], f"{path}: missing name"
    assert layer["domain"] in {"enterprise-attack", "mobile-attack", "ics-attack"}, f"{path}: bad domain"
    versions = layer.get("versions", {})
    assert versions.get("layer") == "4.5", f"{path}: expected layer format 4.5"
    assert isinstance(layer.get("techniques"), list) and layer["techniques"], f"{path}: no techniques"
    for technique in layer["techniques"]:
        assert technique.get("techniqueID", "").startswith("T"), f"{path}: invalid technique ID"


def validate_flow(path):
    bundle = load_json(path)
    assert bundle.get("type") == "bundle", f"{path}: expected STIX bundle"
    objects = bundle.get("objects", [])
    ids = {obj.get("id") for obj in objects if obj.get("id")}
    assert FLOW_EXTENSION in ids, f"{path}: Attack Flow extension definition missing"

    flows = [o for o in objects if o.get("type") == "attack-flow"]
    assert flows, f"{path}: no attack-flow object"

    for obj in objects:
        if obj.get("type") in {"attack-flow", "attack-action", "attack-condition", "attack-operator", "attack-asset"}:
            assert obj.get("spec_version") == "2.1", f"{path}: custom SDO must use STIX 2.1"
            assert FLOW_EXTENSION in obj.get("extensions", {}), f"{path}: custom SDO missing extension"
        for key in ("start_refs", "effect_refs", "on_true_refs", "on_false_refs"):
            for ref in obj.get(key, []) or []:
                assert ref in ids, f"{path}: unresolved reference {ref}"

    for flow in flows:
        assert flow.get("scope") in {
            "incident", "campaign", "threat-actor", "malware",
            "emulation-plan", "attack-tree", "other"
        }, f"{path}: invalid scope"
        assert flow.get("start_refs"), f"{path}: flow requires start_refs"


def validate_scorecard(path):
    with path.open("r", encoding="utf-8") as handle:
        doc = yaml.safe_load(handle)
    assert doc.get("scenario", {}).get("id"), f"{path}: scenario id missing"
    weights = doc.get("weights", {})
    assert abs(sum(float(v) for v in weights.values()) - 1.0) < 0.001, f"{path}: weights must sum to 1"
    assert doc.get("techniques"), f"{path}: techniques missing"


def main():
    for path in sorted((ROOT / "examples/attack-navigator").glob("*.json")):
        validate_navigator(path)
        print(f"OK Navigator: {path.relative_to(ROOT)}")

    for path in sorted((ROOT / "examples/attack-flow").glob("*.json")):
        validate_flow(path)
        print(f"OK Attack Flow: {path.relative_to(ROOT)}")

    for path in sorted((ROOT / "examples/purple-team").glob("*.yaml")):
        validate_scorecard(path)
        print(f"OK scorecard: {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
