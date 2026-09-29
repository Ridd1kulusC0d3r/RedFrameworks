# Adversary Emulation

Adversary emulation should reproduce **behaviors and decision paths** that are relevant to the organization. It is not a costume contest for threat actors and it is not improved by copying every technique associated with a group.

## Input model

An emulation plan should begin with:

- business context;
- critical assets;
- threat intelligence;
- known adversary behaviors;
- ATT&CK techniques;
- expected defensive telemetry;
- scope and Rules of Engagement.

## From CTI to scenario

```text
CTI source
   ↓
Behavior extraction
   ↓
ATT&CK mapping
   ↓
Confidence assessment
   ↓
Attack Flow
   ↓
Test objective
   ↓
Controlled emulation
   ↓
Telemetry + detection review
```

## Scenario record

Use a structured record for every scenario:

| Field | Description |
|---|---|
| Scenario ID | Stable identifier |
| Objective | What the test proves |
| Threat basis | Intelligence supporting the behavior |
| Confidence | Confidence in the mapping |
| Preconditions | Required environmental assumptions |
| ATT&CK mapping | Relevant techniques |
| Attack Flow | Sequence / dependencies |
| Expected telemetry | Logs and events that should exist |
| Expected detections | Alerts or analytics expected |
| Abort conditions | Safety conditions |
| Evidence | Collected proof |
| Result | Observed outcome |
| Defensive action | Improvement required |

## Full emulation vs micro emulation

### Full emulation

Useful when testing a realistic sequence of behaviors across multiple defensive layers.

Use it to evaluate:

- detection across an attack chain;
- escalation and handoff between security teams;
- incident-response workflow;
- attack-path resilience.

### Micro emulation

Useful when validating a smaller number of behaviors quickly and repeatedly.

Use it to evaluate:

- a detection rule;
- endpoint telemetry;
- a specific control;
- regression after tuning.

The Center for Threat-Informed Defense maintains both full and micro emulation plans in its public library.

## Technique selection

Prefer techniques that are:

1. supported by relevant intelligence;
2. plausible in the target environment;
3. observable enough to measure;
4. safe to emulate under the Rules of Engagement;
5. linked to meaningful business or defensive outcomes.

Do not optimize for raw ATT&CK technique count.

## Attack Flow

A technique list loses important information.

For example:

```text
Initial foothold
    ↓
Credential access
    ↓
Identity expansion
    ↓
Remote service access
    ↓
Sensitive system interaction
```

Attack Flow helps represent the sequence and relationships so that the test can measure where the organization actually interrupts the path.

## Detection validation

For each behavior, capture:

- telemetry present / absent;
- detection fired / not fired;
- alert quality;
- analyst recognition;
- containment action;
- time to recognition;
- time to containment;
- false-positive burden;
- data-quality limitations.

## Evidence confidence

Separate confidence in the **threat intelligence** from confidence in the **test result**.

Example:

| Dimension | Scale |
|---|---|
| CTI confidence | low / medium / high |
| Technique mapping confidence | low / medium / high |
| Execution confidence | failed / partial / confirmed |
| Detection confidence | not observed / weak / confirmed |

## References

- MITRE ATT&CK: https://attack.mitre.org/
- CTID Adversary Emulation Library: https://ctid.mitre.org/resources/adversary-emulation-library/
- Attack Flow: https://attackflow.org/
- Atomic Red Team: https://github.com/redcanaryco/atomic-red-team
- MITRE CALDERA: https://caldera.mitre.org/
