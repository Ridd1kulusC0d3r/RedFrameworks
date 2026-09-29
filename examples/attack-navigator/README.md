# ATT&CK Navigator Examples

These layers are planning and validation examples for authorized security exercises.

They target:

- ATT&CK content: **v19.2**
- ATT&CK Navigator: **v5.3.2**
- Layer format: **4.5**

## Files

### `threat-informed-validation.json`

A small layer showing how to encode a threat-informed validation backlog.

Scores mean:

| Score | Meaning |
|---:|---|
| 100 | validated with strong evidence |
| 75 | detection validated, response needs work |
| 50 | telemetry exists, detection incomplete |
| 25 | planned but not yet validated |
| 0 | no validated coverage |

### `purple-team-coverage.json`

A second layer focused on telemetry, detection and analyst-response validation.

## Use

Import the JSON files into ATT&CK Navigator as local layers. Treat the scores as local project semantics, not MITRE-defined scoring.

Do not put sensitive engagement data in public layer files.
