# Static API v4

RedFrameworks v6 publishes a read-only static API generated from canonical repository data.

Base:

`https://ridd1kulusc0d3r.github.io/RedFrameworks/`

## Version contract

| Version | Status | Scope |
|---|---|---|
| v1 | compatibility | catalog + relationships |
| v2 | compatibility | provenance + continuous-intelligence foundations |
| v3 | compatibility | resources, adversaries, learning paths and technique intelligence |
| v4 | **current** | campaigns, detections, domain packs, Knowledge Graph 3.0, Verification 2.0 and research corpus |

## v4 endpoints

| Endpoint | Purpose |
|---|---|
| `/api/v4/index.json` | API discovery |
| `/api/v4/catalog.json` | normalized frameworks and tools |
| `/api/v4/frameworks.json` | framework / standard dataset |
| `/api/v4/relationships.json` | curated framework/tool graph edges |
| `/api/v4/adversaries.json` | adversary profiles |
| `/api/v4/campaigns.json` | MITRE campaign intelligence |
| `/api/v4/detections.json` | defensive telemetry and detection intelligence |
| `/api/v4/emulation-plans.json` | authoritative plan metadata |
| `/api/v4/domain-packs.json` | domain intelligence packs |
| `/api/v4/ai-security-surface.json` | Shadow AI / AI system surface taxonomy |
| `/api/v4/knowledge-graph.json` | generated Knowledge Graph 3.0 |
| `/api/v4/verification-v2.json` | Verification Engine 2.0 output |
| `/api/v4/visual-intelligence.json` | sector/adversary and campaign visual data |
| `/api/v4/research-corpus.jsonl` | RAG-ready canonical research records |
| `/api/v4/resources.json` | books and certifications |
| `/api/v4/learning-paths.json` | learning paths |
| `/api/v4/techniques.json` | technique intelligence |
| `/api/v4/intelligence-sources.json` | CTI source library |

## Public applications

- `/graph/` — full-screen graph explorer
- `/planner/` — defensive adversary validation planner
- `/intelligence/` — visual adversary/campaign intelligence
- `/detail.html` — portable entity detail view

## Clients

- `sdk/python/redframeworks.py`
- `sdk/typescript/redframeworks.ts`

Both clients default to API v4.

## Interoperability

RedFrameworks continues to publish STIX 2.1, OpenCTI guidance, Neo4j graph exports, MISP-compatible reference data and ATT&CK Navigator layers.

Stable integration keys are entity IDs, not display names.

See [API deprecation policy](api-deprecation-policy.md).
