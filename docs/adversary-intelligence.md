# Adversary Intelligence

RedFrameworks treats adversary intelligence as a **secondary analytical layer** that helps connect threat context to frameworks, defensive validation and evidence.

It is not an offensive playbook.

## Design goals

The adversary dataset focuses on:

- canonical group name and ATT&CK ID;
- aliases used by major public tracking systems;
- source-attributed actor type and attribution language;
- strategic motivation;
- broad targeting regions and sectors;
- defensive monitoring priorities;
- source provenance and ATT&CK profile version.

## Naming caution

Threat-actor naming is not globally standardized.

Two vendors may use different names for overlapping activity, and one public name may function as an umbrella label for multiple operational clusters.

RedFrameworks therefore treats aliases as **analyst context, not mathematical identity**.

The ATT&CK Groups documentation itself notes that group definitions and associated names can partially overlap and that different organizations may disagree on cluster boundaries.

## Attribution caution

Attribution fields preserve source language such as:

- attributed;
- assessed;
- suspected;
- state-backed;
- unresolved.

RedFrameworks does not independently upgrade those claims.

## Defensive use

Profiles are intended to support questions such as:

- Which sectors are repeatedly associated with this activity cluster?
- Which defensive domains deserve extra validation?
- Which CTI sources should be reviewed for corroboration?
- Which frameworks best structure the analysis?
- Where should detection, resilience and retest evidence be strengthened?

## Canonical data

- `data/adversaries.yaml`
- `data/intelligence-sources.yaml`
- `schemas/adversaries.schema.json`
- `schemas/intelligence-sources.schema.json`

The public portal exposes these through API v3 and dedicated adversary pages.
