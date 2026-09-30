# API Deprecation Policy

RedFrameworks uses explicit API versions.

- **v1**: compatibility contract for catalog + relationships.
- **v2**: provenance and continuous-intelligence contract.
- **v3**: ecosystem portal contract with resources, learning paths, verification queue and technique intelligence.

## Rules

1. Existing versioned endpoints are not silently redefined.
2. A version can be marked deprecated only in `/api/version.json`.
3. Deprecated versions remain available for at least one tagged release cycle when technically practical.
4. Stable integration keys are entity IDs, never display names.
5. Breaking data-shape changes require a new API version.
6. Unversioned `/api/*.json` aliases may track the current API and should not be used as strict long-term contracts.
