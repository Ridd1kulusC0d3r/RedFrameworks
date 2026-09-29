# Reporting & Evidence

A red-team report is useful when someone can reproduce the evidence, understand the business consequence and decide what to fix.

## Report structure

### 1. Executive summary

Keep it focused on:

- objective;
- scope;
- most important attack paths;
- business consequences;
- defensive gaps;
- remediation priorities.

### 2. Methodology

Document:

- framework(s) used;
- testing window;
- Rules of Engagement;
- assumptions;
- limitations;
- evidence model;
- threat-intelligence inputs where applicable.

### 3. Attack paths

Group related findings into paths when that better explains risk.

```text
Entry condition
   ↓
Weakness / trust
   ↓
Privilege or reachability change
   ↓
Critical asset
   ↓
Business impact
```

### 4. Findings

Recommended schema:

| Field | Required |
|---|---|
| ID | yes |
| Title | yes |
| Affected assets | yes |
| Description | yes |
| Preconditions | yes |
| Evidence | yes |
| Business impact | yes |
| Technical impact | yes |
| Severity rationale | yes |
| ATT&CK mapping | when relevant |
| Detection observation | when relevant |
| Remediation | yes |
| Validation / retest | yes |

## Evidence standard

Strong evidence is:

- timestamped;
- attributable to an asset or identity;
- reproducible;
- minimally redacted;
- tied to the test objective;
- preserved with integrity;
- understandable without relying on memory.

## Evidence levels

| Level | Description |
|---|---|
| E0 | unsupported claim |
| E1 | visual observation only |
| E2 | reproducible evidence with context |
| E3 | correlated source + security telemetry + analyst response |

Material findings should ideally be E2 or E3.

## Severity

Do not derive severity from a scanner score alone.

Consider:

```text
Likelihood / reachability
    ×
Privilege context
    ×
Business impact
    ×
Attack-path importance
    ×
Control effectiveness
```

CVSS can contribute to the analysis, but should not replace contextual reasoning.

## Detection appendix

For threat-informed engagements, add:

| Technique / behavior | Telemetry | Detection | Analyst response | Result |
|---|---|---|---|---|
| Txxxx | present/absent | fired/not fired | recognized/not recognized | pass/partial/fail |

## Retest appendix

Record:

- finding ID;
- remediation date;
- retest date;
- validation method;
- evidence;
- result;
- residual risk.

## What not to do

- paste raw scanner output as a report;
- use screenshots without context;
- assign ATT&CK IDs cosmetically;
- inflate severity to create drama;
- hide uncertainty;
- omit cleanup status;
- describe every technical detail in the executive summary;
- close findings without retesting.
