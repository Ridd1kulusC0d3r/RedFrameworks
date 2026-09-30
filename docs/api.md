# Static API v3

RedFrameworks v5 publishes a read-only API generated from the canonical repository data.

Base:

`https://ridd1kulusc0d3r.github.io/RedFrameworks/`

## Discovery

`/api/version.json` describes the current contract, supported versions, counts and v3 endpoints.

## Version contract

| Version | Status | Scope |
|---|---|---|
| v1 | compatibility | catalog + relationships |
| v2 | compatibility | provenance + continuous intelligence |
| v3 | current | ecosystem portal, resources, learning paths, research and technique intelligence |

## v3 endpoints

| Endpoint | Purpose |
|---|---|
| `/api/v3/index.json` | API discovery and object counts |
| `/api/v3/catalog.json` | normalized frameworks and tools |
| `/api/v3/frameworks.json` | canonical frameworks dataset |
| `/api/v3/relationships.json` | graph edges with confidence and provenance |
| `/api/v3/not-verified.json` | visible research candidates |
| `/api/v3/resources.json` | books and certifications |
| `/api/v3/learning-paths.json` | objective-driven learning paths |
| `/api/v3/verification-queue.json` | NOT VERIFIED promotion-readiness signals |
| `/api/v3/techniques.json` | ATT&CK technique intelligence derived from validation examples |
| `/api/v3/adversaries.json` | source-attributed adversary intelligence profiles |
| `/api/v3/intelligence-sources.json` | CTI research and corroboration source library |
| `/api/v3/standards.json` | standards/version intelligence |
| `/api/v3/successors.json` | renames, successors and deprecations |
| `/api/v3/ai-crosswalk.json` | conceptual AI security crosswalk |
| `/api/v3/attack-d3fend.json` | selected ATT&CK ↔ D3FEND defensive context |
| `/api/v3/lifecycle.json` | lifecycle events |
| `/api/v3/changelog.json` | machine-readable platform changes |
| `/api/v3/releases/` | release manifests |

## Interoperability exports

Pages also publishes:

- STIX 2.1;
- OpenCTI import manifest;
- Neo4j nodes and relationships;
- ATT&CK Navigator layer;
- non-IOC MISP reference event;
- reproducible catalog snapshot.

Dedicated adversary profile pages are published under `/adversary/<id>/`.

## Client examples

- `sdk/python/redframeworks.py`
- `sdk/typescript/redframeworks.ts`
- `examples/consumers/`

Stable integration keys are entity IDs, not display names.

See [API deprecation policy](api-deprecation-policy.md).
