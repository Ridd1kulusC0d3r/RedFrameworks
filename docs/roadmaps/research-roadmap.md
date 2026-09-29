# Research Promotion Roadmap

Research candidates move into the verified catalog through evidence, not adjectives.

```mermaid
flowchart TD
  C[Candidate discovered] --> U{Canonical upstream?}
  U -- No --> W[Remain watchlist]
  U -- Yes --> M{Meaningfully maintained?}
  M -- No --> L[Legacy / historical review]
  M -- Yes --> LIC[License / commercial model]
  LIC --> TAX[Correct taxonomy]
  TAX --> SRC[Primary-source review]
  SRC --> USE[Clear defensive / assessment use case]
  USE --> P[Promote]
  P --> MON[90d / 180d review cadence]
```

## Promotion gate

A candidate needs:

1. canonical upstream;
2. traceable maintainer or organization;
3. maintenance state;
4. license or commercial model;
5. correct classification;
6. supported domain;
7. primary use case;
8. review date;
9. evidence tier;
10. relationship to the existing ecosystem.

## Demotion gate

A verified entry can move to community or legacy if:

- upstream is archived;
- a successor is recommended;
- documentation disappears;
- compatibility becomes materially obsolete;
- maintenance becomes unclear.
