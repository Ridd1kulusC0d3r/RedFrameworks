#!/usr/bin/env python3
"""Minimal RedFrameworks Static API v2 consumer."""
from __future__ import annotations

import json
from urllib.request import urlopen

BASE = "https://ridd1kulusc0d3r.github.io/RedFrameworks/api/v2"

with urlopen(f"{BASE}/catalog.json", timeout=15) as response:
    catalog = json.load(response)

verified = [item for item in catalog if item.get("status") == "verified"]
print(f"catalog entries: {len(catalog)}")
print(f"verified entries: {len(verified)}")
for item in verified[:5]:
    print(f"- {item['name']} [{', '.join(item.get('domains', []))}]")
