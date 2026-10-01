#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]

def load(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="generated-metrics/research-corpus.jsonl")
    args = parser.parse_args()
    records = []

    for item in load(ROOT / "frameworks.yaml").get("frameworks", []):
        records.append({"id":"framework:"+item["id"],"kind":"framework","title":item["name"],"text":"; ".join(item.get("best_for", [])),"source":item.get("url"),"metadata":{"domains":item.get("domain",[]),"status":item.get("status")}})
    for item in load(ROOT / "catalog.yaml").get("entries", []):
        records.append({"id":"tool:"+item["id"],"kind":"tool","title":item["name"],"text":item.get("role",""),"source":item.get("url"),"metadata":{"domains":item.get("domains",[]),"status":item.get("status"),"tier":item.get("evidence_tier")}})
    for item in load(ROOT / "data/adversaries.yaml").get("adversaries", []):
        records.append({"id":"adversary:"+item["id"],"kind":"adversary","title":item["name"],"text":item.get("attribution",""),"source":item.get("source"),"metadata":{"aliases":item.get("aliases",[]),"sectors":item.get("sectors",[]),"defensive_focus":item.get("defensive_focus",[])}})
    for item in load(ROOT / "data/campaigns.yaml").get("campaigns", []):
        records.append({"id":"campaign:"+item["id"],"kind":"campaign","title":item["name"],"text":"; ".join(item.get("themes",[])),"source":item.get("source"),"metadata":{"sectors":item.get("sectors",[]),"regions":item.get("regions",[]),"defensive_focus":item.get("defensive_focus",[])}})
    for item in load(ROOT / "data/detection-intelligence.yaml").get("detections", []):
        records.append({"id":"detection:"+item["id"],"kind":"detection","title":item["name"],"text":"; ".join(item.get("analytics",[])),"source":item.get("source"),"metadata":{"attack_id":item.get("attack_id"),"telemetry":item.get("telemetry",[]),"evidence":item.get("evidence",[])}})
    for item in load(ROOT / "data/emulation-plans.yaml").get("plans", []):
        records.append({"id":"plan:"+item["id"],"kind":"emulation-plan","title":item["name"],"text":item.get("purpose",""),"source":item.get("source"),"metadata":{"actor":item.get("actor"),"defensive_focus":item.get("defensive_focus",[])}})
    for item in load(ROOT / "packs/index.yaml").get("packs", []):
        records.append({"id":"pack:"+item["id"],"kind":"domain-pack","title":item["name"],"text":item.get("description",""),"source":None,"metadata":{"outcomes":item.get("outcomes",[])}})

    path = ROOT / args.output
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        for record in records:
            handle.write(json.dumps(record, ensure_ascii=False) + "\n")
    print(json.dumps({"records": len(records), "output": str(path)}))

if __name__ == "__main__":
    main()
