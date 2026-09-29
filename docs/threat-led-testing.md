# Threat-Led and Intelligence-Led Testing

Threat-led penetration testing (TLPT) is different from a conventional penetration test: threat intelligence drives scenarios, targets and behavior selection, and the exercise measures resilience across people, process and technology.

## Major frameworks

| Framework | Scope | Character |
|---|---|---|
| TIBER-EU | EU and beyond; especially regulated financial entities | Threat-intelligence-based ethical red teaming against critical or important functions |
| CBEST | UK financial sector and FMIs | Regulator-led, intelligence-led security assessment |
| CREST STAR / TLPT | Cross-sector assurance model and provider accreditation | Threat-led simulation and response assessment |
| STAR-FS | UK financial services | Intelligence-led penetration testing designed for financial-sector resilience |

## TIBER-EU

The 2025 TIBER-EU framework is aligned with DORA threat-led penetration testing requirements.

A mature implementation connects:

```text
Critical / Important Function
        ↓
Threat Intelligence
        ↓
Threat Scenario
        ↓
Red Team Test Plan
        ↓
Controlled Testing
        ↓
Blue Team / Detection Review
        ↓
Remediation
        ↓
Purple-Team Learning
```

## CBEST

CBEST creates a "golden thread" between:

```text
Threat
  → Important Business Service
  → Scenario
  → Penetration Test Plan
  → Evidence
  → Detection & Response Assessment
  → Remediation
```

The important lesson for this repository is that **realistic threat-led testing starts with business services and threat evidence, not with a favorite tool**.

## CREST terminology note

CREST has continued evolving its service standards. In 2026 it introduced updated terminology including:

- **CTI** — Cyber Threat Intelligence;
- **TISA** — Threat Intelligence for Simulated Attack;
- **TLPT** — Threat-Led Penetration Testing.

Older STAR terminology remains historically relevant, so this repository keeps aliases where useful.

## Recommended artifacts

- critical-function scope;
- target intelligence report;
- threat intelligence report;
- scenario register;
- test plan;
- Rules of Engagement;
- detection and response observations;
- remediation plan;
- test summary and attestation where applicable.

## Primary references

- TIBER-EU: https://www.ecb.europa.eu/paym/cyber-resilience/tiber-eu/html/index.en.html
- CBEST: https://www.bankofengland.co.uk/financial-stability/operational-resilience-of-the-financial-sector/cbest-threat-intelligence-led-assessments-implementation-guide
- CREST Red Teaming: https://www.crest-approved.org/cyber-service-categories/red-teaming/
