# Coverage Model

Coverage is not the number of ATT&CK techniques painted green on a heatmap.

A useful coverage model separates **intelligence relevance**, **test execution**, **telemetry**, **detection** and **response**.

## Five-layer model

| Layer | Question |
|---|---|
| Threat relevance | Is this behavior relevant to the organization? |
| Emulation | Can we safely reproduce it? |
| Telemetry | Do the required data sources exist? |
| Detection | Is the behavior identified reliably? |
| Response | Can analysts investigate and contain it? |

## Suggested status values

### Threat relevance

- unknown
- low
- medium
- high

### Emulation

- not planned
- planned
- partial
- confirmed

### Telemetry

- absent
- incomplete
- sufficient

### Detection

- none
- weak
- reliable

### Response

- untested
- delayed
- effective

## Why this matters

A technique can be "covered" by an EDR product but still fail operationally because:

- the required telemetry is not retained;
- the analytic is disabled;
- the alert is too noisy;
- the analyst lacks context;
- the response process cannot contain the activity;
- the technique is irrelevant to the organization's threat model.

## Example record

| Technique | Relevance | Emulation | Telemetry | Detection | Response |
|---|---|---|---|---|---|
| Txxxx | high | confirmed | sufficient | weak | delayed |

## Measurement principles

- measure relevant behavior, not maximum technique count;
- distinguish "data exists" from "detection exists";
- separate prevention from detection;
- preserve evidence for every coverage claim;
- retest after tuning;
- show uncertainty explicitly.
