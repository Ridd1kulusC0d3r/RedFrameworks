# Dataset Integrity & Release Provenance

RedFrameworks v5 release workflows produce reproducible snapshots, SHA-256 checksums and GitHub build-provenance attestations.

## Release integrity

Tagged releases package the canonical data, schemas, SDKs, exports, documentation and generated API.

The release includes:

- `SHA256SUMS.txt`;
- a reproducible catalog snapshot;
- semantic diff when a prior release snapshot is available;
- GitHub build-provenance attestation for the release archive.

## Local checksum verification

~~~bash
sha256sum -c SHA256SUMS.txt
~~~

On platforms with another checksum utility, verify the SHA-256 value using the equivalent native command.

## API integrity

Use versioned endpoints for integrations. The unversioned aliases are convenience endpoints and may follow the current contract.

## Trust boundary

Checksums prove byte integrity. They do not prove that a catalog claim is correct.

Claim trust still depends on RedFrameworks provenance tiers, verification status, source references and human review.
