# Framework Crosswalks

RedFrameworks v4 adds crosswalks that are explicit about **what kind of relationship is being claimed**.

## ATT&CK ↔ D3FEND

See `data/attack-d3fend-examples.yaml`.

The examples use MITRE D3FEND offensive-technique pages and preserve D3FEND's wording that these are **inferred relationships**. They should not be treated as a simple "ATT&CK technique = D3FEND control" lookup.

## AI security

See `data/ai-crosswalk.yaml`.

The AI crosswalk connects:

- MITRE ATLAS;
- OWASP GenAI LLM Top 10 2026;
- OWASP Top 10 for Agentic Applications 2026;
- NIST AI 600-1.

These frameworks operate at different abstraction levels, so the relationship is conceptual and analyst-oriented rather than a direct equivalence.

## Why this matters

A useful knowledge graph should preserve uncertainty. RedFrameworks therefore records:

- relationship type;
- confidence;
- provenance;
- source references;
- mapping warnings where needed.
