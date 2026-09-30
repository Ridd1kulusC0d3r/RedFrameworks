# Changelog

All notable RedFrameworks platform changes are recorded here. Machine-readable changes live in `data/changelog.yaml`.

## 5.2.0 — 2026-09-30

### Ecosystem expansion

- added 11 additional verified frameworks / standards;
- added 20 additional ATT&CK adversary profiles;
- added 15 curated graph relationships;
- added portable dynamic detail pages and a full-screen graph explorer with force/radial layouts.

### Graph Intelligence

- replaced the single radial graph experience with focused-neighborhood, domain-cluster and research-frontier views;
- added domain and confidence filters, entity search, graph KPIs, legends and richer provenance details;
- kept disconnected NOT VERIFIED candidates visible and focusable;
- retained shortest curated path queries.

### Adversary emulation research

- added nine additional research candidates as NOT VERIFIED / Tier D;
- enriched existing research candidates with capability-oriented descriptions and domains;
- added defensive metadata for 13 authoritative MITRE / CTID emulation-plan references;
- added a five-layer adversary-emulation maturity model.

### Pages reliability

- replaced competing custom-vs-legacy Pages deployment behavior with deterministic branch-root synchronization;
- generated root index, API, data, entity pages and assets now match the canonical portal build;
- added root-sync validation to CI.

### GitHub experience

- redesigned README around current dataset metrics;
- added Graph Intelligence and adversary-emulation architecture visuals;
- cleaned legacy escaped newline artifacts.

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
