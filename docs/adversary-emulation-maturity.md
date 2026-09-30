# Adversary Emulation Maturity Model

RedFrameworks separates **threat knowledge** from **execution tooling**. Mature adversary emulation is not achieved by collecting more operational platforms; it requires intelligence, planning, measurement and repeatable evidence.

## Five capability layers

| Layer | Purpose | RedFrameworks focus |
|---|---|---|
| 1. Threat plans & CTI | turn public threat reporting into structured behavior models | ATT&CK, CTID plans, Attack Flow, STIX |
| 2. Emulation orchestration | coordinate safe, authorized behavior validation | CALDERA, Atomic Red Team, Realm, OpenAEV, research candidates |
| 3. Purple / BAS validation | measure whether telemetry, detections and response work | VECTR, Splunk Attack Range, scorecards, regression tracking |
| 4. Testbeds | create repeatable lab environments for enterprise, cloud, ICS or edge scenarios | DetectionLab legacy context, Attack Range, research testbeds |
| 5. Operational platforms | catalog ecosystem context for authorized red-team operations | catalog-only, confidence-aware, no operational procedures |

## Why the plan layer matters

MITRE describes Adversary Emulation Plans as a way to use public threat reporting and ATT&CK to model adversary behavior so defenders can test networks, products and analytics. CTID extends this idea with full and micro emulation plans for multiple threat groups.

RedFrameworks stores **plan metadata and defensive purpose**, but deliberately does not reproduce command-level field manuals.

## Evidence loop

~~~mermaid
flowchart LR
  CTI["CTI / actor context"] --> PLAN["Emulation plan"]
  PLAN --> FLOW["Behavior / Attack Flow"]
  FLOW --> LAB["Authorized validation lab"]
  LAB --> TEL["Telemetry"]
  TEL --> DET["Detection / response"]
  DET --> EV["Evidence"]
  EV --> RETEST["Retest"]
~~~

The outcome is not “the attack ran”. The outcome is evidence that defensive capability was measured and improved.

## Canonical data

- `data/emulation-plans.yaml`
- `schemas/emulation-plans.schema.json`

The public API exposes this dataset without operational steps.
