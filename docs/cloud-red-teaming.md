# Cloud Red Teaming

Cloud red teaming must treat **identity and control-plane permissions** as first-class attack surfaces. Copying an on-premises methodology into cloud environments misses the point.

## Scope dimensions

Model scope across four planes:

| Plane | Examples |
|---|---|
| Identity | users, service principals, roles, workload identities |
| Control plane | management APIs, IAM, policy, resource configuration |
| Data plane | storage, databases, secrets, application data |
| Workload plane | VMs, containers, serverless, Kubernetes |

## Pre-engagement requirements

Cloud engagements should explicitly document:

- cloud provider(s);
- tenant / account / subscription / project boundaries;
- production vs lab resources;
- allowed identities;
- allowed regions;
- provider penetration-testing policies;
- managed-service restrictions;
- API-rate constraints;
- prohibited denial-of-service behavior;
- logging and retention configuration;
- emergency contacts.

## Threat model

Prioritize questions such as:

- Can a low-privilege identity reach a privileged role?
- Are workload identities over-permissioned?
- Can secrets cross trust boundaries?
- Do management-plane actions generate sufficient telemetry?
- Can exposed workloads reach sensitive cloud services?
- Are organization / tenant guardrails effective?
- Are temporary credentials constrained?
- Can a compromised pipeline affect production?

## Evidence sources

Useful evidence categories include:

- identity and role configuration;
- policy definitions;
- cloud audit logs;
- resource activity logs;
- workload telemetry;
- security-service alerts;
- configuration history;
- CI/CD audit events.

## Cloud finding model

Each finding should identify:

- cloud plane;
- identity involved;
- permission or trust relationship;
- affected resource;
- attack-path role;
- business consequence;
- telemetry;
- detection status;
- remediation;
- retest.

## Cloud attack-path representation

```text
External exposure
    ↓
Workload identity
    ↓
Excess permission
    ↓
Control-plane action
    ↓
Sensitive resource
```

The value is in the relationships. Listing five misconfigurations independently can hide the fact that together they form one material attack path.

## Multi-cloud consistency

Use one common abstraction across providers:

```text
Identity
Resource
Permission
Trust
Telemetry
Detection
Business impact
```

Provider-specific implementation details can then sit beneath that model.

## Safety

Cloud environments can amplify mistakes quickly. Use explicit stop criteria, change tracking, least-impact proof methods and provider-specific authorization requirements.
