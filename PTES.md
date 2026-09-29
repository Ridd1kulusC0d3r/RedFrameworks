# PTES — Penetration Testing Execution Standard

PTES is best used as an **engagement lifecycle**, not as a checklist of tricks.

This page adapts the PTES structure into a modern workflow that also captures threat intelligence, ATT&CK mapping, detection observations, evidence quality and retesting.

Official reference: https://www.pentest-standard.org/

## Lifecycle

```text
Pre-engagement
    ↓
Intelligence Gathering
    ↓
Threat Modeling
    ↓
Vulnerability Analysis
    ↓
Controlled Exploitation
    ↓
Post-Exploitation Assessment
    ↓
Reporting
    ↓
Detection Review
    ↓
Retest
```

## 1. Pre-engagement interactions

The objective is to make the engagement legally authorized, operationally safe and measurable.

### Define

- business objectives;
- systems, identities and environments in scope;
- excluded systems;
- allowed testing windows;
- production constraints;
- third-party dependencies;
- emergency contacts;
- stop / abort criteria;
- data-handling requirements;
- evidence retention period;
- notification model;
- success criteria.

### Required outputs

- authorization;
- Rules of Engagement;
- scope matrix;
- communication plan;
- risk register;
- test hypotheses.

### Example success criteria

Avoid "obtain domain admin" as the only measure. Better criteria might include:

- determine whether a sensitive business process can be reached from an assumed foothold;
- test whether specific adversary techniques generate expected telemetry;
- validate whether identity controls prevent privilege expansion;
- measure analyst response to a defined attack flow.

## 2. Intelligence gathering

Collect enough context to understand the attack surface and the environment's likely exposure.

### Categories

- organization and business context;
- internet-facing assets;
- identity architecture;
- application and API surface;
- cloud resources;
- external services and SaaS dependencies;
- technology stack;
- public exposure of sensitive metadata;
- known threat reporting relevant to the sector.

### Output

Produce an **attack-surface model**, not a pile of search results.

Recommended fields:

| Field | Example purpose |
|---|---|
| Asset | What may be affected |
| Owner | Who can validate impact |
| Exposure | Internet, partner, internal, cloud |
| Identity boundary | Which identity plane controls it |
| Criticality | Business consequence |
| Evidence source | Where the observation came from |
| Confidence | Low / medium / high |

## 3. Threat modeling

Threat modeling is the bridge between generic testing and threat-informed testing.

### Questions

- What does the organization need to protect?
- Which adversary behaviors are relevant?
- Which trust boundaries matter?
- Which attack paths connect exposed surfaces to high-value assets?
- Which detections should fire?
- Which controls should interrupt the path?

### Recommended mappings

- ATT&CK tactics and techniques;
- Attack Flow for multi-step behavior;
- asset / identity trust boundaries;
- business impact;
- expected defensive controls.

## 4. Vulnerability analysis

A vulnerability is meaningful when placed in context.

Prioritize findings using:

```text
Technical weakness
        +
Reachability
        +
Privilege / identity context
        +
Attack-path relevance
        +
Business impact
        +
Defensive visibility
```

Do not treat CVSS alone as a business-risk model.

### Evidence

For each candidate issue record:

- affected asset;
- preconditions;
- observation;
- reproducibility;
- likely impact;
- compensating controls;
- detection visibility;
- confidence.

## 5. Controlled exploitation

The purpose is to validate impact under authorization, using the least destructive method that proves the hypothesis.

### Principles

- minimize changes to target systems;
- avoid persistence unless explicitly approved;
- use test accounts or synthetic data when possible;
- stop when the agreed proof threshold is reached;
- capture timestamped evidence;
- record defensive telemetry where available.

### Record

- technique / behavior;
- affected system;
- expected result;
- observed result;
- evidence;
- relevant ATT&CK mapping;
- security-control response;
- analyst response;
- cleanup status.

## 6. Post-exploitation assessment

The objective is not uncontrolled expansion. It is to understand the consequences of the validated foothold.

Assess, when explicitly in scope:

- reachable trust relationships;
- privilege boundaries;
- sensitive business paths;
- segmentation effectiveness;
- identity-control effectiveness;
- blast radius;
- telemetry and detection coverage.

Use **attack-path reasoning** to explain why a foothold matters.

## 7. Reporting

A good report supports both executives and engineers.

### Executive layer

- objective;
- scope;
- major attack paths;
- business impact;
- material control gaps;
- overall remediation priorities.

### Technical layer

Each finding should include:

- identifier;
- title;
- affected assets;
- severity rationale;
- evidence;
- preconditions;
- impact;
- ATT&CK mapping when relevant;
- detection observations;
- remediation;
- validation steps;
- retest result.

See [Reporting & Evidence](docs/reporting-and-evidence.md).

## 8. Detection review

Traditional PTES stops being useful if findings never feed defenders.

For each material behavior, ask:

- Was telemetry generated?
- Was the activity detected?
- Was the alert actionable?
- Did an analyst identify the behavior?
- Was containment effective?
- Which control or sensor failed?
- Is the gap coverage, configuration, logic or process?

## 9. Retest

Retesting closes the loop.

A retest should state:

- original finding;
- remediation applied;
- exact validation objective;
- observed result;
- residual risk;
- evidence;
- status: fixed / partially fixed / not fixed / accepted.

## Engagement anti-patterns

Avoid:

- testing without explicit authorization;
- changing scope informally;
- collecting excessive data;
- equating tool output with validated findings;
- severity without business context;
- reporting ATT&CK IDs without explaining behavior;
- declaring success without evidence;
- leaving cleanup undocumented;
- omitting defensive telemetry from threat-led engagements;
- skipping retest.

## PTES + modern threat-informed extension

| PTES phase | Modern extension |
|---|---|
| Pre-engagement | Business objective + Rules of Engagement + detection objectives |
| Intelligence Gathering | Attack-surface management + CTI |
| Threat Modeling | ATT&CK + Attack Flow + asset criticality |
| Vulnerability Analysis | Attack-path context |
| Exploitation | Controlled behavior validation |
| Post Exploitation | Blast-radius and control analysis |
| Reporting | Evidence + ATT&CK + detection gaps |
| Retest | Continuous validation |
