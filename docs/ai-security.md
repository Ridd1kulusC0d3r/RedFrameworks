# AI / GenAI Security and Red Teaming

AI security needs its own layer. Traditional ATT&CK still matters for infrastructure, identity and endpoints, but AI-enabled systems introduce model, prompt, data, retrieval, agent and tool-use risks.

## Core references

| Resource | Type | Use |
|---|---|---|
| MITRE ATLAS | adversary knowledge base | Model tactics and techniques targeting or abusing AI-enabled systems |
| OWASP GenAI Security Project | application-security guidance | GenAI / LLM risks and mitigations |
| NIST AI RMF GenAI Profile | risk-management guidance | Governance and risk framing for GenAI systems |
| Microsoft PyRIT | assessment framework | Structured AI risk identification and red-team workflows |
| NVIDIA garak | assessment toolkit | Automated probing for LLM failure modes |

## Model

```text
Governance
   ↓
AI Asset / Agent Inventory
   ↓
Threat Modeling
   ↓
ATLAS + OWASP Risk Mapping
   ↓
Scenario / Evaluation Design
   ↓
Controlled Assessment
   ↓
Evidence + Safety Impact
   ↓
Mitigation
   ↓
Regression Evaluation
```

## Five AI attack surfaces

### 1. Model

- model behavior;
- guardrails;
- unsafe or unexpected outputs;
- robustness and evaluation drift.

### 2. Data

- training / fine-tuning data;
- retrieval corpora;
- embeddings and vector stores;
- sensitive-data exposure.

### 3. Prompt and context

- instruction hierarchy;
- prompt injection;
- system-prompt assumptions;
- contextual trust boundaries.

### 4. Agent and tools

- excessive agency;
- tool authorization;
- action boundaries;
- memory and state;
- approval gates.

### 5. Platform

- identity;
- APIs;
- cloud permissions;
- secrets;
- logging;
- supply chain.

## Evidence model

For AI findings, record both traditional security evidence and evaluation context:

- model / system version;
- test objective;
- evaluator;
- dataset or scenario source;
- deterministic settings where available;
- observed output or action;
- severity rationale;
- reproducibility;
- safety / security impact;
- regression result.

## Current references

- MITRE ATLAS: https://atlas.mitre.org/
- OWASP GenAI Security Project: https://genai.owasp.org/
- NIST AI RMF GenAI Profile: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
- Microsoft PyRIT: https://github.com/microsoft/PyRIT
- NVIDIA garak: https://github.com/NVIDIA/garak
