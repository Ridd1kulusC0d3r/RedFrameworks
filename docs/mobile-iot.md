# Mobile, IoT and Embedded Security

These domains deserve dedicated methodologies because their trust boundaries, evidence sources and failure modes differ from conventional enterprise systems.

## Mobile

### Methodology and standards

- **OWASP MASVS** — security requirements / verification standard for mobile applications.
- **OWASP MASTG** — testing guidance for mobile application security.

### Assessment ecosystem

| Tool | Role |
|---|---|
| MobSF | automated static and dynamic mobile application security assessment |
| Frida | dynamic instrumentation |
| Objection | runtime mobile assessment built around Frida |
| drozer | Android security assessment framework |

The preferred structure is:

```text
MASVS requirements
      ↓
MASTG test guidance
      ↓
Static / dynamic analysis
      ↓
Evidence
      ↓
Remediation
      ↓
Regression test
```

## IoT / Embedded

### Methodology and standards

- **OWASP IoT Security Testing Guide (ISTG)** — methodology and test-case model for IoT assessments.
- **OWASP IoT Security Verification Standard (ISVS)** — security requirements for IoT applications and ecosystems.

### Asset model

Assess IoT as an ecosystem:

```text
Device
 + Firmware
 + Hardware
 + Mobile / Web App
 + Cloud Backend
 + Identity
 + Network Protocols
 + Update / Supply Chain
```

Avoid treating an IoT assessment as "scan the IP address and call it done."

## Selected references

- OWASP IoT Security Testing Guide: https://owasp.org/projects/iot-security-testing-guide
- OWASP IoT Security Verification Standard: https://owasp.org/projects/iot-security-verification-standard
- MobSF: https://github.com/MobSF/Mobile-Security-Framework-MobSF
- Frida: https://frida.re/
