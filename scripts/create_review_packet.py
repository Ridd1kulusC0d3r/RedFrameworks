#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]

def load_yaml(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", required=True)
    parser.add_argument("--verification", default="verification-queue.json")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    catalog = load_yaml(ROOT / "catalog.yaml")
    entry = next((item for item in catalog.get("entries", []) if item.get("id") == args.id), None)
    if not entry:
        raise SystemExit("Unknown catalog ID: " + args.id)
    if entry.get("status") != "not-verified":
        raise SystemExit(args.id + " is not a NOT VERIFIED candidate")

    verification = json.loads((ROOT / args.verification).read_text(encoding="utf-8"))
    review = next((item for item in verification.get("entries", []) if item.get("id") == args.id), {})
    release = review.get("latest_release") or {}

    lines = [
        "# Research review packet — " + entry["name"], "",
        "> Evidence assistance only. This packet never promotes the entry automatically.", "",
        "## Candidate", "",
        "- ID: " + entry["id"],
        "- Current status: " + str(entry.get("status")),
        "- Evidence tier: " + str(entry.get("evidence_tier")),
        "- Model: " + str(entry.get("model")),
        "- Domains: " + ", ".join(entry.get("domains", [])),
        "- Candidate URL: " + str(entry.get("url") or "not recorded"), "",
        "## Automated provenance signals", "",
        "- Readiness: " + str(review.get("readiness_percent", 0)) + "%",
        "- Upstream health: " + str(review.get("upstream_health", "not-checked")),
        "- Repository: " + str(review.get("repository") or "not resolved"),
        "- Owner: " + str(review.get("owner") or "not resolved") + " (" + str(review.get("owner_type") or "unknown") + ")",
        "- License SPDX: " + str(review.get("license_spdx") or "not resolved"),
        "- Latest release: " + str(release.get("tag") or "not resolved"), "",
        "## Checks", ""
    ]
    for name, ok in (review.get("checks") or {}).items():
        lines.append("- [" + ("x" if ok else " ") + "] " + name)

    lines += [
        "", "## Human review gate", "",
        "- [ ] Canonical upstream confirmed",
        "- [ ] Maintainer / organization confirmed",
        "- [ ] License / commercial model confirmed",
        "- [ ] Maintenance and lifecycle reviewed",
        "- [ ] Taxonomy and domains reviewed",
        "- [ ] Primary use case documented",
        "- [ ] Evidence tier justified",
        "- [ ] Relationship edges reviewed",
        "- [ ] Promotion target approved",
        "", "## Reviewer decision", "",
        "Record the human decision in this PR before changing catalog status."
    ]

    out = ROOT / args.output
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(out)

if __name__ == "__main__":
    main()
