#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import yaml

ROOT = Path(__file__).resolve().parents[1]

def load_yaml(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)

def fetch(url):
    request = Request(url, headers={"User-Agent": "RedFrameworks-standards-watch", "Accept": "application/json,text/html"})
    try:
        with urlopen(request, timeout=20) as response:
            return response.status, response.read().decode("utf-8", errors="replace")
    except (HTTPError, URLError) as error:
        return 0, str(error)

def observe(source):
    code, body = fetch(source["url"])
    if code != 200:
        return {"id": source["id"], "status": "unreachable", "observed": None, "expected": source["expected"], "http_status": code}

    if source["probe"] == "github-latest-release":
        payload = json.loads(body)
        tag = payload.get("tag_name", "")
        prefix = source.get("tag_prefix", "")
        observed = tag[len(prefix):] if prefix and tag.startswith(prefix) else tag
    else:
        match = re.search(source["pattern"], body, flags=re.IGNORECASE)
        observed = match.group(1) if match else None

    status = "match" if observed == source["expected"] else "changed"
    return {"id": source["id"], "status": status, "observed": observed, "expected": source["expected"], "http_status": code}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", default="standards-watch.json")
    parser.add_argument("--report", default="standards-watch.md")
    args = parser.parse_args()

    config = load_yaml(ROOT / "data/standards-sources.yaml")
    rows = [observe(source) for source in config.get("sources", [])]
    changed = [row for row in rows if row["status"] == "changed"]
    failures = [row for row in rows if row["status"] == "unreachable"]

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "changed_count": len(changed),
        "failure_count": len(failures),
        "results": rows,
    }
    Path(args.json).write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Standards intelligence watch", "",
        f"- Version changes detected: **{len(changed)}**",
        f"- Probe failures: **{len(failures)}**", "",
        "| Source | Expected | Observed | Status |",
        "|---|---:|---:|---|",
    ]
    for row in rows:
        lines.append(f"| {row['id']} | {row['expected']} | {row.get('observed') or '—'} | {row['status']} |")
    Path(args.report).write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"changed_count": len(changed), "failure_count": len(failures)}))

if __name__ == "__main__":
    main()
