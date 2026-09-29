# Operational Tooling Landscape

This page intentionally separates **operational tools** from **methodologies and standards**.

The presence of a tool here is not a recommendation to use it in every engagement. Use only in authorized environments and under documented Rules of Engagement.

## Adversary-emulation / C2 platforms

### Open-source / community

- Sliver
- Mythic
- Empire
- Havoc
- PoshC2
- Merlin
- DeimosC2
- AdaptixC2

### Commercial

- Cobalt Strike
- Brute Ratel C4
- Nighthawk
- SCYTHE

These platforms should be documented by:

- current maintenance status;
- supported platforms;
- authorization model;
- auditability;
- collaboration features;
- evidence export;
- safety controls;
- integration with threat-informed workflows.

Avoid ranking them by "evasion" or similar vanity criteria. For this repository, the useful question is **which testing objective and governance model they support**.

## Identity and post-compromise analysis

- BloodHound
- AzureHound
- Impacket
- Certipy
- Rubeus
- PEASS-ng

## Reconnaissance / OSINT

- SpiderFoot
- Recon-ng
- theHarvester
- Shodan

These are supporting tools. They do not replace an intelligence collection plan, source validation, confidence assessment or legal scope.

## Social-engineering simulation

- Social-Engineer Toolkit (SET)
- GoPhish

Social-engineering exercises require explicit authorization, target population rules, privacy constraints and debriefing procedures.

## Mobile

- MobSF
- Frida
- Objection
- drozer

## Container / Kubernetes

- KubeHound
- kube-hunter
- Kubescape
- CDK
- Peirates
- DEEPCE

Projects in fast-moving cloud-native ecosystems should be reviewed for maintenance and current Kubernetes compatibility before inclusion in an engagement.
