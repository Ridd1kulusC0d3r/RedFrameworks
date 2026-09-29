# Cloud and Cloud-Native Ecosystem

Cloud offensive security should be organized around **identity, permissions, trust, control plane and attack paths**, not merely a list of provider-specific scripts.

## Verified core

| Project | Role | Primary domain |
|---|---|---|
| Stratus Red Team | granular adversary emulation | AWS, Azure, GCP, Entra ID, Kubernetes |
| CloudFox | situational awareness / attack-path discovery | AWS, Azure, GCP |
| Pacu | AWS offensive assessment framework | AWS |
| BloodHound | identity and relationship attack-path analysis | Active Directory / Entra ID |
| AzureHound | Azure / Entra data collection for BloodHound | Microsoft cloud identity |
| KubeHound | Kubernetes attack-path graphing | Kubernetes |
| Kubescape | posture / configuration / compliance assessment | Kubernetes |

## Classification matters

- **Stratus Red Team** belongs under emulation and detection validation.
- **CloudFox** belongs under discovery and attack-path analysis.
- **Pacu** is an operational assessment framework.
- **BloodHound / AzureHound** are graph-driven attack-path analysis.
- **KubeHound** is attack-path analysis for Kubernetes.
- **Kubescape** is primarily posture and configuration assessment, not a red-team framework.

## Cloud attack-path model

```text
External / Initial Condition
       ↓
Identity
       ↓
Permission
       ↓
Trust Relationship
       ↓
Control-Plane Action
       ↓
Workload / Data
       ↓
Business Impact
```

## Provider-neutral evidence

Every cloud finding should identify:

- principal / workload identity;
- resource;
- permission;
- trust relationship;
- control-plane event;
- relevant telemetry;
- attack-path position;
- business impact;
- remediation;
- retest.

## Selected references

- Stratus Red Team: https://github.com/DataDog/stratus-red-team
- CloudFox: https://github.com/BishopFox/cloudfox
- Pacu: https://github.com/RhinoSecurityLabs/pacu
- AzureHound: https://github.com/SpecterOps/AzureHound
- KubeHound: https://kubehound.io/
