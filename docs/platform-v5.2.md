# Platform v5.2 · Graph Intelligence

Platform v5.2 focuses on graph usability, broader framework coverage and resilient publishing.

## Graph Intelligence

The embedded graph is now an analyst workbench rather than a single radial visualization.

Capabilities:

- one-hop and two-hop exploration;
- framework, tool and verified-only modes;
- shortest curated path queries;
- quick-route presets;
- relationship-type distribution;
- confidence and provenance context;
- entity provenance and direct-edge counts.

The dedicated `/graph/` explorer adds:

- full-screen visualization;
- force and radial layouts;
- pan and zoom;
- node-type, status, domain, relationship and confidence filters;
- adversaries as a separate graph layer connected to ATT&CK context.

## Framework expansion

v5.2 adds 11 verified references:

- OWASP Top 10:2025;
- NIST SP 800-63-4;
- NIST SP 800-161 Rev. 1 / Update 1;
- NIST SP 800-190;
- CISA Zero Trust Maturity Model 2.0;
- OpenSSF OSPS Baseline;
- OWASP SCVS 1.0;
- CSA Security Guidance v5;
- ETSI EN 303 645 v3.1.3;
- ISO/IEC 27001:2022;
- ISO/IEC 27005:2022.

## Adversary expansion

The public defensive research layer grows from 22 to 42 ATT&CK-tracked groups.

The additional profiles retain the same safeguards as v5.1: attribution language is source-derived, aliases are treated as analyst context rather than exact identity, and the portal emphasizes defensive priorities rather than offensive procedures.

## Pages resilience

The primary deployment remains the generated GitHub Actions artifact.

A portable fallback is also committed under `site/data/`, with root entry-point redirects, so a legacy branch-based Pages configuration cannot fall back to rendering README content as the public site.

Dynamic details use `detail.html` so deep links work in both deployment modes.
