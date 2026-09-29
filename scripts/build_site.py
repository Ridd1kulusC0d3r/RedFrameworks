#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, shutil
from pathlib import Path
import yaml

ROOT=Path(__file__).resolve().parents[1]

def load_yaml(path):
    with path.open("r",encoding="utf-8") as handle:
        return yaml.safe_load(handle)

def as_list(value):
    if value is None: return []
    return value if isinstance(value,list) else [value]

def normalize():
    framework_doc=load_yaml(ROOT/"frameworks.yaml")
    catalog_doc=load_yaml(ROOT/"catalog.yaml")
    rel_path=ROOT/"relationships.yaml"
    rel_doc=load_yaml(rel_path) if rel_path.exists() else {"relationships":[]}
    items=[]

    for e in framework_doc.get("frameworks",[]):
        items.append({
            "id":e.get("id"),"name":e.get("name"),"aliases":as_list(e.get("aliases")),
            "type":e.get("type",e.get("category","framework")),"domains":as_list(e.get("domain")),
            "status":e.get("status","verified"),"model":e.get("model","reference"),"url":e.get("url"),
            "summary":"; ".join(as_list(e.get("best_for"))),"source":"frameworks.yaml",
            "evidence_tier":e.get("evidence_tier","A"),
            "last_reviewed":e.get("last_reviewed",framework_doc.get("updated"))
        })

    for e in catalog_doc.get("entries",[]):
        items.append({
            "id":e.get("id"),"name":e.get("name"),"aliases":as_list(e.get("aliases")),
            "type":e.get("type","tool"),"domains":as_list(e.get("domains")),
            "status":e.get("status","community"),"model":e.get("model","unknown"),"url":e.get("url"),
            "summary":e.get("role",""),"source":"catalog.yaml",
            "evidence_tier":e.get("evidence_tier","B" if e.get("url") else "C"),
            "last_reviewed":e.get("last_reviewed",catalog_doc.get("updated"))
        })

    for candidate in catalog_doc.get("watchlist",[]):
        name=candidate.get("name") if isinstance(candidate,dict) else candidate
        domains=as_list(candidate.get("domains")) if isinstance(candidate,dict) else ["research-watchlist"]
        note=candidate.get("note") if isinstance(candidate,dict) else None
        items.append({
            "id":"watch-"+str(name).lower().replace(" ","-"),"name":name,"aliases":[],
            "type":"candidate","domains":domains or ["research-watchlist"],"status":"watchlist",
            "model":"unverified","url":None,
            "summary":note or "Candidate awaiting provenance, maintenance and scope review.",
            "source":"catalog.yaml","evidence_tier":"D","last_reviewed":catalog_doc.get("updated")
        })

    known={i["id"] for i in items}
    relationships=[e for e in rel_doc.get("relationships",[]) if e.get("from") in known and e.get("to") in known]
    return {
        "generated_from":["frameworks.yaml","catalog.yaml","relationships.yaml"],
        "updated":max(str(framework_doc.get("updated","")),str(catalog_doc.get("updated","")),str(rel_doc.get("updated",""))),
        "items":sorted(items,key=lambda x:(x["name"] or "").lower()),
        "relationships":relationships
    }

def main():
    p=argparse.ArgumentParser(); p.add_argument("--output",default="_site"); args=p.parse_args()
    output=ROOT/args.output; static=ROOT/"site"
    if output.exists(): shutil.rmtree(output)
    shutil.copytree(static,output)
    data_dir=output/"data"; data_dir.mkdir(parents=True,exist_ok=True)
    payload=normalize()
    (data_dir/"catalog.json").write_text(json.dumps(payload,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    (output/".nojekyll").write_text("",encoding="utf-8")
    print(f"Built {len(payload['items'])} entries and {len(payload['relationships'])} relationships into {output}")

if __name__=="__main__": main()
