# Research Verification Workflow

RedFrameworks keeps uncertain projects visible as **NOT VERIFIED** while separating discovery from promotion.

## Continuous queue

The verification engine evaluates available metadata for each NOT VERIFIED entry:

- canonical URL;
- model / licensing context;
- evidence tier;
- review date;
- domains;
- upstream availability;
- canonical-repository / fork signal;
- maintainer identity;
- SPDX license metadata;
- release metadata.

The result is published as `verification-queue.json` and shown in the Research Workspace.

## Evidence-assisted promotion

The manual **Research promotion packet** workflow accepts one catalog ID and creates a pull request containing a review packet.

The packet never changes verification status automatically. A human reviewer must confirm provenance, taxonomy, maintenance and evidence before changing an entry to community, verified, commercial or legacy.

## Discovery queue

Candidates without a canonical URL remain in the queue with `canonical_url` as a missing signal. These are the highest-priority source-discovery tasks.
