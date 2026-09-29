# Catalog Expansion — 2026-09-29

This review expands RedFrameworks without turning it into an uncurated tool dump.

## Promoted to the catalog

| Entry | Classification | Decision |
|---|---|---|
| Metasploit Framework | assessment framework | Canonical Rapid7 upstream verified |
| BloodHound | attack-path analysis | Canonical SpecterOps upstream verified |
| Infection Monkey | adversary-emulation platform | Maintained public upstream verified |
| TTPForge | attack-simulation framework | Meta/Facebook Incubator upstream verified |
| VECTR | purple-team platform | Security Risk Advisors upstream verified |
| Splunk Attack Range | detection-lab platform | Splunk upstream verified |
| Realm | adversary-emulation platform | Spellshift upstream verified |
| AdaptixC2 | operational platform | Canonical project upstream verified |
| Empire | operational platform | BC Security upstream verified |
| ROADtools | identity-assessment toolkit | Canonical upstream verified |
| MicroBurst | cloud-assessment toolkit | NetSPI upstream verified |
| Stormspotter | Azure graph analysis | Microsoft Azure upstream verified; classified community |
| EXPLIoT | IoT assessment framework | Official docs and GitLab upstream verified |
| RouterSploit | embedded assessment framework | Threat9 upstream verified |

## Corrected naming

**OpenBAS → OpenAEV**

OpenBAS was renamed to OpenAEV (Open Adversarial Exposure Validation). The catalog now uses the current name while preserving OpenBAS as an alias.

## Retained as legacy

| Entry | Why |
|---|---|
| DetectionLab | Upstream states it is no longer actively maintained |
| Havoc | Canonical repository is archived |

Legacy does not mean useless. It means the repository should not imply that the project is a current default.

## Expanded research watchlist

The watchlist now also captures the additional candidate names gathered during research, including AI/autonomous security, adversary emulation, C2/operational platforms, cloud, IoT/embedded, purple team and broad offensive-security toolkits.

See [Research Watchlist](watchlist.md) for the full current set.

## Decision rule

A project is not promoted because its README calls it "advanced", "AI-powered", "stealth", "APT-grade" or "next-generation". Those are adjectives, not evidence.

Promotion requires:

- canonical upstream;
- traceable ownership / maintainer;
- meaningful maintenance state;
- license or commercial model;
- correct taxonomy;
- primary use case;
- review date;
- defensible reason for inclusion.
