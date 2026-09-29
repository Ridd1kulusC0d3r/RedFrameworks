# Adversary Emulation Plan Template

## Scenario metadata

- **Scenario ID:**
- **Name:**
- **Owner:**
- **Threat basis:**
- **CTI confidence:**
- **Environment:**

## Objective

State exactly what the exercise should prove.

## Business context

Identify the critical asset, identity, process or trust boundary being evaluated.

## Threat basis

List the intelligence sources and summarize the behavior they support.

## Preconditions

- assumed access:
- required identities:
- required systems:
- required telemetry:
- exclusions:

## ATT&CK mapping

| Step | Tactic | Technique | Rationale | Confidence |
|---|---|---|---|---|

## Attack Flow

```text
Start condition
   ↓
Behavior 1
   ↓
Decision / dependency
   ↓
Behavior 2
   ↓
Objective
```

## Expected telemetry

| Behavior | Data source | Expected event / evidence |
|---|---|---|

## Expected detections

| Behavior | Detection / analytic | Expected result |
|---|---|---|

## Safety

- abort conditions:
- cleanup:
- prohibited actions:
- emergency contact:

## Results

| Step | Executed | Telemetry | Detection | Analyst response | Evidence |
|---|---|---|---|---|---|

## Findings

Link resulting findings here.

## Retest

Document what changed and whether the same scenario still succeeds.
