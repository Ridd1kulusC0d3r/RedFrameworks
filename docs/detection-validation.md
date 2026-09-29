# Purple Team, Detection and Continuous Validation

Purple teaming is a feedback loop, not a meeting where a red team and blue team happen to occupy the same room.

## Core stack

| Layer | Examples | Purpose |
|---|---|---|
| Behavior model | MITRE ATT&CK | Describe what is being tested |
| Atomic validation | Atomic Red Team | Reproduce focused behavior |
| Automated emulation | MITRE CALDERA, Stratus Red Team, TTPForge | Execute repeatable scenarios |
| AEV / validation platform | OpenAEV (formerly OpenBAS) | Orchestrate simulations, validation and exposure-validation workflows |
| Measurement | VECTR | Track test cases and defensive outcomes |
| Detection representation | Sigma, YARA | Describe detection logic / patterns |
| Detection lab | Splunk Attack Range | Generate instrumented telemetry for detection engineering |
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

Examples include SafeBreach, AttackIQ, Cymulate, Pentera, Picus Security, SCYTHE and XM Cyber.

Treat these as **commercial platforms**, not standards. Product capabilities and licensing change rapidly, so comparisons should always be date-stamped.

## Detection metrics

Track telemetry availability, analytic existence, analytic fidelity, alert quality, analyst recognition, containment effectiveness, time to detect, time to contain and regression status separately.

## References

- OpenAEV: https://docs.openaev.io/
- Sigma: https://sigmahq.io/
- MITRE D3FEND: https://d3fend.mitre.org/
- MITRE CALDERA: https://caldera.mitre.org/
- Atomic Red Team: https://github.com/redcanaryco/atomic-red-team
- VECTR: https://github.com/SecurityRiskAdvisors/VECTR
- TTPForge: https://github.com/facebookincubator/TTPForge
- Splunk Attack Range: https://github.com/splunk/attack_range
- Velociraptor: https://docs.velociraptor.app/
