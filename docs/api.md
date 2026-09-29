# Static API v2

RedFrameworks publishes a read-only API generated from the canonical repository data.

Base URL:

`https://ridd1kulusc0d3r.github.io/RedFrameworks/`

## Version contract

| Path | Status | Purpose |
|---|---|---|
| `/api/version.json` | current | API discovery and supported versions |
| `/api/v1/` | compatibility | original catalog + relationship contract |
| `/api/v2/` | current | enriched v4 intelligence contract |
| `/api/` | compatibility alias | convenient unversioned access |

## v2 endpoints

| Endpoint | Purpose |
|---|---|
| `/api/v2/catalog.json` | normalized frameworks, platforms, tools and NOT VERIFIED research candidates |
| `/api/v2/not-verified.json` | research candidates requiring verification |
| `/api/v2/frameworks.json` | canonical frameworks dataset |
| `/api/v2/relationships.json` | graph edges with confidence and provenance |
| `/api/v2/standards.json` | standards/version intelligence |
| `/api/v2/ai-crosswalk.json` | conceptual AI security crosswalk |
| `/api/v2/attack-d3fend.json` | selected defensive relationship examples |
| `/api/v2/lifecycle.json` | renames, legacy transitions and lifecycle events |
| `/api/v2/changelog.json` | machine-readable platform changes |
| `/api/v2/releases/` | release manifests |

Additional generated artifacts:

- `/api/redframeworks-stix-2.1.json`
- `/api/opencti-import-manifest.json`
- `/data/upstream-health.json`
- `/data/coverage-series.json`
- `/data/regressions.json`
- `/data/evidence-trend.json`

## Consumer examples

See:

- `examples/consumers/python.py`
- `examples/consumers/typescript.ts`
- `examples/consumers/shell.sh`
- `examples/opencti/README.md`

## Stability

Stable integration keys are entity IDs, not display names.

The v2 contract adds provenance, verification-state, standards intelligence and measurement datasets without silently redefining v1.
