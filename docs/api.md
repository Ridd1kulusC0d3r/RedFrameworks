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
| `/api/lifecycle.json` | renames, legacy transitions and lifecycle events |
| `/api/changelog.json` | machine-readable platform changes |
| `/api/releases/v3.0.0.json` | versioned release manifest |
| `/api/redframeworks-stix-2.1.json` | STIX 2.1 bundle |
| `/api/opencti-import-manifest.json` | OpenCTI-oriented import metadata |
| `/data/upstream-health.json` | public GitHub upstream health signals |

Base URL:

`https://ridd1kulusc0d3r.github.io/RedFrameworks/`

## Stability

The API is generated, read-only and intended for research, dashboards and defensive-security integrations.

Consumers should use IDs rather than display names as stable keys.

## Provenance fields

Normalized objects can include:

- evidence tier;
- last review date;
- provenance score;
- upstream health;
- last upstream activity;
- latest release metadata.

A provenance score is a curation signal. It is not a universal product ranking.

## Interoperability

The Pages build also generates:

- a STIX 2.1 bundle containing catalog objects and relationships;
- an OpenCTI import manifest describing the generated STIX asset;
- per-entity HTML pages using the same stable IDs as the API.
