# Next Evolutions — Platform v3

The original roadmap is complete. The next phase is turning the catalog into a continuously maintained **Offensive Security Knowledge Graph**.

## P0 — data integrity

- [x] Browsable catalog generated from YAML
- [x] Interactive filters and status model
- [x] Curated relationship dataset
- [x] Evidence tiers and expanded watchlist
- [x] Freshness automation
- [x] GitHub Pages deployment workflow
- [ ] Add JSON Schema validation for `frameworks.yaml`, `catalog.yaml` and `relationships.yaml`
- [ ] Add duplicate / broken-ID validation across data files
- [ ] Add canonical-upstream health checks that distinguish archived, stale and unreachable projects

## P1 — knowledge graph

- [x] Relationship explorer on the public site
- [ ] Export relationships as STIX 2.1 objects
- [ ] Generate OpenCTI-compatible bundles
- [ ] Enrich ATT&CK ↔ ATLAS ↔ D3FEND relationships
- [ ] Add per-entity pages with inbound / outbound relationships
- [ ] Add query presets such as "show cloud validation platforms"

## P1 — intelligence and freshness

- [ ] Collect upstream release date, archive state and last meaningful activity
- [ ] Generate provenance scores from evidence tier + maintenance + source ownership
- [ ] Open review issues only when meaningful upstream changes occur
- [ ] Track renames, successors and deprecations explicitly

## P2 — analyst experience

- [ ] Persist filters in the URL
- [ ] Add side-by-side factual comparison views
- [ ] Add CSV / JSON export for filtered catalog views
- [ ] Add multilingual presentation while keeping canonical data in English
- [ ] Improve keyboard / screen-reader navigation

## P2 — evidence engineering

- [ ] Add example detection-to-emulation mappings
- [ ] Add reusable scenario schema: CTI → ATT&CK/ATLAS → flow → telemetry → detection → response
- [ ] Add E0–E3 evidence bundles
- [ ] Add coverage and retest trend reports

## P3 — ecosystem

- [ ] Publish versioned catalog releases
- [ ] Add contributor review automation for taxonomy and provenance
- [ ] Add a static read-only API
- [ ] Generate a machine-readable changelog for promotions, demotions, renames and legacy transitions
