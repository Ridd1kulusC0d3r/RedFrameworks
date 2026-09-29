# Taxonomy

RedFrameworks separates concepts that are often incorrectly grouped under the word "framework".

## Six layers

| Layer | Question answered | Examples |
|---|---|---|
| Methodology | How should an engagement be governed and executed? | PTES, NIST SP 800-115, TIBER-EU, CBEST |
| Knowledge model | How do we describe adversary or defensive behavior? | ATT&CK, ATLAS, D3FEND, Attack Flow |
| Emulation / validation | How do we reproduce behavior safely and repeatedly? | CALDERA, Atomic Red Team, Stratus Red Team, OpenBAS |
| Operational platform | Which platform supports an authorized assessment? | BloodHound, Metasploit, Sliver, Mythic |
| Detection / response | How do defenders represent, hunt and validate detections? | Sigma, YARA, Velociraptor |
| Domain guide | What changes for a specific technology domain? | OWASP WSTG, MASTG, IoT ISTG, cloud-native guidance |

## Domain tags

- `enterprise`
- `identity`
- `cloud`
- `kubernetes`
- `web`
- `mobile`
- `iot`
- `ai-genai`
- `endpoint`
- `detection`
- `osint`
- `social-engineering`

## Maturity tags

- **verified** — official source reviewed and currently relevant.
- **community** — useful community project; maintenance should be checked before use.
- **commercial** — product or service rather than an open methodology.
- **legacy** — historically relevant but no longer preferred for new programs.
- **watchlist** — candidate requiring provenance, maintenance or scope verification.

## Core rule

A tool does not become a methodology because it has many modules, and a knowledge base does not become an execution plan because it contains many technique IDs.

This repository intentionally keeps those roles separate.
