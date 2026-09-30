#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]

def load_yaml(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", default="exports/neo4j")
    args = parser.parse_args()
    out = ROOT / args.output_dir
    out.mkdir(parents=True, exist_ok=True)

    fw = load_yaml(ROOT / "frameworks.yaml")
    cat = load_yaml(ROOT / "catalog.yaml")
    rel = load_yaml(ROOT / "relationships.yaml")

    nodes = []
    for item in fw.get("frameworks", []):
        nodes.append({
            "id:ID": item["id"], "name": item["name"], ":LABEL": "Framework",
            "status": item.get("status", ""), "type": item.get("type", ""),
            "domains:string[]": ";".join(item.get("domain", [])), "url": item.get("url", "")
        })
    for item in cat.get("entries", []):
        nodes.append({
            "id:ID": item["id"], "name": item["name"], ":LABEL": "Tool",
            "status": item.get("status", ""), "type": item.get("type", ""),
            "domains:string[]": ";".join(item.get("domains", [])), "url": item.get("url", "")
        })

    with (out / "nodes.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["id:ID","name",":LABEL","status","type","domains:string[]","url"])
        writer.writeheader(); writer.writerows(nodes)

    with (out / "relationships.csv").open("w", newline="", encoding="utf-8") as handle:
        fields=[":START_ID",":END_ID",":TYPE","relation","confidence","provenance"]
        writer=csv.DictWriter(handle,fieldnames=fields); writer.writeheader()
        for edge in rel.get("relationships", []):
            writer.writerow({
                ":START_ID": edge["from"], ":END_ID": edge["to"], ":TYPE": "RELATED_TO",
                "relation": edge["relation"], "confidence": edge.get("confidence", ""),
                "provenance": edge.get("provenance", "")
            })

    (out / "README.txt").write_text(
        "Neo4j import artifacts generated from RedFrameworks canonical catalog.\n"
        "Nodes and edges contain descriptive metadata only; they are not operational instructions.\n",
        encoding="utf-8"
    )
    print(f"Generated {len(nodes)} nodes")

if __name__ == "__main__":
    main()
