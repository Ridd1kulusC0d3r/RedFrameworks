#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import urllib.request
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
ATTACK_STIX = "https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json"

def load_yaml(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}

def external_id(obj):
    for ref in obj.get("external_references", []) or []:
        if ref.get("source_name") == "mitre-attack":
            return ref.get("external_id")
    return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", default="cti-delta.json")
    parser.add_argument("--report", default="cti-delta.md")
    args = parser.parse_args()

    request = urllib.request.Request(ATTACK_STIX, headers={"User-Agent":"RedFrameworks-CTI-Collector/1.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        bundle = json.load(response)

    known_groups = {row["attack_id"] for row in load_yaml(ROOT/"data/adversaries.yaml").get("adversaries", [])}
    known_campaigns = {row["attack_id"] for row in load_yaml(ROOT/"data/campaigns.yaml").get("campaigns", [])}

    groups, campaigns = [], []
    for obj in bundle.get("objects", []):
        if obj.get("revoked") or obj.get("x_mitre_deprecated"):
            continue
        ext = external_id(obj)
        if obj.get("type") == "intrusion-set" and ext and ext.startswith("G") and ext not in known_groups:
            groups.append({"attack_id":ext,"name":obj.get("name"),"modified":obj.get("modified")})
        elif obj.get("type") == "campaign" and ext and ext.startswith("C") and ext not in known_campaigns:
            campaigns.append({"attack_id":ext,"name":obj.get("name"),"modified":obj.get("modified")})

    result = {
        "policy":"Proposal-only collector. No canonical dataset is modified automatically.",
        "source":ATTACK_STIX,
        "new_groups":sorted(groups,key=lambda x:x["attack_id"]),
        "new_campaigns":sorted(campaigns,key=lambda x:x["attack_id"]),
    }
    (ROOT/args.json).write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    lines=["# ATT&CK CTI delta","","Automated proposal-only discovery. Human review is required before canonical data changes.","",
           f"- New groups: **{len(groups)}**",f"- New campaigns: **{len(campaigns)}**",""]
    if groups:
        lines += ["## Candidate groups",""] + [f"- `{x['attack_id']}` · {x['name']}" for x in groups[:100]] + [""]
    if campaigns:
        lines += ["## Candidate campaigns",""] + [f"- `{x['attack_id']}` · {x['name']}" for x in campaigns[:100]] + [""]
    (ROOT/args.report).write_text("\n".join(lines)+"\n",encoding="utf-8")
    print(json.dumps({"new_groups":len(groups),"new_campaigns":len(campaigns)}))

if __name__=="__main__":
    main()
