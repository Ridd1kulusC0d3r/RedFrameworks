#!/usr/bin/env sh
set -eu

BASE="https://ridd1kulusc0d3r.github.io/RedFrameworks/api/v2"

echo "API metadata:"
curl -fsSL "https://ridd1kulusc0d3r.github.io/RedFrameworks/api/version.json"

echo
echo "Standards intelligence:"
curl -fsSL "$BASE/standards.json"
