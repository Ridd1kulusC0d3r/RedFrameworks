# CTI, Incident Response & Resilience Frameworks

Platform v5.1 adds a focused set of standards that connect adversary intelligence to response and resilience.

| Framework / standard | Role in RedFrameworks | Version / state |
|---|---|---|
| OASIS STIX | machine-readable CTI representation | 2.1 / Errata 01 |
| OASIS TAXII | CTI transport and collection API | 2.1 |
| OASIS CACAO | structured security playbooks | 2.0 CS01 |
| FIRST TLP | intelligence-sharing boundaries | 2.0 |
| FIRST CSIRT Services Framework | CSIRT service portfolio model | 2.1 |
| VERIS | structured security incident vocabulary | 1.3.1 |
| NIST SP 800-61 | incident response aligned to CSF 2.0 | Rev. 3 |
| NIST SP 800-160 Vol. 2 | cyber-resilience engineering | Rev. 1 |
| CISA CPGs | prioritized cybersecurity outcomes | current |
| Cyber Kill Chain | intrusion lifecycle model | current reference |
| MISP Galaxy | CTI clusters and relationships | continuously maintained |
| SSVC | context-aware vulnerability-response prioritization | current |
| OASIS CSAF | machine-readable security advisories | 2.0 / Errata 01 |

## How they fit together

~~~mermaid
flowchart LR
  INTEL["STIX · TAXII · MISP · TLP"] --> MODEL["ATT&CK · Kill Chain"]
  MODEL --> RESP["CACAO · NIST 800-61"]
  RESP --> RES["NIST 800-160 · CISA CPG"]
  VULN["CSAF · CVSS · EPSS · SSVC"] --> RESP
  VERIS["VERIS"] --> RESP
~~~

### Intelligence exchange

Use STIX to represent CTI, TAXII to exchange it, TLP to communicate sharing boundaries, and MISP Galaxy to enrich clusters and relationships.

### Incident analysis and response

VERIS helps structure incident data. NIST SP 800-61 Rev. 3 frames incident response within CSF 2.0. CACAO provides a machine-readable model for response playbooks.

### Resilience

NIST SP 800-160 Vol. 2 Rev. 1 provides a systems-engineering approach to cyber resilience, while CISA CPGs provide prioritized security outcomes.

### Vulnerability context

CSAF represents advisories, CVSS describes technical severity, EPSS estimates exploitation likelihood, and SSVC helps stakeholders make contextual response decisions.

The framework graph is deliberately cross-domain. No single model replaces the others.
