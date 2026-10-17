# Quantum Sentinel AI (QSAI)

### The Chronos Cyber Defense Platform
*A proactive, adaptive, and future-proof quantum-resilient defense ecosystem leveraging symbiotic AI, Post-Quantum Cryptography (PQC), and immutable ledger anchoring.*

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg)](https://tailwindcss.com/)
[![Python 3](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![NIST PQC](https://img.shields.io/badge/NIST-FIPS_203_%2F_204_%2F_205-emerald.svg)](https://csrc.nist.gov/projects/post-quantum-cryptography)
[![CI](https://img.shields.io/badge/CI-Passing-brightgreen.svg)](https://github.com/quantum-sentinel-ai/qsai/actions)

---

## Executive Overview

**Quantum Sentinel AI (QSAI)** is an enterprise-grade cyber defense platform engineered to safeguard critical infrastructure against next-generation threats, including quantum-assisted cryptanalysis (Shor's and Grover's algorithms), autonomous neural attack swarms, and polymorphic evasions.

Unlike legacy reactive security information and event management (SIEM) systems, QSAI unites **35 proactive defense modules** across four core archetypes—**Quantum**, **Neural**, **Blockchain**, and **Classic**—with a scratch-built, pure Python 3 quantum simulation core, interactive graph neural network attack topologies, real-time threat velocity analytics, and cryptographic ledger anchoring.

---

## Key Platform Capabilities

### 1. Interactive Attack Path Topology & Host Telemetry
* **Graph Neural Network (GNN) Message Passing**: Visualizes dynamic pivot paths, honeypot decoys, and critical egress gateways in real-time.
* **Enhanced Selected Host Details Box (`#node-details-box`)**:
  * **Dynamic Host Uptime Gauge**: Continuous live runtime duration tracking (`Xd Xh Xm Xs`), high-availability SLA status, and percentage gauge bar.
  * **Dynamic Packet Inspection Latency Gauge**: Live wire-speed packet inspection latency gauge with dynamic jitter delta and color-coded safety tiers (Wire-Speed `<5ms`, Nominal `<15ms`, Elevated `15ms+`).
  * **Real-Time Traffic Alert Indicator (`#traffic-alert-indicator`)**: Features a simulated internal ingress check. When a selected host experiences an unusual influx of incoming packets (e.g., volumetric SYN floods or honeypot reconnaissance spikes), the indicator **glows red** with a pulsing alert, computing exact threshold excess percentages.
  * **Interactive Host Isolation & Surge Controls**: Toggle host isolation posture from the zero-trust mesh with a single click, or inject a simulated traffic surge pattern to test alert heuristics.

### 2. Threat Density Heatmap & Threat Velocity Overlay
* **60-Second Threat Velocity Line Chart Overlay**: Displays the instantaneous rate-of-change in threat frequency ($dF/dt$) over a sliding 60-second window at 1-second resolution.
* **Rapid Escalation Pattern Detection**: Triggers an alert badge whenever velocity exceeds the $+2.50\text{ ev/s}$ threshold.
* **Archetype Dropdown Filter**: Seamlessly filter risk nodes between **Quantum**, **Neural**, **Blockchain**, and **Classic** archetypes to eliminate visual clutter during incidents.

### 3. Pure Python 3 Quantum AI Engine (`quantum_ai_engine/`)
Engineered completely from scratch using standard Python 3 with **zero third-party dependencies**:
* **`quantum_math.py`**: Complex linear algebra, Kronecker tensor products, unitary quantum gates ($H, X, Y, Z, S, T, R_X, R_Y, R_Z, \text{CNOT}, \text{CZ}, \text{SWAP}$), $N$-qubit state register simulation, and Pauli expectation values.
* **`vqc_classifier.py`**: Variational Quantum Classifier (VQC) with Parameterized Quantum Circuits (PQC) and exact analytic gradient calculation via the **Parameter-Shift Rule**:
  $$\frac{\partial \langle H \rangle}{\partial \theta} = \frac{\langle H \rangle_{\theta + \frac{\pi}{2}} - \langle H \rangle_{\theta - \frac{\pi}{2}}}{2}$$
* **`quantum_walk.py`**: Continuous-Time Quantum Walk (CTQW) on arbitrary network graphs using Hamiltonian matrix exponentiation ($U(t) = e^{-i H t}$) to pinpoint adversary pivot paths and optimal decoy placements.
* **`qgan_synthesizer.py`**: Quantum Generative Adversarial Network (QGAN) synthesizing polymorphic evasion signatures to stress-test detection filters.
* **`qrl_defense.py`**: Quantum Reinforcement Learning (QRL) agent utilizing Grover-inspired amplitude amplification for autonomous zero-trust policy adaptation.
* **`qnlp_intel.py`**: DisCoCat (Distributional Compositional Categorical) quantum natural language processing engine parsing threat feeds into tensor networks and computing Hilbert space overlap fidelity.
* **`runner.py`**: Unified CLI and JSON execution harness with input sanitization and automated regression tests.

### 4. NIST Post-Quantum Cryptography (PQC) Audit Matrix
* Full lifecycle tracking for NIST post-quantum cryptographic standards:
  * **ML-KEM-768 / ML-KEM-1024** (FIPS 203, Crystals-Kyber)
  * **ML-DSA-65 / ML-DSA-87** (FIPS 204, Crystals-Dilithium)
  * **SLH-DSA-128 / SLH-DSA-256** (FIPS 205, SPHINCS+)
  * **Falcon-512 / Falcon-1024** (Lattice-based signatures)
* Live keypair rotation and quantum readiness posture assessment.

### 5. Chronos Immutable Blockchain Ledger
* Every threat mitigation event, audit log, and quantum analysis result can be anchored to the internal Chronos blockchain.
* SHA-256 Merkle block generation ensures cryptographically tamper-evident compliance trails.

### 6. AI Threat Copilot & Hardened Architecture
* **AI Copilot**: Integrated with Google Gemini models via server-side proxy routes to provide contextual threat analysis and remediation playbooks.
* **Production Hardening**: Enforces strict Content Security Policy (CSP) headers, rate limiting (100 req/min general, 15 req/min LLM), 256KB request payload limits, and isolated subprocess execution.

---

## Architecture Diagram

```
+-------------------------------------------------------------------------+
|                           User Web Interface                            |
|             (React 19 + TypeScript + Tailwind CSS 4 + Vite)             |
|                                                                         |
|  +--------------------+  +----------------------+  +-----------------+  |
|  | Threat Density     |  | Attack Path Graph    |  | NIST PQC Matrix |  |
|  | Heatmap & Velocity |  | Gauges & Alerts      |  | & Key Rotation  |  |
|  +--------------------+  +----------------------+  +-----------------+  |
|  +--------------------+  +----------------------+  +-----------------+  |
|  | Quantum AI Python  |  | Avant-Garde Defense  |  | Chronos Ledger  |  |
|  | Workspace & Code   |  | Lab Tools            |  | Anchoring       |  |
|  +--------------------+  +----------------------+  +-----------------+  |
+------------------------------------+------------------------------------+
                                     |
                                     | HTTP REST / JSON
                                     v
+-------------------------------------------------------------------------+
|                       Hardened Express Backend                          |
|                             (server.ts)                                 |
|                                                                         |
|  [Security Headers]  [Rate Limiter]  [Input Sanitizer]  [CORS Guards]   |
|                                                                         |
|  Routes:                                                                |
|   * /api/modules/:id/simulate  -> Live defense simulator logic          |
|   * /api/quantum-ai/run        -> Subprocess executor for Python engine |
|   * /api/blockchain/anchor     -> SHA-256 immutable block anchoring    |
|   * /api/gemini/chat           -> Server-side AI copilot proxy          |
+------------------------------------+------------------------------------+
                                     |
                  +------------------+------------------+
                  |                                     |
                  v                                     v
+-----------------------------------+ +-----------------------------------+
|  Quantum AI Python Engine Core    | |        Chronos Blockchain         |
|      (quantum_ai_engine/)         | |              Ledger               |
|                                   | |                                   |
| * Pure Python 3 (0 dependencies)  | | * SHA-256 Merkle Root Proofs      |
| * Quantum Math & State Vectors    | | * Proof-of-Authority (PoA) Block  |
| * VQC with Parameter-Shift Rule   | |   Generation                      |
| * Continuous-Time Quantum Walks   | | * Tamper-Evident Security Logs    |
| * QGAN Adversarial Synthesizer    | +-----------------------------------+
| * QRL Zero-Trust Firewall Agent   |
| * QNLP DisCoCat Intel Parser      |
+-----------------------------------+
```

---

## Directory Structure

```
├── .github/
│   ├── workflows/
│   │   └── ci.yml                 # GitHub Actions CI (Python + Node.js)
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md          # Bug report issue template
│   │   ├── feature_request.md     # Feature request issue template
│   │   └── config.yml             # Issue template configuration
│   └── PULL_REQUEST_TEMPLATE.md   # Pull request guidelines
├── quantum_ai_engine/
│   ├── __init__.py                # Package initialization
│   ├── quantum_math.py            # Linear algebra, gates, and state vectors
│   ├── vqc_classifier.py          # Variational Quantum Classifier & Parameter Shift
│   ├── quantum_walk.py            # Continuous-Time Quantum Walk graph solver
│   ├── qgan_synthesizer.py        # Quantum GAN polymorphic signature generator
│   ├── qrl_defense.py             # Quantum Reinforcement Learning firewall agent
│   ├── qnlp_intel.py              # DisCoCat Quantum NLP threat intelligence
│   └── runner.py                  # CLI & JSON test/execution harness
├── src/
│   ├── App.tsx                    # Main UI, Attack Graph, Gauges, Traffic Alert
│   ├── ThreatDensityHeatmap.tsx   # Heatmap with 60s Threat Velocity line chart
│   ├── QuantumAIPythonWorkspace.tsx # Quantum AI Python workspace & source viewer
│   ├── AvantGardeLabTools.tsx     # Specialized cyber defense labs
│   ├── data.ts                    # Defense modules and initial telemetry
│   ├── types.ts                   # TypeScript interfaces and data models
│   ├── index.css                  # Global Tailwind CSS directives
│   └── main.tsx                   # React root mount
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules for Node, Python, IDEs
├── server.ts                      # Hardened Express backend & API proxy
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript compiler configuration
├── vite.config.ts                 # Vite bundler configuration
├── CITATION.cff                   # Research and academic citation metadata
├── CODE_OF_CONDUCT.md             # Contributor Covenant Code of Conduct
├── CONTRIBUTING.md                # Contribution guidelines and standards
├── LICENSE                        # MIT License
├── README.md                      # Platform documentation
└── SECURITY.md                    # Coordinated disclosure and security policy
```

---

## Quick Start & Installation

### Prerequisites
* **Node.js**: v18.0.0 or later (LTS recommended)
* **npm**: v9.0.0 or later
* **Python**: v3.10.0 or later (standard library only)

### 1. Clone the Repository
```bash
git clone https://github.com/quantum-sentinel-ai/qsai.git
cd qsai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```
*(Optional: Add your `GEMINI_API_KEY` in `.env` if using the AI Threat Copilot feature).*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Execution
```bash
# Build Vite client and bundle server
npm run build

# Start production server
npm start
```

---

## Running the Quantum AI Python Engine

The Quantum AI engine can be executed directly via Python CLI, as a standalone module, or through the web dashboard:

### Run Full Regression Test Suite
```bash
python3 quantum_ai_engine/runner.py --test
```
*Output:*
```json
{
  "status": "ALL_TESTS_PASSED",
  "modules_tested": 6,
  "test_results": {
    "quantum_register_ghz_state": "PASSED",
    "vqc_classifier": "PASSED",
    "quantum_walk": "PASSED",
    "qgan_synthesizer": "PASSED",
    "qrl_defense": "PASSED",
    "qnlp_threat_intel": "PASSED"
  },
  "duration_ms": 11.94
}
```

### Run Individual Modules via CLI
```bash
# Variational Quantum Classifier (VQC)
python3 quantum_ai_engine/runner.py --module vqc

# Continuous-Time Quantum Walk on Attack Graph
python3 quantum_ai_engine/runner.py --module quantum_walk

# Quantum Generative Adversarial Network (QGAN)
python3 quantum_ai_engine/runner.py --module qgan

# Quantum Reinforcement Learning (QRL)
python3 quantum_ai_engine/runner.py --module qrl

# Quantum NLP Threat Intelligence Parser
python3 quantum_ai_engine/runner.py --module qnlp
```

---

## REST API Reference

| Endpoint | Method | Description | Rate Limit |
| -------- | ------ | ----------- | ---------- |
| `/api/health` | `GET` | System health check and uptime | 100/min |
| `/api/modules/:id/simulate` | `POST` | Execute simulation for defense module | 60/min |
| `/api/quantum-ai/modules` | `GET` | List available Python quantum algorithms | 60/min |
| `/api/quantum-ai/run` | `POST` | Execute Python quantum module with JSON input | 30/min |
| `/api/quantum-ai/source/:id` | `GET` | Retrieve sanitized Python source code | 60/min |
| `/api/hardening/audit` | `GET` | Return live backend security audit status | 60/min |
| `/api/blockchain/anchor` | `POST` | Anchor threat report hash into Chronos blockchain | 30/min |
| `/api/gemini/chat` | `POST` | Query Gemini AI Threat Copilot | 15/min |

---

## Contributing

We welcome contributions from the global cybersecurity and quantum computing community! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines, branch conventions, and commit standards.

---

## Security

Please see [SECURITY.md](./SECURITY.md) for our coordinated vulnerability disclosure policy and security contact information.

---

## Citation

If you use Quantum Sentinel AI in your academic research or cybersecurity publications, please cite it using [CITATION.cff](./CITATION.cff):

```bibtex
@software{quantum_sentinel_ai_2026,
  author = {Chronos Defense Team},
  title = {Quantum Sentinel AI (QSAI): The Chronos Cyber Defense Platform},
  year = {2026},
  url = {https://github.com/quantum-sentinel-ai/qsai}
}
```

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.
