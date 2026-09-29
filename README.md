# RedFrameworks

> A practical reference for penetration testing, red teaming, adversary emulation, threat-informed testing, and defensive validation.

[![Status](https://img.shields.io/badge/status-active-success)](#)
[![Focus](https://img.shields.io/badge/focus-red%20team%20%7C%20adversary%20emulation-red)](#)
[![ATT%26CK](https://img.shields.io/badge/mapped%20to-MITRE%20ATT%26CK-blue)](https://attack.mitre.org/)
[![License](https://img.shields.io/badge/content-reference-lightgrey)](#)

## Why this repository exists

Security testing frameworks answer different questions. PTES helps structure an engagement. NIST SP 800-115 provides a formal testing and assessment model. OWASP WSTG focuses on web applications. MITRE ATT&CK gives a behavioral vocabulary. Adversary emulation plans connect threat intelligence to realistic testing. D3FEND helps translate observed offensive behavior into defensive countermeasure concepts.

This repository brings those perspectives together without pretending they are interchangeable.

The goal is not to collect every red-team link on the internet. The goal is to help an analyst choose a methodology, structure an engagement, connect activity to adversary behavior, and produce evidence that defenders can actually use.

## Repository map

| Area | Purpose |
|---|---|
| [PTES](PTES.md) | Engagement lifecycle based on the Penetration Testing Execution Standard |
| [Framework Matrix](docs/framework-matrix.md) | Compare major testing and threat-informed frameworks |
| [Adversary Emulation](docs/adversary-emulation.md) | Turn CTI into controlled, measurable emulation plans |
| [Cloud Red Teaming](docs/cloud-red-teaming.md) | Scope cloud assessments across identity, control plane, workloads and telemetry |
| [Reporting & Evidence](docs/reporting-and-evidence.md) | Convert technical observations into reproducible evidence and remediation |
| [Machine-readable catalog](frameworks.yaml) | Structured framework metadata for future automation |

## Operating model

```text
Threat Intelligence
        │
        ▼
Adversary / Technique Selection
        │
        ▼
Scope + Rules of Engagement
        │
        ▼
Test / Emulation Plan
        │
        ▼
Execution + Evidence Collection
        │
        ▼
ATT&CK Mapping + Detection Review
        │
        ▼
Defensive Gaps + Remediation
        │
        ▼
Retest / Validation
```

This deliberately separates **testing** from **validation**. A red-team activity that ends with "we got access" produces an anecdote. A mature activity also records what was observable, what was detected, what failed, which controls reduced impact, and whether fixes survived a retest.

## Core framework families

### Engagement and assessment methodology

- **PTES** — practical penetration-testing lifecycle and technical guidance.
- **NIST SP 800-115** — formal guidance for planning, conducting, analysing and reporting technical security assessments.
- **OSSTMM** — methodology focused on operational security testing and measurable controls.
- **OWASP WSTG** — web application and web-service security testing methodology.

### Threat-informed red teaming

- **MITRE ATT&CK** — common vocabulary for adversary tactics, techniques and procedures.
- **Center for Threat-Informed Defense Adversary Emulation Library** — intelligence-driven emulation plans for testing defensive capabilities.
- **Attack Flow** — represents sequences and relationships between adversary behaviors rather than isolated techniques.
- **MITRE D3FEND** — defensive knowledge graph that helps connect offensive techniques to countermeasure concepts.

### Validation and repeatability

- **Atomic Red Team** — portable tests mapped to ATT&CK for focused security-control validation.
- **MITRE CALDERA** — automation platform for adversary emulation and security assessment.
- **Breach and Attack Simulation (BAS)** — useful when the objective is repeatable control validation at scale rather than human-led red teaming.

## Choosing a framework

| Need | Start with | Add |
|---|---|---|
| Traditional penetration test | PTES | NIST SP 800-115 |
| Web application assessment | OWASP WSTG | PTES |
| Threat-led red team | ATT&CK | CTID Emulation Library + Attack Flow |
| Purple-team validation | ATT&CK | Atomic Red Team + D3FEND |
| Formal assessment governance | NIST SP 800-115 | PTES |
| Cloud assessment | Provider rules + PTES | ATT&CK Cloud techniques + cloud threat model |
| Continuous validation | ATT&CK | Atomic tests / BAS + detection engineering |

## Minimum engagement artifacts

Every serious engagement should produce at least:

1. **Authorization and Rules of Engagement**
2. **Scope and exclusions**
3. **Threat or test hypothesis**
4. **Technique / scenario map**
5. **Execution log and evidence**
6. **Finding register**
7. **Detection and telemetry observations**
8. **Remediation plan**
9. **Retest result**
10. **Executive summary**

A screenshot without timestamps, context, affected asset, reproduction notes and impact is decoration, not evidence.

## Threat-informed workflow

A useful threat-informed red-team cycle is:

```text
1. Define business crown jewels
2. Identify relevant adversaries / behaviors
3. Select ATT&CK techniques
4. Build attack-flow scenarios
5. Define success and abort criteria
6. Execute under Rules of Engagement
7. Capture telemetry and analyst response
8. Map findings to defensive controls
9. Recommend countermeasures
10. Retest and measure improvement
```

## Metrics that matter

Avoid vanity metrics such as "number of exploits executed." Better measures include:

- percentage of emulated techniques observed in telemetry;
- percentage detected automatically;
- mean time to analyst recognition;
- mean time to containment;
- proportion of findings reproduced after remediation;
- percentage of high-impact attack paths blocked;
- coverage of critical assets and identities;
- ATT&CK technique coverage by evidence quality;
- detection fidelity and false-positive burden.

## Evidence quality model

Use four evidence levels:

| Level | Meaning |
|---|---|
| E0 | Claim only, no supporting evidence |
| E1 | Screenshot or manual observation |
| E2 | Reproducible technical evidence with timestamps and context |
| E3 | Correlated evidence across source system, security telemetry and analyst response |

Prefer E2 or E3 for material findings.

## Safety and authorization

This repository is intended for **authorized security testing, lab work, defensive validation and research**.

Before any execution:

- obtain explicit authorization;
- document scope and exclusions;
- define stop conditions;
- protect collected data;
- avoid destructive actions unless explicitly approved;
- ensure production-impact risks are understood;
- retain an audit trail.

## Primary references

- PTES: https://www.pentest-standard.org/
- NIST SP 800-115: https://csrc.nist.gov/pubs/sp/800/115/final
- OWASP WSTG: https://wstg.owasp.org/
- MITRE ATT&CK: https://attack.mitre.org/
- Center for Threat-Informed Defense: https://ctid.mitre.org/
- Adversary Emulation Library: https://ctid.mitre.org/resources/adversary-emulation-library/
- Attack Flow: https://attackflow.org/
- MITRE D3FEND: https://d3fend.mitre.org/
- MITRE CALDERA: https://caldera.mitre.org/
- Atomic Red Team: https://github.com/redcanaryco/atomic-red-team

## Roadmap

- [x] Rebuild repository structure
- [x] Expand PTES lifecycle
- [x] Add framework comparison matrix
- [x] Add adversary-emulation methodology
- [x] Add cloud red-team guidance
- [x] Add reporting and evidence model
- [x] Add machine-readable framework catalog
- [ ] Add ATT&CK Navigator examples
- [ ] Add Attack Flow examples
- [ ] Add assessment templates
- [ ] Add GitHub Pages documentation
- [ ] Add automated link validation
- [ ] Add framework freshness checks
- [ ] Add purple-team measurement templates

## Contribution philosophy

New content should improve decision-making, repeatability or evidence quality. Do not add tools merely because they are popular. A useful contribution explains **where it fits, what problem it solves, what evidence it produces, and how it connects to defensive outcomes**.

See [CONTRIBUTING.md](CONTRIBUTING.md).
