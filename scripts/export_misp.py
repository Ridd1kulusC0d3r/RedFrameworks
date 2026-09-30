#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import yaml

ROOT=Path(__file__).resolve().parents[1]

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--output",default="exports/misp/redframeworks-reference-event.json")
    args=parser.parse_args()

    fw=yaml.safe_load((ROOT/"frameworks.yaml").read_text(encoding="utf-8"))
    attrs=[]
    for item in fw.get("frameworks",[]):
        attrs.append({
            "type":"text","category":"External analysis","to_ids":False,
            "value":item["name"],"comment":f"RedFrameworks reference: {item['id']}"
        })
        if item.get("url"):
            attrs.append({
                "type":"link","category":"External analysis","to_ids":False,
                "value":item["url"],"comment":f"Canonical reference for {item['name']}"
            })
    event={
        "Event":{
            "info":"RedFrameworks public framework reference catalog",
            "date":datetime.now(timezone.utc).date().isoformat(),
            "distribution":"0",
            "analysis":"2",
            "threat_level_id":"4",
            "published":False,
            "Attribute":attrs
        }
    }
    out=ROOT/args.output
    out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(event,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(f"Generated {len(attrs)} non-IOC reference attributes")

if __name__=="__main__":
    main()
