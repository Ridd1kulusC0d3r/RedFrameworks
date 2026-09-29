# RedFrameworks Roadmaps

RedFrameworks now separates roadmaps by concern instead of maintaining one eternal checkbox cemetery.

| Roadmap | Purpose |
|---|---|
| [Platform](platform-roadmap.md) | Product / architecture evolution |
| [Analyst](analyst-roadmap.md) | How an analyst should progress through the knowledge base |
| [Data & Provenance](data-roadmap.md) | Schema, curation, freshness and lifecycle intelligence |
| [Evidence](evidence-roadmap.md) | Move from activity to measurable defensive evidence |
| [Research](research-roadmap.md) | Promote research candidates into the verified core |

```mermaid
flowchart LR
  R[RedFrameworks] --> P[Platform]
  R --> A[Analyst]
  R --> D[Data & Provenance]
  R --> E[Evidence]
  R --> X[Research]
  P --> KG[Knowledge Graph]
  D --> Q[Trustworthy Catalog]
  E --> M[Measurable Validation]
  X --> C[Curated Expansion]
```
