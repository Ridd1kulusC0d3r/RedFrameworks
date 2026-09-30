# Adversary Matrix

This matrix is a defensive research index derived from `data/adversaries.yaml`.

> Names and aliases are activity-cluster labels. They do not imply that every vendor label is an exact one-to-one identity match.

| Actor | ATT&CK | Type | Motivation | Representative sectors | Defensive focus |
|---|---|---|---|---|---|
| APT28 | G0007 | state-sponsored | espionage | government, defense, research | identity, email, endpoint, cloud identity |
| APT29 | G0016 | state-sponsored | espionage | government, research, technology | cloud identity, supply chain, email |
| Sandworm Team | G0034 | state-sponsored | disruption | government, energy, critical infrastructure | resilience, ICS, identity, recovery |
| Turla | G0010 | state-sponsored | espionage | government, diplomatic, research | network, endpoint, email, identity |
| Gamaredon Group | G0047 | state-sponsored | espionage | government, military, NGOs | email, endpoint, network |
| APT41 | G0096 | mixed | espionage, financial | healthcare, telecom, technology, finance | exposed services, identity, web, databases |
| Volt Typhoon | G1017 | state-sponsored | strategic access | critical infrastructure, communications, OT | network devices, identity, edge inventory, OT |
| Salt Typhoon | G1045 | state-sponsored | espionage | telecommunications, ISP, network infrastructure | network devices, telecom, identity |
| Mustang Panda | G0129 | state-sponsored | espionage | government, diplomatic, NGOs, research | email, endpoint, identity |
| BlackTech | G0098 | suspected state-linked | espionage | media, engineering, electronics, finance | network infrastructure, endpoint, certificates |
| Lazarus Group | G0032 | state-sponsored | espionage, financial | government, finance, crypto, defense | identity, endpoint, supply chain, fraud |
| Kimsuky | G0094 | state-sponsored | espionage | government, think tanks, education | email, identity, cloud accounts |
| MuddyWater | G0069 | state-sponsored | espionage | government, telecom, finance, defense, energy | identity, endpoint, remote access |
| OilRig | G0049 | state-sponsored | espionage | finance, government, energy, telecom | identity, cloud, supply chain, email |
| Transparent Tribe | G0134 | suspected state-linked | espionage | diplomatic, defense, research | email, endpoint, domains |
| APT32 | G0050 | suspected state-linked | espionage | government, private sector, media | web, email, endpoint, identity |
| Patchwork | G0040 | unresolved attribution | espionage | government, diplomatic, think tanks | email, documents, endpoint |
| Sidewinder | G0121 | suspected state-linked | espionage | government, military, business | email, web, endpoint |
| Scattered Spider | G1015 | cybercrime | financial | technology, telecom, hospitality, retail | help desk, identity, MFA, cloud admin |
| FIN7 | G0046 | cybercrime | financial | retail, hospitality, finance, cloud | identity, endpoint, payment, cloud |
| Wizard Spider | G0102 | cybercrime | financial, ransomware | healthcare, enterprise, critical services | ransomware resilience, identity, recovery |
| TA505 | G0092 | cybercrime | financial | enterprise, finance, commercial organizations | email, endpoint, identity, ransomware resilience |

## Analyst workflow

~~~mermaid
flowchart LR
  A["Actor / cluster"] --> B["Aliases & provenance"]
  B --> C["Sector / region context"]
  C --> D["Relevant ATT&CK behavior"]
  D --> E["Telemetry & detection"]
  E --> F["Validation scenario"]
  F --> G["Evidence & retest"]
~~~

The intended outcome is defensive prioritization and evidence planning, not operational emulation instructions.

See the canonical profiles in [data/adversaries.yaml](../data/adversaries.yaml).
