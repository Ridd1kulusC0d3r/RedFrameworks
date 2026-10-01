#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path

import yaml

ROOT=Path(__file__).resolve().parents[1]

def load(path):
    with path.open("r",encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--output",default="generated-metrics/visual-intelligence.json")
    args=parser.parse_args()
    adversaries=load(ROOT/"data/adversaries.yaml").get("adversaries",[])
    campaigns=load(ROOT/"data/campaigns.yaml").get("campaigns",[])
    sector_counts=Counter()
    actor_type=Counter()
    sector_actors=defaultdict(list)
    for actor in adversaries:
        actor_type[actor.get("actor_type","unknown")]+=1
        for sector in actor.get("sectors",[]):
            sector_counts[sector]+=1
            sector_actors[sector].append(actor["id"])
    timeline=[{
        "id":row["id"],"name":row["name"],"attack_id":row["attack_id"],
        "first_seen":row["first_seen"],"last_seen":row["last_seen"],
        "sectors":row.get("sectors",[]),"actors":row.get("actor_ids",[])
    } for row in campaigns]
    result={
        "actor_types":dict(actor_type.most_common()),
        "top_sectors":[{"sector":k,"count":v,"actors":sorted(sector_actors[k])} for k,v in sector_counts.most_common(30)],
        "campaign_timeline":sorted(timeline,key=lambda x:x["first_seen"]),
    }
    path=ROOT/args.output
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(json.dumps({"actors":len(adversaries),"campaigns":len(campaigns),"sectors":len(sector_counts)}))

if __name__=="__main__":
    main()
