# OpenCTI Interoperability

RedFrameworks publishes a generated STIX 2.1 bundle at:

`/api/redframeworks-stix-2.1.json`

and an import manifest at:

`/api/opencti-import-manifest.json`

## Intended workflow

1. validate the RedFrameworks catalog and relationships;
2. generate the STIX 2.1 bundle;
3. review the manifest and object count;
4. import the bundle using the OpenCTI STIX import workflow appropriate to your environment;
5. keep RedFrameworks IDs in the custom properties so catalog provenance remains traceable.

## Scope

The exported objects represent catalog entities, relationships and provenance context. They do **not** contain credentials, targets, exploit steps or engagement secrets.

## Enrichment pattern

A downstream OpenCTI workspace can enrich a RedFrameworks entity with organization-specific CTI while preserving separation between:

- public framework/tool metadata;
- internal intelligence;
- internal assessment evidence.

Do not publish internal intelligence back into this public repository unless it is appropriate for public disclosure.
