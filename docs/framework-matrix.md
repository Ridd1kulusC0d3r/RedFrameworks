# Framework Matrix

No single framework covers every security-testing objective. This matrix helps select complementary approaches.

| Framework / Resource | Primary role | Best use | Main strength | Limitation |
|---|---|---|---|---|
| PTES | Engagement methodology | Penetration tests | Clear lifecycle | Less threat-intelligence-centric |
| NIST SP 800-115 | Security assessment guidance | Formal programs | Governance and assessment discipline | Older publication, broad rather than threat-specific |
| OWASP WSTG | Web testing methodology | Web apps / APIs | Deep web-testing coverage | Not a complete enterprise red-team model |
| OSSTMM | Operational testing methodology | Structured security testing | Measurement-oriented approach | Can be heavier than needed for small engagements |
| MITRE ATT&CK | Adversary behavior knowledge base | Threat-informed testing | Shared TTP vocabulary | Not an execution methodology |
| CTID Adversary Emulation Library | Emulation plans | Threat-led red team | Intelligence-driven scenarios | Plans require contextual adaptation |
| Attack Flow | Behavior-sequence representation | Multi-step scenarios | Models relationships between techniques | Requires quality underlying intelligence |
| MITRE D3FEND | Defensive knowledge graph | Purple-team translation | Links offensive behavior to countermeasure concepts | Does not rank control effectiveness |
| Atomic Red Team | Technique-level validation tests | Detection validation | Portable and repeatable | Atomic tests are not full adversary emulation |
| MITRE CALDERA | Emulation automation | Repeatable exercises | Automation and orchestration | Automation does not replace analyst judgment |

## Selection heuristics

### Use PTES when

- the engagement is a conventional penetration test;
- governance and a clear lifecycle are needed;
- stakeholders need familiar phases and deliverables.

### Use NIST SP 800-115 when

- the program needs formal assessment governance;
- the audience includes audit, risk or compliance;
- testing must fit a broader security-assessment program.

### Use OWASP WSTG when

- the primary scope is web applications or web services;
- the team needs detailed web-testing categories;
- findings must map to a recognized application-security methodology.

### Use ATT&CK when

- the goal is to describe adversary behavior consistently;
- CTI needs to connect with detection engineering;
- scenarios should map to real-world TTPs.

### Use Attack Flow when

- isolated technique IDs do not explain the scenario;
- the ordering and dependency between behaviors matters;
- stakeholders need to see how an attack path develops.

### Use D3FEND when

- the objective includes defensive improvement;
- offensive findings need to translate into countermeasure concepts;
- purple-team work needs a shared defensive vocabulary.

### Use Atomic Red Team when

- the goal is focused technique validation;
- reproducibility matters more than campaign realism;
- detections need frequent retesting.

## Recommended combinations

### Conventional penetration test

```text
PTES
 + NIST SP 800-115
 + OWASP WSTG (if web scope)
```

### Threat-led red team

```text
CTI
 + MITRE ATT&CK
 + Attack Flow
 + PTES governance
 + Detection review
```

### Purple-team validation

```text
ATT&CK
 + Atomic Red Team / controlled emulation
 + D3FEND
 + detection engineering
 + retest
```

### Cloud security exercise

```text
Cloud provider testing rules
 + PTES
 + identity-centric threat model
 + ATT&CK
 + cloud telemetry validation
```

## References

- PTES: https://www.pentest-standard.org/
- NIST SP 800-115: https://csrc.nist.gov/pubs/sp/800/115/final
- OWASP WSTG: https://wstg.owasp.org/
- MITRE ATT&CK: https://attack.mitre.org/
- CTID Adversary Emulation Library: https://ctid.mitre.org/resources/adversary-emulation-library/
- Attack Flow: https://attackflow.org/
- MITRE D3FEND: https://d3fend.mitre.org/
- MITRE CALDERA: https://caldera.mitre.org/
- Atomic Red Team: https://github.com/redcanaryco/atomic-red-team
