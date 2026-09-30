# Research Registry — NOT VERIFIED

RedFrameworks no longer hides research candidates in a separate watchlist.

All previously pending candidates are now visible in `catalog.yaml` with:

- `status: not-verified`
- `evidence_tier: D`
- `model: unknown`
- an explicit verification note

This keeps the catalog complete **without presenting unverified projects as recommendations**.

## What NOT VERIFIED means

It means RedFrameworks has not yet confirmed enough of the following:

1. canonical upstream;
2. current maintainer or organization;
3. maintenance state;
4. license or commercial model;
5. correct taxonomy;
6. supported domains;
7. lifecycle / archive state;
8. documentation quality;
9. relationship to the rest of the ecosystem;
10. primary-source evidence.

## Visible research groups

The current NOT VERIFIED registry includes candidates across:

- AI / autonomous security;
- adversary emulation;
- operational platforms;
- infrastructure / automation;
- cloud / Kubernetes;
- IoT / embedded;
- purple-team / validation;
- legacy / maintenance review.

The canonical list is now the set of `catalog.yaml` entries where:

~~~yaml
status: "not-verified"
evidence_tier: "D"
~~~

## Promotion path

~~~mermaid
flowchart LR
  N["NOT VERIFIED · Tier D"] --> P["Primary-source review"]
  P --> C["Community / Tier C-B"]
  C --> V["Verified / Tier A-B"]
  P --> L["Legacy"]
~~~

Promotion requires evidence, not enthusiasm.
