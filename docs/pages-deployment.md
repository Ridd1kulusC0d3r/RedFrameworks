# GitHub Pages Deployment

The repository contains a GitHub Pages pipeline in `.github/workflows/pages.yml`.

## Automated flow

The workflow checks out the repository, installs Python/PyYAML, builds the static catalog from `frameworks.yaml`, `catalog.yaml` and `relationships.yaml`, configures Pages, uploads the artifact and deploys it.

The regular documentation CI also builds the site before merge.

## Expected public address

`https://ridd1kulusc0d3r.github.io/RedFrameworks/`

## Enablement behavior

The workflow now uses `actions/configure-pages@v5` with `enablement: true`, so it attempts to enable Pages automatically.

If the repository token is not allowed to perform the administrative enablement, the fallback is one manual repository setting:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

No long-lived privileged token should be added merely to automate that one switch.

## Deployment triggers

Deployment runs when `main` changes catalog data, relationship data, site code, the build script or the Pages workflow. It can also be triggered manually.
