# Purple Team, Detection and Continuous Validation

Purple teaming is a feedback loop, not a meeting where a red team and blue team happen to occupy the same room.

## Core stack

| Layer | Examples | Purpose |
|---|---|---|
| Behavior model | MITRE ATT&CK | Describe what is being tested |
| Atomic validation | Atomic Red Team | Reproduce focused behavior |
| Automated emulation | MITRE CALDERA, Stratus Red Team | Execute repeatable scenarios |
| BAS / exercise platform | OpenBAS | Orchestrate simulations and validations |
| Detection representation | Sigma, YARA | Describe detection logic / patterns |
| Endpoint investigation | Velociraptor | Hunt and collect endpoint evidence |
| Defensive mapping | MITRE D3FEND | Connect behavior to countermeasure concepts |

## Validation loop

```text
Threat hypothesis
      ↓
ATT&CK behavior
      ↓
Test / emulation
      ↓
Telemetry
      ↓
Detection
      ↓
Analyst response
      ↓
Remediation / tuning
      ↓
Retest
```

## Commercial BAS / exposure validation landscape

Examples include:

- SafeBreach
- AttackIQ
- Cymulate
- Pentera
- Picus Security
- SCYTHE
- XM Cyber

These should be treated as **commercial platforms**, not standards. Capabilities and licensing change rapidly, so product comparisons should always be date-stamped.

## Detection metrics

Track separately:

- telemetry availability;
- analytic existence;
- analytic fidelity;
- alert triage quality;
- analyst recognition;
- containment effectiveness;
- time to detect;
- time to contain;
- regression status.

## References

- OpenBAS: https://docs.openbas.io/
- Sigma: https://sigmahq.io/
- MITRE D3FEND: https://d3fend.mitre.org/
- MITRE CALDERA: https://caldera.mitre.org/
- Atomic Red Team: https://github.com/redcanaryco/atomic-red-team
- Velociraptor: https://docs.velociraptor.app/
