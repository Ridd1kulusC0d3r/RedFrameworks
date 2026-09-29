# Attack Flow Examples

These files use **Attack Flow 2.0.0** as a STIX 2.1 extension.

The examples are deliberately defensive and non-operational: they model sequences for telemetry and response validation without providing exploit instructions.

## Files

- `identity-telemetry-validation.json` — identity-to-discovery validation sequence.
- `cloud-control-plane-validation.json` — cloud-account and control-plane observation sequence.

## Design rule

Attack Flow adds value when sequence and dependency matter. If a simple ATT&CK technique list tells the whole story, use a Navigator layer instead.
