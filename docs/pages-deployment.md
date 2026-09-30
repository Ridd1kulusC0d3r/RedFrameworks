# GitHub Pages Deployment

RedFrameworks currently has GitHub's legacy branch-root Pages build enabled. That legacy build can run at the same time as a custom Pages workflow.

The previous architecture allowed two successful deployments for the same commit:

1. the repository's dynamic `pages build and deployment` workflow, which built the repository root with Jekyll;
2. the RedFrameworks custom workflow, which built the dynamic portal into `_site`.

Whichever deployment finished last could become public. This explains why the public URL could occasionally show README-derived content instead of the portal.

## v5.2 deployment model

The custom workflow no longer competes for the Pages deployment environment.

Instead it:

1. validates and builds the canonical portal into `_site`;
2. generates API, entity pages, adversary pages and interoperability exports;
3. runs `scripts/sync_pages_root.py`;
4. synchronizes the generated public site into the branch-root source;
5. commits the generated root artifacts;
6. lets the repository's existing legacy Pages build publish that exact output.

Generated branch-root artifacts include:

~~~text
.nojekyll
index.html
styles.css
app.js
assets/
api/
entity/
technique/
adversary/
exports/
data/*.json
~~~

Canonical YAML source files remain unchanged under `data/`.

## Why this is deterministic

Both the repository root and the generated portal now represent the same web application.

There is no longer a race between:

~~~text
Jekyll README site
vs.
custom portal artifact
~~~

The legacy Pages build simply publishes the synchronized portal.

## CI guard

The Documentation Quality workflow builds the portal into a temporary directory and then runs:

~~~bash
python scripts/sync_pages_root.py --source _site-test --target _pages-root-test
~~~

CI verifies that the synchronized root contains the expected index, assets, API and data files.

## Future simplification

If repository settings are later changed to **Pages → GitHub Actions**, the branch-root synchronization can be removed and the custom deployment model can be restored cleanly.
