# Analyst Roadmap

The analyst roadmap is intentionally outcome-driven. It does not begin with "install 47 tools."

```mermaid
flowchart TD
  Q[1 · Define the security question]
  S[2 · Scope and authorization]
  T[3 · Threat / behavior model]
  M[4 · Select methodology]
  V[5 · Design controlled validation]
  O[6 · Observe telemetry]
  D[7 · Validate detection]
  R[8 · Measure response]
  E[9 · Build evidence]
  X[10 · Retest]

  Q --> S --> T --> M --> V --> O --> D --> R --> E --> X
```

## Stage 1 — Question

Define:

- business service;
- asset / identity / application class;
- security hypothesis;
- required evidence.

## Stage 2 — Methodology

Choose the governing approach:

- PTES / NIST for general assessment;
- WSTG / MASTG / ISTG for domain testing;
- TIBER-EU / CBEST / CREST TLPT for relevant threat-led programs.

## Stage 3 — Behavior

Use ATT&CK, ATLAS or Attack Flow to describe behavior and sequence.

## Stage 4 — Validation

Choose validation tooling based on the objective, not popularity.

## Stage 5 — Defensive outcome

Measure:

- telemetry;
- detection;
- analyst recognition;
- containment;
- evidence quality;
- retest status.
