<div align="center">

# RedFrameworks

### Threat-Informed OffSec Intelligence & Defensive Validation Knowledge Graph

**Threat Intelligence · Adversary Intelligence · OffSec · AppSec · Cloud · AI Security · Purple Team · Detection Engineering · Evidence**

[![Documentation quality](https://github.com/Ridd1kulusC0d3r/RedFrameworks/actions/workflows/quality.yml/badge.svg)](https://github.com/Ridd1kulusC0d3r/RedFrameworks/actions/workflows/quality.yml)
[![Pages](https://github.com/Ridd1kulusC0d3r/RedFrameworks/actions/workflows/pages.yml/badge.svg)](https://github.com/Ridd1kulusC0d3r/RedFrameworks/actions/workflows/pages.yml)
[![Freshness](https://github.com/Ridd1kulusC0d3r/RedFrameworks/actions/workflows/freshness.yml/badge.svg)](https://github.com/Ridd1kulusC0d3r/RedFrameworks/actions/workflows/freshness.yml)
[![ATT&CK](https://img.shields.io/badge/knowledge-MITRE%20ATT%26CK-6f42c1)](https://attack.mitre.org/)
[![STIX 2.1](https://img.shields.io/badge/export-STIX%202.1-blue)](docs/api.md)
[![API v3](https://img.shields.io/badge/API-v3-7fbcff)](docs/api.md)
[![Platform v5.2](https://img.shields.io/badge/platform-v5.2-f04f67)](docs/next-evolutions.md)
[![Adversary Intel](https://img.shields.io/badge/adversaries-42-efbd67)](docs/adversary-intelligence.md)

[**Live Portal**](https://ridd1kulusc0d3r.github.io/RedFrameworks/) ·
[**Graph Intelligence**](https://ridd1kulusc0d3r.github.io/RedFrameworks/#graph) ·
[**Adversary Intelligence**](https://ridd1kulusc0d3r.github.io/RedFrameworks/#adversaries) ·
[**API v3**](docs/api.md) ·
[**Roadmaps**](docs/roadmaps/README.md)

</div>

<p align="center">
  <img src="site/assets/redframeworks-intelligence-hero.svg" alt="RedFrameworks OffSec intelligence architecture" width="100%">
</p>

---

## Why RedFrameworks exists

RedFrameworks is a curated, machine-readable reference for **authorized security testing, threat-led assessment, adversary emulation, purple-team validation, detection engineering, threat intelligence and defensive evidence**.

The project deliberately separates:

- methodology from tooling;
- verified sources from research candidates;
- threat context from execution platforms;
- activity from measurable defensive outcomes;
- current projects from legacy references;
- catalog breadth from provenance quality.

> **Threat → Behavior → Validation → Telemetry → Detection → Response → Evidence → Retest**

The goal is not to accumulate every repository with the word “security” in its description. The internet has already industrialized that hobby.

---

## At a glance

| Dataset | Current coverage |
|---|---:|
| Frameworks / standards / knowledge models | **62** |
| Tool & platform catalog entries | **134** |
| Verified tool/platform entries | **42** |
| NOT VERIFIED research candidates | **79** |
| Curated graph relationships | **89** |
| ATT&CK-tracked adversary profiles | **42** |
| Adversary emulation plan references | **13** |
| Books | **10** |
| Certifications | **13** |
| Static API | **v3** |

The counts are generated from the current repository state and intentionally distinguish verified material from research candidates.

---

### v5.2 ecosystem expansion

The current platform also incorporates **11 additional verified standards/frameworks** added in the parallel v5.2 expansion, including OWASP Top 10:2025, NIST SP 800-63-4, NIST SP 800-161 Rev. 1, NIST SP 800-190, CISA Zero Trust Maturity Model 2.0, OpenSSF OSPS Baseline, OWASP SCVS, CSA Security Guidance v5, ETSI EN 303 645 v3.1.3, ISO/IEC 27001:2022 and ISO/IEC 27005:2022.

That expansion also added **20 additional ATT&CK adversary profiles**, a full-screen graph explorer, portable detail pages and **15 curated relationships**. Platform v5.2 combines those additions with Graph Intelligence v2, the adversary-emulation plan library and deterministic Pages publishing.

## Public intelligence portal

**https://ridd1kulusc0d3r.github.io/RedFrameworks/**

The portal is a client-side intelligence application generated from canonical repository data. It includes:

- global command palette with `Ctrl/Cmd + K`;
- local bookmarks;
- multi-dimensional catalog filters;
- factual side-by-side comparison;
- CSV / JSON export;
- per-entity pages;
- ATT&CK technique pages;
- adversary profile pages;
- books and certification explorer;
- learning paths;
- Verification Engine / Research Workspace;
- standards intelligence;
- measurement, scorecards, evidence maturity and regression tracking;
- Graph Intelligence v2;
- API v3;
- STIX, OpenCTI, Neo4j, MISP and ATT&CK Navigator interoperability.

---

## Graph Intelligence v2

<p align="center">
  <img src="site/assets/graph-intelligence.svg" alt="RedFrameworks Graph Intelligence v2" width="100%">
</p>

The graph is designed as an analyst workspace rather than a decorative node cloud.

### Views

| View | Purpose |
|---|---|
| **Focused Neighborhood** | inspect one entity and its curated relationships |
| **Domain Clusters** | understand the ecosystem across threat, framework, cloud, AI, AppSec, edge and detection domains |
| **Research Frontier** | expose NOT VERIFIED candidates without pretending they are trusted |

Graph features include:

- domain and confidence filters;
- entity search;
- shortest curated path queries;
- per-edge confidence;
- provenance and source references;
- disconnected research-candidate visibility;
- keyboard-focusable nodes;
- relationship details and entity navigation.

Canonical graph data: [relationships.yaml](relationships.yaml)

---

## Adversary intelligence

<p align="center">
  <img src="site/assets/adversary-intelligence.svg" alt="RedFrameworks defensive adversary intelligence model" width="100%">
</p>

Adversary intelligence is a **secondary analytical layer** used to connect public threat context to defensive priorities.

Current coverage includes **42 ATT&CK-tracked groups**, including APT28, APT29, APT41, Sandworm, Turla, Lazarus Group, Kimsuky, MuddyWater, OilRig, Volt Typhoon, Salt Typhoon, Mustang Panda, Scattered Spider and FIN7.

Profiles retain source language and uncertainty instead of silently upgrading “suspected” into “confirmed”.

Each profile can include:

- ATT&CK Group ID;
- aliases;
- actor type;
- source-attributed attribution statement;
- strategic motivation;
- broad regions and sectors;
- defensive focus;
- source tier;
- ATT&CK profile version.

Read:

- [Adversary Intelligence methodology](docs/adversary-intelligence.md)
- [Adversary Matrix](docs/adversary-matrix.md)
- [CTI Framework Guide](docs/cti-frameworks.md)

---

## Adversary emulation maturity

<p align="center">
  <img src="site/assets/emulation-maturity.svg" alt="RedFrameworks adversary emulation maturity model" width="100%">
</p>

RedFrameworks models adversary emulation as five capabilities rather than one pile of tools:

| Layer | Objective | Representative material |
|---|---|---|
| **1 · CTI & plans** | translate public threat reporting into behavior models | ATT&CK, CTID plans, STIX, Attack Flow |
| **2 · Orchestration** | coordinate controlled behavior validation | CALDERA, Atomic Red Team, Realm, OpenAEV |
| **3 · Purple / BAS** | measure telemetry, detections and response | VECTR, Splunk Attack Range, scorecards |
| **4 · Testbeds** | create repeatable enterprise, cloud, ICS/OT or edge labs | Attack Range and research testbeds |
| **5 · Operational context** | map authorized red-team platform ecosystems | confidence-aware catalog only |

The repository now tracks **13 authoritative emulation-plan references**, including the historical MITRE APT3 plan and Center for Threat-Informed Defense full/micro emulation resources.

RedFrameworks stores **metadata, provenance and defensive purpose**, not command-level field-manual content.

See [Adversary Emulation Maturity](docs/adversary-emulation-maturity.md).

---

## CTI framework stack

<p align="center">
  <img src="site/assets/framework-cti-stack.svg" alt="RedFrameworks CTI framework ecosystem" width="100%">
</p>

The CTI and response layer includes ATT&CK, STIX 2.1, TAXII 2.1, CACAO 2.0, FIRST TLP 2.0, FIRST CSIRT Services Framework, VERIS, NIST SP 800-61 Rev. 3, NIST SP 800-160 Vol. 2 Rev. 1, CISA CPGs, Cyber Kill Chain, MISP Galaxy, SSVC, CVSS, EPSS and CSAF.

These models are complementary:

~~~text
CTI representation        STIX
CTI transport             TAXII
Sharing boundaries        TLP
Threat behavior           ATT&CK
Intrusion lifecycle       Cyber Kill Chain
Actor / cluster context   MISP Galaxy
Incident data             VERIS
Response governance       NIST SP 800-61
Playbook representation   CACAO
Cyber resilience          NIST SP 800-160
Vulnerability context     CVSS + EPSS + SSVC + CSAF
~~~

---

## Ecosystem model

| Layer | Main question | Examples |
|---|---|---|
| **Methodology & assurance** | How should the engagement be governed? | PTES, NIST SP 800-115, TIBER-EU, CBEST |
| **Threat & knowledge models** | How do we describe actors, behavior and defense? | ATT&CK, ATLAS, D3FEND, STIX, Attack Flow |
| **Emulation & validation** | How do we reproduce behavior safely and repeatably? | Atomic Red Team, CALDERA, OpenAEV, Realm |
| **Operational assessment** | Which capability supports the authorized assessment? | BloodHound, CloudFox, MobSF and catalog entries |
| **Detection & response** | How do we validate defensive outcomes? | Sigma, Velociraptor, VECTR, Attack Range |
| **Domain guidance** | What changes by technology? | WSTG, MASVS/MASTG, IoT ISVS/ISTG, cloud guidance |
| **Research frontier** | What deserves investigation but is not verified yet? | Tier D / NOT VERIFIED registry |

See [taxonomy](docs/taxonomy.md).

---

## Provenance before popularity

| Tier | Meaning |
|---|---|
| **A** | primary official standard, regulator, foundation or authoritative source |
| **B** | canonical maintainer repository or official vendor documentation |
| **C** | traceable community source |
| **D** | research candidate / insufficiently verified |

Research candidates remain visible because **unknown does not mean nonexistent**, but visibility is not endorsement.

~~~yaml
status: "not-verified"
evidence_tier: "D"
verification_note: "NOT VERIFIED — research candidate only."
~~~

The Verification Engine tracks missing provenance such as canonical upstream, maintainer identity, license metadata, lifecycle and evidence quality.

---

## Evidence engineering

~~~mermaid
flowchart LR
    CTI["Threat context"] --> BEH["Behavior"]
    BEH --> VAL["Controlled validation"]
    VAL --> TEL["Telemetry"]
    TEL --> DET["Detection"]
    DET --> RESP["Analyst response"]
    RESP --> EV["Evidence"]
    EV --> RETEST["Retest"]
~~~

Evidence maturity:

| Level | Meaning |
|---|---|
| **E0** | claim |
| **E1** | observation |
| **E2** | reproducible evidence |
| **E3** | correlated evidence across source event, telemetry, detection, response and retest |

Structured examples live under [examples/](examples/) and [Evidence Engineering](docs/evidence-engineering.md).

---

## Canonical data

| File | Purpose |
|---|---|
| [frameworks.yaml](frameworks.yaml) | frameworks, standards and knowledge models |
| [catalog.yaml](catalog.yaml) | verified, community, commercial, legacy and NOT VERIFIED ecosystem entries |
| [relationships.yaml](relationships.yaml) | graph edges, confidence and provenance |
| [resources.yaml](resources.yaml) | books and certifications |
| [learning-paths.yaml](learning-paths.yaml) | objective-driven learning paths |
| [data/adversaries.yaml](data/adversaries.yaml) | source-attributed adversary profiles |
| [data/intelligence-sources.yaml](data/intelligence-sources.yaml) | curated CTI research sources |
| [data/emulation-plans.yaml](data/emulation-plans.yaml) | defensive metadata for authoritative emulation plans |
| [data/lifecycle.yaml](data/lifecycle.yaml) | renames, legacy transitions and lifecycle events |
| [data/changelog.yaml](data/changelog.yaml) | machine-readable platform history |
| [schemas/](schemas/) | JSON Schemas and data contracts |

---

## API v3 & interoperability

Documentation: [docs/api.md](docs/api.md)

~~~text
/api/version.json
/api/v3/index.json
/api/v3/catalog.json
/api/v3/frameworks.json
/api/v3/relationships.json
/api/v3/adversaries.json
/api/v3/emulation-plans.json
/api/v3/intelligence-sources.json
/api/v3/techniques.json
/api/v3/resources.json
/api/v3/learning-paths.json
/api/v3/verification-queue.json
~~~

Exports include STIX 2.1, OpenCTI guidance, Neo4j graph data, MISP reference data and ATT&CK Navigator layers.

---

## Automation

| Workflow | Purpose |
|---|---|
| **Documentation quality** | links, schemas, cross-file integrity, examples, API and portal build |
| **Catalog freshness** | review-date cadence |
| **Standards intelligence** | upstream standard/version monitoring |
| **Upstream health** | lifecycle, archive, activity and release signals |
| **Catalog contribution review** | taxonomy and reference validation |
| **Build and sync public portal** | generates the site and synchronizes the branch-root Pages source |
| **Research promotion packet** | human-gated evidence packet for NOT VERIFIED review |
| **Versioned catalog release** | snapshots, exports, checksums and provenance attestation |

### GitHub Pages architecture

The repository currently has GitHub's legacy branch-root Pages build enabled. To avoid the legacy Jekyll build overwriting the dynamic portal, the Pages workflow generates the canonical site and synchronizes the generated public files into the branch root.

The root contains a generated `.nojekyll`, `index.html`, API, data and entity pages. This makes both the legacy Pages build and the generated portal converge on the same output instead of racing each other.

---

## Repository map

~~~text
.
├── frameworks.yaml
├── catalog.yaml
├── relationships.yaml
├── resources.yaml
├── learning-paths.yaml
├── data/
├── schemas/
├── docs/
├── examples/
├── sdk/
├── scripts/
├── site/
└── .github/workflows/
~~~

Useful entry points:

- [Platform roadmap](docs/next-evolutions.md)
- [Adversary Intelligence](docs/adversary-intelligence.md)
- [Adversary Emulation Maturity](docs/adversary-emulation-maturity.md)
- [Research Verification](docs/research-verification.md)
- [Dataset Integrity](docs/dataset-integrity.md)
- [API](docs/api.md)
- [Contributing](CONTRIBUTING.md)

---

## Safety & authorization

RedFrameworks is intended for **authorized security testing, controlled labs, defensive validation, threat-informed research, detection engineering and incident-response improvement**.

Before any assessment, define authorization, scope, exclusions, stop conditions, evidence handling and production-impact constraints.

The repository focuses on **modeling, provenance, evidence and defensive outcomes**, not destructive procedures.

---

<div align="center">

### RedFrameworks · Platform v5.2

**Threat → Behavior → Validation → Detection → Evidence → Retest**

[Live Portal](https://ridd1kulusc0d3r.github.io/RedFrameworks/) ·
[Graph](https://ridd1kulusc0d3r.github.io/RedFrameworks/#graph) ·
[API](docs/api.md) ·
[Roadmap](docs/next-evolutions.md)

</div>
