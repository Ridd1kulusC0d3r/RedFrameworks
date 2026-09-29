# GitHub Pages Deployment

The repository contains a complete GitHub Pages pipeline in `.github/workflows/pages.yml`.

## What is already automated

The workflow:

1. checks out the repository;
2. installs Python and PyYAML;
3. builds the static catalog from `frameworks.yaml` and `catalog.yaml`;
4. generates the Pages artifact;
5. deploys through GitHub's official Pages actions.

The site build itself is validated by the regular documentation CI.

## One-time repository setting

GitHub requires Pages to be enabled once at repository level before `actions/configure-pages` can deploy.

In GitHub:

1. open **Settings**;
2. open **Pages**;
3. under **Build and deployment**, set **Source** to **GitHub Actions**.

After that, run **Build and deploy knowledge base** from the Actions tab, or push any relevant catalog/site change to `main`.

## Expected public address

For the current repository name, GitHub Pages normally publishes at:

`https://ridd1kulusc0d3r.github.io/RedFrameworks/`

Do not advertise that address as live until the first deployment succeeds.

## Why the workflow does not self-enable Pages

GitHub's `actions/configure-pages` supports an enablement mode, but enabling Pages requires repository administration / Pages write permissions beyond the default `GITHUB_TOKEN`. Keeping enablement explicit avoids requiring a long-lived privileged token or secret merely to flip a one-time repository setting.
