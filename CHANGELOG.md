# Changelog

All notable RedFrameworks platform changes are recorded here. Machine-readable changes live in `data/changelog.yaml`.

## 5.2.0 — 2026-09-30

### Graph Intelligence

- rebuilt the embedded knowledge graph as an analyst workbench with 1–2 hop exploration, node modes, relationship statistics, provenance context and quick routes;
- added a dedicated full-screen graph explorer with pan, zoom, force/radial layouts, node filtering and an adversary layer;
- added a new Graph Intelligence architecture visual.

### Ecosystem expansion

- added 11 verified frameworks across identity, supply chain, cloud, IoT, governance and application security;
- expanded adversary intelligence by 20 ATT&CK-tracked groups, bringing public coverage to 42 profiles;
- added 15 curated framework relationships, bringing the canonical graph to 89 edges.

### GitHub & Pages

- redesigned the README around live project counts and visual coverage;
- added a portable static-data path to support fallback hosting;
- hardened Pages deployment against legacy branch/root rendering.

## 5.1.0 — 2026-09-29

### Adversary intelligence

- added 22 source-attributed ATT&CK adversary profiles;
- added aliases, actor type, motivation, sector, region, defensive-focus and profile-version metadata;
- added a curated CTI source library and dedicated adversary profile pages;
- added adversary search/filtering and command-palette integration.

### Framework expansion

- added 13 CTI, incident-response, resilience and vulnerability-management frameworks and standards;
- connected the new frameworks to the knowledge graph with provenance-aware relationships.

### Visual system

- added original RedFrameworks intelligence, adversary and CTI-stack SVG visuals;
- expanded the README and public portal with richer visual storytelling.

## 4.0.0 — 2026-09-29

### Continuous intelligence

- added primary-source version intelligence for ATT&CK, ATLAS, D3FEND, OWASP GenAI and NIST AI 600-1;
- added scheduled standards-change detection;
- added successor, rename and deprecation tracking;
- added reproducible catalog snapshots and semantic release diffs.

### Research catalog

- moved all 70 previously hidden research candidates into the visible catalog;
- every research candidate is explicitly marked **NOT VERIFIED**, Tier D and non-recommended pending provenance review;
- retired the hidden-watchlist experience while preserving the verification boundary.

### Relationship intelligence

- added per-edge provenance and source references;
- added selected ATT&CK ↔ D3FEND defensive-context examples;
- added conceptual ATLAS ↔ OWASP ↔ NIST AI crosswalks with explicit non-equivalence warnings.

### Measurement intelligence

- added scorecard aggregation;
- added longitudinal defensive-coverage trends;
- added retest regression detection;
- added evidence-maturity trend data.

### Platform

- replaced the GitHub Pages UI with a new intelligence-product layout;
- added API v2 while retaining v1 compatibility;
- added Python, TypeScript and shell API consumers;
- added OpenCTI interoperability guidance;
- added versioned release snapshots.

## 3.0.0 — 2026-09-29

### Knowledge graph

- added confidence-aware cross-framework relationships;
- added generated per-entity pages with inbound/outbound context;
- added a static read-only API;
- added provenance scores that can incorporate upstream maintenance signals;
- added STIX 2.1 export and an OpenCTI import manifest.

### Data quality

- added JSON Schemas for frameworks, catalog, relationships and validation scenarios;
- added duplicate-ID, duplicate-name, watchlist-overlap and broken-reference validation;
- added structured upstream lifecycle checks for public GitHub projects.

### Analyst experience

- added shareable URL filters;
- added side-by-side factual comparison for up to three entries;
- added filtered CSV and JSON export;
- added EN, PT-BR and ES presentation language options;
- added domain distribution and coverage-trend visuals;
- improved keyboard navigation and focus handling.

### Evidence engineering

- added scenario schema;
- added an E3 evidence bundle example;
- added coverage/retest trend data;
- connected CTI → behavior → validation → telemetry → detection → response → retest.

### Automation

- added contributor review workflow;
- added upstream lifecycle issue automation;
- added versioned release workflow for `v*` tags.

### Lifecycle

- OpenBAS is represented by its current name, OpenAEV, with the historical alias retained;
- DetectionLab and Havoc remain available as legacy references.
