#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]

def load_yaml(path: Path, fallback=None):
    if not path.exists():
        return fallback if fallback is not None else {}
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}

def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="generated-metrics/knowledge-graph-v3.json")
    args = parser.parse_args()

    frameworks = load_yaml(ROOT / "frameworks.yaml").get("frameworks", [])
    catalog = load_yaml(ROOT / "catalog.yaml").get("entries", [])
    relationships = load_yaml(ROOT / "relationships.yaml").get("relationships", [])
    adversaries = load_yaml(ROOT / "data/adversaries.yaml").get("adversaries", [])
    campaigns = load_yaml(ROOT / "data/campaigns.yaml").get("campaigns", [])
    detections = load_yaml(ROOT / "data/detection-intelligence.yaml").get("detections", [])
    plans = load_yaml(ROOT / "data/emulation-plans.yaml").get("plans", [])
    packs = load_yaml(ROOT / "packs/index.yaml").get("packs", [])
    ai_surfaces = load_yaml(ROOT / "data/ai-security-surface.yaml").get("surfaces", [])

    nodes = {}
    edges = []
    seen_edges = set()

    def add_node(node_id, kind, name, **extra):
        nodes[node_id] = {"id": node_id, "kind": kind, "name": name, **extra}

    def add_edge(source, target, relation, confidence="medium", provenance="generated", **extra):
        key = (source, target, relation)
        if key in seen_edges or source not in nodes or target not in nodes:
            return
        seen_edges.add(key)
        edges.append({
            "from": source, "to": target, "relation": relation,
            "confidence": confidence, "provenance": provenance, **extra
        })

    for item in frameworks:
        add_node(item["id"], "framework", item["name"], domains=item.get("domain", []), status=item.get("status"))
    for item in catalog:
        add_node(item["id"], "tool", item["name"], domains=item.get("domains", []), status=item.get("status"))

    for item in adversaries:
        node_id = "adversary:" + item["id"]
        add_node(node_id, "adversary", item["name"], attack_id=item.get("attack_id"), actor_type=item.get("actor_type"))
        for sector in item.get("sectors", []):
            sid = "sector:" + slug(sector)
            add_node(sid, "sector", sector)
            add_edge(node_id, sid, "targets-sector", "medium", "adversary-profile")

    adversary_by_attack = {item.get("attack_id"): "adversary:" + item["id"] for item in adversaries if item.get("attack_id")}
    adversary_by_id = {item["id"]: "adversary:" + item["id"] for item in adversaries}

    for item in campaigns:
        cid = "campaign:" + item["id"]
        add_node(cid, "campaign", item["name"], attack_id=item.get("attack_id"), first_seen=item.get("first_seen"), last_seen=item.get("last_seen"))
        for actor_id in item.get("actor_ids", []):
            aid = adversary_by_id.get(actor_id)
            if aid:
                add_edge(cid, aid, "attributed-to", "high", "mitre-campaign")
        for sector in item.get("sectors", []):
            sid = "sector:" + slug(sector)
            add_node(sid, "sector", sector)
            add_edge(cid, sid, "targets-sector", "medium", "mitre-campaign")

    for item in detections:
        tid = "technique:" + item["attack_id"]
        did = "detection:" + item["id"]
        add_node(tid, "technique", item["name"], attack_id=item["attack_id"])
        add_node(did, "detection", item["name"] + " detection intelligence", telemetry=item.get("telemetry", []))
        add_edge(did, tid, "detects-behavior", "high", "redframeworks-detection-intelligence")

    for item in plans:
        pid = "plan:" + item["id"]
        add_node(pid, "emulation-plan", item["name"], provider=item.get("provider"), plan_type=item.get("plan_type"))
        aid = adversary_by_attack.get(item.get("attack_group_id"))
        if aid:
            add_edge(pid, aid, "models-adversary", "high", "authoritative-emulation-plan")

    for item in packs:
        pid = "pack:" + item["id"]
        add_node(pid, "domain-pack", item["name"], outcomes=item.get("outcomes", []))
        for ref in item.get("frameworks", []) + item.get("tools", []):
            add_edge(pid, ref, "includes", "high", "domain-pack")
        for ref in item.get("adversaries", []):
            aid = adversary_by_id.get(ref)
            if aid:
                add_edge(pid, aid, "prioritizes-adversary", "medium", "domain-pack")
        for ref in item.get("detections", []):
            did = "detection:" + ref
            add_edge(pid, did, "includes-detection", "high", "domain-pack")

    for item in ai_surfaces:
        sid = "ai-surface:" + item["id"]
        add_node(sid, "ai-security-surface", item["name"], risks=item.get("risks", []), evidence=item.get("evidence", []))
        if "mitre-atlas" in nodes:
            add_edge("mitre-atlas", sid, "models-ai-security-surface", "medium", "redframeworks-ai-taxonomy")

    for edge in relationships:
        add_edge(
            edge["from"], edge["to"], edge["relation"],
            edge.get("confidence", "medium"),
            edge.get("provenance", "curated"),
            source_refs=edge.get("source_refs", [])
        )

    stats = {}
    for node in nodes.values():
        stats[node["kind"]] = stats.get(node["kind"], 0) + 1

    out = {
        "schema_version": "3.0",
        "generated_from": [
            "frameworks.yaml", "catalog.yaml", "relationships.yaml", "data/adversaries.yaml",
            "data/campaigns.yaml", "data/detection-intelligence.yaml", "data/emulation-plans.yaml",
            "packs/index.yaml", "data/ai-security-surface.yaml"
        ],
        "stats": {"nodes": len(nodes), "edges": len(edges), "by_kind": stats},
        "nodes": sorted(nodes.values(), key=lambda row: (row["kind"], row["name"].lower())),
        "edges": sorted(edges, key=lambda row: (row["from"], row["to"], row["relation"]))
    }
    path = ROOT / args.output
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(out["stats"]))

if __name__ == "__main__":
    main()
