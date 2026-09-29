#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

import yaml

ROOT = Path(__file__).resolve().parents[1]

def load_yaml(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)

def github_repo(url):
    if not url:
        return None
    parsed = urlparse(url)
    if parsed.netloc.lower() != "github.com":
        return None
    parts = [part for part in parsed.path.split("/") if part]
    return (parts[0], parts[1].removesuffix(".git")) if len(parts) >= 2 else None

def fetch_repo(owner, repo):
    request = Request(
        f"https://api.github.com/repos/{owner}/{repo}",
        headers={"Accept": "application/vnd.github+json", "User-Agent": "RedFrameworks-health-check"}
    )
    try:
        with urlopen(request, timeout=15) as response:
            return response.status, json.load(response)
    except HTTPError as error:
        return error.code, {"message": str(error)}
    except URLError as error:
        return 0, {"message": str(error)}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", default="upstream-health.json")
    parser.add_argument("--report", default="upstream-health.md")
    args = parser.parse_args()

    fw = load_yaml(ROOT / "frameworks.yaml")
    cat = load_yaml(ROOT / "catalog.yaml")
    entries = fw.get("frameworks", []) + cat.get("entries", [])
    now = datetime.now(timezone.utc)
    rows = []

    for entry in entries:
        target = github_repo(entry.get("url"))
        if not target:
            continue
        owner, repo = target
        code, payload = fetch_repo(owner, repo)
        if code != 200:
            rows.append({"id": entry["id"], "name": entry["name"], "repository": f"{owner}/{repo}", "health": "unreachable", "http_status": code})
            continue
        pushed = payload.get("pushed_at")
        age = None
        if pushed:
            stamp = datetime.fromisoformat(pushed.replace("Z", "+00:00"))
            age = (now - stamp).days
        if payload.get("archived"):
            health = "archived"
        elif age is not None and age > 365:
            health = "stale"
        else:
            health = "healthy"
        rows.append({
            "id": entry["id"], "name": entry["name"], "repository": payload.get("full_name"),
            "health": health, "archived": bool(payload.get("archived")), "pushed_at": pushed,
            "age_days": age, "default_branch": payload.get("default_branch"), "html_url": payload.get("html_url")
        })

    actionable = [row for row in rows if row["health"] in {"archived", "unreachable"}]
    stale = [row for row in rows if row["health"] == "stale"]
    data = {"generated_at": now.isoformat(), "checked": len(rows), "actionable_count": len(actionable), "stale_count": len(stale), "repositories": rows}
    Path(args.json).write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")

    lines = ["# Upstream health report", "", f"- Checked: **{len(rows)}**", f"- Actionable: **{len(actionable)}**", f"- Stale: **{len(stale)}**", "", "| Project | Repository | Health | Last push |", "|---|---|---|---|"]
    for row in rows:
        lines.append(f"| {row['name']} | {row['repository']} | {row['health']} | {row.get('pushed_at') or '—'} |")
    Path(args.report).write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"checked": len(rows), "actionable_count": len(actionable), "stale_count": len(stale)}))

if __name__ == "__main__":
    main()
