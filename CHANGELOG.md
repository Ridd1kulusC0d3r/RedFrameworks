# Changelog

All notable RedFrameworks platform changes are recorded here. Machine-readable changes live in `data/changelog.yaml`.

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
