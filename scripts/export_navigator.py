#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]

def collect_techniques():
    techniques = {}
    for path in sorted((ROOT / "examples").rglob("*.yaml")):
        try:
            doc = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        except Exception:
            continue
        for item in doc.get("techniques", []) or []:
            if isinstance(item, dict):
                tid = item.get("id")
                if tid and str(tid).startswith("T"):
                    techniques.setdefault(tid, {"techniqueID": tid, "score": 50, "comment": "Referenced by RedFrameworks validation examples."})
        mappings = doc.get("mappings", {}) or {}
        for tid in mappings.get("attack", []) or []:
            techniques.setdefault(tid, {"techniqueID": tid, "score": 50, "comment": "Referenced by RedFrameworks scenario mappings."})
    return sorted(techniques.values(), key=lambda item: item["techniqueID"])

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--output", default="exports/attack-navigator/redframeworks-v5.json")
    args=parser.parse_args()
    out=ROOT / args.output
    out.parent.mkdir(parents=True,exist_ok=True)
    layer={
        "name":"RedFrameworks v5 validation coverage",
        "versions":{"attack":"19","navigator":"4.5","layer":"4.5"},
        "domain":"enterprise-attack",
        "description":"ATT&CK techniques referenced by RedFrameworks defensive-validation examples.",
        "filters":{"platforms":[]},
        "sorting":0,
        "layout":{"layout":"side","aggregateFunction":"average","showID":True,"showName":True,"showAggregateScores":False,"countUnscored":False},
        "hideDisabled":False,
        "techniques":collect_techniques(),
        "gradient":{"colors":["#ffffff","#f0bd67","#f04f67"],"minValue":0,"maxValue":100},
        "legendItems":[{"label":"Referenced validation technique","color":"#f04f67"}],
        "metadata":[{"name":"source","value":"RedFrameworks"}],
        "links":[]
    }
    out.write_text(json.dumps(layer,indent=2)+"\n",encoding="utf-8")
    print(f"Generated {len(layer['techniques'])} ATT&CK technique references")

if __name__=="__main__":
    main()
