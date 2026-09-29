# Purple-Team Measurement Template

Use this template to measure a scenario across five separate layers instead of collapsing everything into a single "covered / not covered" checkbox.

## Scenario metadata

- **Scenario ID:**
- **Business service / critical asset:**
- **Threat basis:**
- **ATT&CK version:**
- **Execution date:**
- **Retest date:**
- **Owner:**

## Technique scorecard

| Technique | Threat relevance | Execution | Telemetry | Detection | Analyst response | Containment | Evidence | Result |
|---|---|---|---|---|---|---|---|---|
| Txxxx | high / med / low | confirmed / partial / failed | sufficient / partial / absent | reliable / weak / none | effective / delayed / missed | effective / partial / failed | E0-E3 | pass / partial / fail |

## Timing

| Metric | Value | Notes |
|---|---:|---|
| Time to telemetry availability | | |
| Time to automated detection | | |
| Time to analyst recognition | | |
| Time to triage decision | | |
| Time to containment | | |
| Time to recovery / validation | | |

## Quality dimensions

Score each dimension from 0 to 100.

| Dimension | Weight example | Score | Evidence |
|---|---:|---:|---|
| Telemetry completeness | 20% | | |
| Detection fidelity | 25% | | |
| Analyst recognition | 20% | | |
| Containment effectiveness | 20% | | |
| Evidence quality / reproducibility | 15% | | |

Example composite:

```text
score =
  telemetry * 0.20 +
  detection * 0.25 +
  analyst * 0.20 +
  containment * 0.20 +
  evidence * 0.15
```

Weights are local policy, not an industry standard. Change them to match the exercise objective.

## Detection quality

Record:

- expected telemetry source;
- observed telemetry source;
- expected analytic;
- observed alert;
- false-positive burden;
- alert context quality;
- detection gap category: data / configuration / logic / workflow / ownership.

## Analyst response

Record:

- recognition outcome;
- escalation path;
- investigation quality;
- containment decision;
- communication quality;
- missing context;
- process friction.

## Retest

| Item | Original | Remediation | Retest result | Residual gap |
|---|---|---|---|---|

## Minimum evidence

Prefer E2 or E3 for material claims.

- **E0** — unsupported claim.
- **E1** — screenshot or manual observation.
- **E2** — reproducible evidence with timestamps and context.
- **E3** — correlated source event, security telemetry and analyst response.
