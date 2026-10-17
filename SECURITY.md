# Security Policy

## Supported Versions

We take the security of Quantum Sentinel AI (QSAI) and the Chronos Cyber Defense ecosystem seriously. The following table indicates supported branches and versions:

| Version | Supported          | Security Maintenance Level |
| ------- | ------------------ | -------------------------- |
| 1.x     | :white_check_mark: | Full PQC & Patch Support   |
| < 1.0   | :x:                | End of Life                |

## Post-Quantum Cryptographic Agility

QSAI is engineered to be crypto-agile, adhering to NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA), and Falcon standards. If a post-quantum algorithm is discovered to have a structural lattice or hash weakness, our cryptographic matrix enables automated hot-key rotation and algorithm deprecation without service interruption.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report vulnerabilities by contacting our core security team via:
* **Email**: security@quantumsentinel.ai
* **Encrypted Subject**: `[SECURITY VULNERABILITY] <Brief Description>`

### Vulnerability Report Checklist
To help us triage and reproduce the issue rapidly, please include:
1. **Description**: Clear description of the vulnerability, potential attack vector, and affected component (Frontend, Express Backend, Python Quantum AI Engine, or Chronos Ledger).
2. **Steps to Reproduce**: Minimal proof-of-concept (PoC) code or curl command sequence.
3. **Impact**: Estimated CVSS severity, affected data, or privilege escalation potential.
4. **Suggested Fix**: If you have a remediation patch, please include it.

## Response Timeline & SLA

* **Initial Triage**: Within 24 hours of submission.
* **Status Update & Assessment**: Within 72 hours.
* **Remediation & Patch Deployment**: Critical vulnerabilities within 7 calendar days; High within 14 days.
* **Coordinated Disclosure**: We follow responsible 90-day coordinated vulnerability disclosure, publishing detailed CVE advisories once patches are live.

## System Hardening Guidelines

When deploying QSAI to production:
* Ensure environment variables (`GEMINI_API_KEY`, etc.) are configured via secure key management (GCP Secret Manager, HashiCorp Vault).
* Keep reverse proxies configured with TLS 1.3 and HSTS (`Strict-Transport-Security`).
* Maintain Content Security Policy (CSP) headers as enforced by the server middleware.
* Limit outbound egress on the Python runner sandbox process.
