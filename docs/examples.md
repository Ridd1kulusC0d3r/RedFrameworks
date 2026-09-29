# Examples and Machine-Readable Artifacts

RedFrameworks includes small, reviewable examples that connect methodology to measurable defensive outcomes.

## ATT&CK Navigator

Path: `examples/attack-navigator/`

- threat-informed validation layer;
- purple-team coverage layer;
- ATT&CK v19.2;
- Navigator layer format 4.5.

## Attack Flow

Path: `examples/attack-flow/`

- identity telemetry validation;
- cloud control-plane validation;
- STIX 2.1;
- Attack Flow extension 2.0.0.

## Purple-team scorecard

Path: `examples/purple-team/`

The YAML example mirrors the Markdown scorecard template and can later feed dashboards or analytics.

## Validation

Run:

```bash
python -m pip install PyYAML
python scripts/validate_examples.py
python scripts/build_site.py --output _site
python scripts/check_freshness.py
```

The repository CI runs structural validation automatically.
