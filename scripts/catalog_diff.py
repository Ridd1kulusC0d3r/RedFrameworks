#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

def load(path):
    with Path(path).open("r", encoding="utf-8") as handle:
        return json.load(handle)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("before")
    parser.add_argument("after")
    parser.add_argument("--json", default="catalog-diff.json")
    parser.add_argument("--report", default="catalog-diff.md")
    args = parser.parse_args()

    before = load(args.before)
    after = load(args.after)

    b_entries = {item["id"]: item for item in before.get("entries", [])}
    a_entries = {item["id"]: item for item in after.get("entries", [])}

    added = sorted(set(a_entries) - set(b_entries))
    removed = sorted(set(b_entries) - set(a_entries))
    changed = []
    for item_id in sorted(set(a_entries) & set(b_entries)):
        old, new = b_entries[item_id], a_entries[item_id]
        delta = {}
        for field in ["name", "status", "type", "domains"]:
            if old.get(field) != new.get(field):
                delta[field] = {"before": old.get(field), "after": new.get(field)}
        if delta:
            changed.append({"id": item_id, "changes": delta})

    def edge_key(edge):
        return (edge["from"], edge["relation"], edge["to"])

    b_edges = {edge_key(edge): edge for edge in before.get("relationships", [])}
    a_edges = {edge_key(edge): edge for edge in after.get("relationships", [])}

    edge_added = [list(key) for key in sorted(set(a_edges) - set(b_edges))]
    edge_removed = [list(key) for key in sorted(set(b_edges) - set(a_edges))]

    result = {
        "before": before.get("version"),
        "after": after.get("version"),
        "entries_added": added,
        "entries_removed": removed,
        "entries_changed": changed,
        "relationships_added": edge_added,
        "relationships_removed": edge_removed,
    }
    Path(args.json).write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lines = [
        f"# Catalog semantic diff: {result['before']} -> {result['after']}", "",
        f"- Added entries: **{len(added)}**",
        f"- Removed entries: **{len(removed)}**",
        f"- Changed entries: **{len(changed)}**",
        f"- Added relationships: **{len(edge_added)}**",
        f"- Removed relationships: **{len(edge_removed)}**", "",
    ]
    if added:
        lines += ["## Added", ""] + [f"- {item}" for item in added] + [""]
    if removed:
        lines += ["## Removed", ""] + [f"- {item}" for item in removed] + [""]
    if changed:
        lines += ["## Changed", ""] + [f"- {item['id']}: {', '.join(item['changes'].keys())}" for item in changed] + [""]
    Path(args.report).write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps({
        "entries_added": len(added),
        "entries_removed": len(removed),
        "entries_changed": len(changed),
        "relationships_added": len(edge_added),
        "relationships_removed": len(edge_removed)
    }))

if __name__ == "__main__":
    main()
