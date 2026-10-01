# APT Ecosystem Index

This page is the RedFrameworks index for **APT / adversary intelligence, campaigns, emulation, purple-team validation and related research**.

> Scope: descriptive, source-aware, defensive and research-oriented. Operational platforms are cataloged as ecosystem context; this index does not provide command-level procedures.

## 1. Tracked adversaries

RedFrameworks currently tracks **42 ATT&CK-aligned adversary profiles**:

APT28 · APT29 · Sandworm Team · Turla · Gamaredon Group · APT41 · Volt Typhoon · Salt Typhoon · Mustang Panda · BlackTech · Lazarus Group · Kimsuky · MuddyWater · OilRig · Transparent Tribe · APT32 · Patchwork · Sidewinder · Scattered Spider · FIN7 · Wizard Spider · TA505 · Agrius · Andariel · Aoqin Dragon · APT1 · APT3 · APT5 · APT12 · APT16 · APT17 · APT18 · APT19 · APT30 · APT33 · APT37 · APT38 · APT39 · APT42 · Axiom · BackdoorDiplomacy · BITTER.

Canonical data: [data/adversaries.yaml](../data/adversaries.yaml)

## 2. Campaign intelligence

| Campaign | ATT&CK ID | Actor context |
|---|---|---|
| SolarWinds Compromise | C0024 | APT29 |
| Operation Dream Job | C0022 | Lazarus Group |
| Operation Wocao | C0014 | suspected China-based activity; overlap context retained from source |
| Operation CuckooBees | C0012 | APT41 / Winnti overlap context |
| APT41 DUST | C0040 | APT41 |
| HomeLand Justice | C0038 | Iran-linked disruptive campaign context |
| CostaRicto | C0004 | hacker-for-hire espionage context |
| Frankenstein | C0001 | unidentified targeted campaign |

Canonical data: [data/campaigns.yaml](../data/campaigns.yaml)

## 3. Adversary emulation plans

| Plan | Provider |
|---|---|
| MITRE APT3 Adversary Emulation Plan | MITRE ATT&CK |
| CTID APT29 Emulation Plan | Center for Threat-Informed Defense |
| CTID Blind Eagle Emulation Plan | Center for Threat-Informed Defense |
| CTID Carbanak Emulation Plan | Center for Threat-Informed Defense |
| CTID FIN6 Emulation Plan | Center for Threat-Informed Defense |
| CTID FIN7 Emulation Plan | Center for Threat-Informed Defense |
| CTID menuPass Emulation Plan | Center for Threat-Informed Defense |
| CTID OceanLotus Emulation Plan | Center for Threat-Informed Defense |
| CTID OilRig Emulation Plan | Center for Threat-Informed Defense |
| CTID Sandworm Emulation Plan | Center for Threat-Informed Defense |
| CTID Turla Emulation Plan | Center for Threat-Informed Defense |
| CTID Wizard Spider Emulation Plan | Center for Threat-Informed Defense |
| CTID Micro Emulation Plans | Center for Threat-Informed Defense |

## 4. APT / CTI frameworks and knowledge models

| Framework / model | Status | Role |
|---|---|---|
| MITRE ATLAS | verified | AI adversary knowledge base |
| MITRE D3FEND | verified | defensive knowledge base |
| CTID Adversary Emulation Library | verified | threat-informed emulation plans |
| TIBER-EU | verified | threat-led testing |
| CBEST | verified | threat-led testing |
| MITRE Engage | verified | adversary engagement |
| MITRE CALDERA | verified | emulation automation |
| FIRST EPSS | verified | vulnerability exploitation-likelihood context |
| OASIS STIX 2.1 | verified | CTI data model |
| OASIS TAXII 2.1 | verified | CTI transport |
| OASIS CACAO | verified | security playbooks |
| FIRST TLP 2.0 | verified | sharing boundaries |
| VERIS | verified | incident data model |
| Cyber Kill Chain | verified | intrusion lifecycle model |
| MISP Galaxy | verified | threat-actor and CTI knowledge clusters |

## 5. Established validation and emulation platforms

Stratus Red Team · OpenAEV · Infection Monkey · TTPForge · VECTR · Splunk Attack Range · Realm · AdaptixC2 · Empire · Sliver · Mythic · PoshC2 · Cobalt Strike · SafeBreach · AttackIQ · Picus Security.

These entries have different project statuses such as verified, community, or commercial and are **not presented as a ranking**.

## 6. Legacy context

DetectionLab · Havoc.

Legacy means useful historical/ecosystem context, not a current recommendation.

## 7. NOT VERIFIED adversary / purple / operational research candidates

vanguard · APTSimulator · laccolith · bear-c2 · gloamfire · Woodpecker · opfor · bounty-hunter · temperance · peekaboo · foojank · LazyOwn · SeersX · Cosmos Orbit · Elaina-C2 · wyrm · pexpagent · phantomstrike · Covenant · Koadic · silenttrinity · Pupy · TrevorC2 · DNSCat2 · Faction C2 · The 360 Cyber Shield · skyhawk-security-autonomous-purple-team · MALIAB · AEGIS · DeepAttacker · aiBAS360 · BlindSpot · SIMPLE-ICS Testbed · Purple Team Playground · Rust Bucket.

These remain Tier D / research candidates until provenance, maintenance, licensing and scope are reviewed.

## 8. CTI research sources

MITRE ATT&CK Groups · MISP Galaxy · CISA Cybersecurity Advisories · Microsoft Threat Intelligence · Google Threat Intelligence · Palo Alto Networks Unit 42 · ESET Research · Kaspersky Securelist APT Reports · Cisco Talos Intelligence · Trend Micro Research · SentinelLABS · Elastic Security Labs · CrowdStrike Global Threat Report.

Canonical data: [data/intelligence-sources.yaml](../data/intelligence-sources.yaml)

## 9. Detection Intelligence

The APT layer connects to defensive detection intelligence through ATT&CK technique IDs, telemetry requirements, detection hypotheses, evidence requirements, D3FEND-oriented defensive actions, purple-team scorecards and retest outcomes.

Canonical data: [data/detection-intelligence.yaml](../data/detection-intelligence.yaml)

## 10. Domain packs relevant to APT analysis

Identity & Access · Cloud & Multi-Cloud · AI / GenAI Security · Web & API · Software Supply Chain · Purple Team & Detection · ICS / OT · IoT & Embedded.

Canonical data: [packs/index.yaml](../packs/index.yaml)

## 11. Public surfaces

- [Adversary Intelligence](https://ridd1kulusc0d3r.github.io/RedFrameworks/#adversaries)
- [Graph Intelligence](https://ridd1kulusc0d3r.github.io/RedFrameworks/#graph)
- [Full graph explorer](https://ridd1kulusc0d3r.github.io/RedFrameworks/graph/)
- [Adversary Validation Planner](https://ridd1kulusc0d3r.github.io/RedFrameworks/planner/)
- [Visual Intelligence](https://ridd1kulusc0d3r.github.io/RedFrameworks/intelligence/)
- [API v4](api.md)

## 12. Continuous discovery

The Continuous CTI intelligence workflow checks public MITRE ATT&CK STIX for group and campaign entities missing from RedFrameworks.

Discovery is **proposal-only** and requires human review before canonical data changes.
