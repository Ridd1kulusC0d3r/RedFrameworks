# Static API

The GitHub Pages build exposes a read-only API generated from the canonical YAML data.

## Endpoints

| Endpoint | Purpose |
|---|---|
| `/api/version.json` | API version, dataset date and object counts |
| `/api/catalog.json` | normalized frameworks, platforms and tools |
| `/api/frameworks.json` | canonical framework dataset |
| `/api/relationships.json` | knowledge-graph edges |
| `/api/watchlist.json` | research candidates |
| `/api/redframeworks-stix-2.1.json` | STIX 2.1 bundle |
| `/api/opencti-import-manifest.json` | OpenCTI-oriented import metadata |
| `/data/upstream-health.json` | public GitHub upstream health signals |

Base URL:

`https://ridd1kulusc0d3r.github.io/RedFrameworks/`

## Stability

The API is generated, read-only and intended for research, dashboards and defensive-security integrations.

Consumers should use IDs rather than display names as stable keys.

## Provenance

Each normalized catalog object can include:

- evidence tier;
- last review date;
- provenance score;
- upstream health;
- last upstream activity;
- latest release metadata.

A provenance score is a curation signal, not a claim that one security product or framework is universally superior.
