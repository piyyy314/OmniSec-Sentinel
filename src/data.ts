import { ModuleDef } from "./types";

export const ALL_MODULES: ModuleDef[] = [
  {
    id: 1,
    name: "Quantum Vulnerability Predictor",
    category: "Quantum",
    description: "8-qubit Variational Quantum Circuit (VQC) ensemble with classical ML to predict system vulnerability thresholds.",
    technicalDetails: "Simulates parameter updates on an 8-qubit ansatz state to find energy minima representing high risk configurations.",
    defaultStatus: "Active"
  },
  {
    id: 2,
    name: "Quantum Signal Processor",
    category: "Quantum",
    description: "Quantum Fourier Transform (QFT)-based C2 beacon detection in extreme signal-to-noise ratios.",
    technicalDetails: "Applies phase estimation techniques to resolve periodic sub-nanosecond beacons hidden in background telemetry noise.",
    defaultStatus: "Active"
  },
  {
    id: 3,
    name: "Quantum Crypto Auditor",
    category: "Quantum",
    description: "Post-quantum TLS & classical cryptographic algorithm audit for transition readiness.",
    technicalDetails: "Scans active protocol handshakes and certificate chains against NIST standard PQ algorithms (Kyber/Dilithium).",
    defaultStatus: "Active"
  },
  {
    id: 4,
    name: "Quantum Attack Path Optimizer",
    category: "Quantum",
    description: "Quantum annealing (D-Wave model) and NetworkX grid analysis to locate optimal defensive kill-chain pivots.",
    technicalDetails: "Maps critical infrastructure as an Ising Hamiltonian formulation to find the global minimum energy state of defenses.",
    defaultStatus: "Active"
  },
  {
    id: 5,
    name: "Quantum Red Team",
    category: "Quantum",
    description: "Autonomous exploit agent powered by simulated quantum search algorithms.",
    technicalDetails: "Accelerates directory traversal and parameter brute-force steps using a simulated Grover's search Oracle.",
    defaultStatus: "Active"
  },
  {
    id: 6,
    name: "GNN Node Criticality",
    category: "Neural & ML",
    description: "Graph Neural Network scoring system to identify highly critical host node pivot points.",
    technicalDetails: "Models the network topology as a graph, running message-passing layers to score host vulnerability influence.",
    defaultStatus: "Active"
  },
  {
    id: 7,
    name: "Zero-Day Predictor",
    category: "Neural & ML",
    description: "Transformer-based sequence-to-sequence CVE forecasting model targeting unpatched service dependencies.",
    technicalDetails: "Analyzes upstream commits, developer activity, and historic disclosures using an attention-based timeline model.",
    defaultStatus: "Active"
  },
  {
    id: 8,
    name: "Autonomous RL Fuzzer",
    category: "Neural & ML",
    description: "DQN-driven API vulnerability discovery tool that self-optimizes payload payloads based on HTTP responses.",
    technicalDetails: "Updates state space values from response statuses to find input combinations that bypass sanitizers.",
    defaultStatus: "Active"
  },
  {
    id: 9,
    name: "Blockchain Anchor",
    category: "Integrity & Compliance",
    description: "Immutable on-chain security report verification system with SHA-256 block creation.",
    technicalDetails: "Anchors executive snapshots and vulnerability lists directly onto a client-side simulated blockchain ledger.",
    defaultStatus: "Active"
  },
  {
    id: 10,
    name: "Defensive Port Scanner",
    category: "Active Defense & Deception",
    description: "High-speed asynchronous network service and open port discovery engine.",
    technicalDetails: "Performs non-blocking TCP SYN scans and banner grabbing over target IP subnets with throttling controls.",
    defaultStatus: "Active"
  },
  {
    id: 11,
    name: "Heuristic IDS",
    category: "Monitoring & Auditing",
    description: "Signature-based and pattern-matching threat detection engine.",
    technicalDetails: "Evaluates raw packet buffers and payload logs against YARA-style signatures and packet sequence regex arrays.",
    defaultStatus: "Active"
  },
  {
    id: 12,
    name: "Telemetry Auditor",
    category: "Monitoring & Auditing",
    description: "Hardware side-channel anomaly detection through execution path analysis.",
    technicalDetails: "Monitors CPU cache misses, power profiles, and speculative execution logs for traces of side-channel attacks.",
    defaultStatus: "Active"
  },
  {
    id: 13,
    name: "File Integrity Monitor",
    category: "Integrity & Compliance",
    description: "SHA-256 real-time file baseline differential analysis tool.",
    technicalDetails: "Constructs a cryptographic hash baseline of critical system files and alerts on unauthorized modification.",
    defaultStatus: "Active"
  },
  {
    id: 14,
    name: "ML Anomaly Detector",
    category: "Neural & ML",
    description: "Isolation Forest and One-Class SVM outlier detection for system behaviors.",
    technicalDetails: "Ingests multivariable event logs (CPU, Memory, Network spikes) to compute anomaly percentile indexes.",
    defaultStatus: "Active"
  },
  {
    id: 15,
    name: "Quantum-Safe Checker",
    category: "Quantum",
    description: "Cryptographic migration readiness tool identifying deprecated pre-quantum algorithms.",
    technicalDetails: "Identifies hardcoded DES, RSA-1024, or SHA-1 hashes inside dependencies and scores their vulnerability weights.",
    defaultStatus: "Active"
  },
  {
    id: 16,
    name: "Purple Team Coordinator",
    category: "Integrity & Compliance",
    description: "Correlates Red Team exploit paths with Blue Team alerts to generate actionable security blueprints.",
    technicalDetails: "Cross-checks active attack vectors against local firewall/IDS rulesets to isolate gaps in structural coverage.",
    defaultStatus: "Active"
  },
  {
    id: 17,
    name: "Self-Evolving Neural Architecture",
    category: "Neural & ML",
    description: "AutoML pipeline that modifies and tunes its own hyperparameters and structures dynamically.",
    technicalDetails: "Runs genetic mutations over model layer shapes and neural activation parameters to constantly improve detection rates.",
    defaultStatus: "Active"
  },
  {
    id: 18,
    name: "Deception Technology",
    category: "Active Defense & Deception",
    description: "Simulated honeypots and breadcrumb honeytokens to snare and track attackers.",
    technicalDetails: "Spins up interactive virtual instances of SSH, FTP, or databases loaded with highly attractive fake databases.",
    defaultStatus: "Active"
  },
  {
    id: 19,
    name: "Supply Chain Auditor",
    category: "Integrity & Compliance",
    description: "Software Bill of Materials (SBOM) scanner with dynamic CVE verification.",
    technicalDetails: "Inspects dependency locks, recursive packages, and static binaries, verifying components against live databases.",
    defaultStatus: "Active"
  },
  {
    id: 20,
    name: "QGAN Zero-Day Generator",
    category: "Quantum",
    description: "Quantum Generative Adversarial Network generating simulated mutation payloads.",
    technicalDetails: "Simulates a quantum generator competing with a classical discriminator to craft highly bypass-resilient shellcode variants.",
    defaultStatus: "Active"
  },
  {
    id: 21,
    name: "QNLP Dark Web Monitor",
    category: "Quantum",
    description: "Quantum Natural Language Processing engine classifying cyber threat actor chatter.",
    technicalDetails: "Maps linguistic embeddings directly to Hilbert space vectors, detecting zero-day coordinates from unstructured text.",
    defaultStatus: "Active"
  },
  {
    id: 22,
    name: "QRL Adaptive Defense",
    category: "Quantum",
    description: "Quantum-enhanced Reinforcement Learning agent that dynamically reconfigures defensive structures.",
    technicalDetails: "Simulates ultra-fast parallel training cycles to shift firewall, load balancer, and honeypot topologies dynamically.",
    defaultStatus: "Active"
  },
  {
    id: 23,
    name: "QBM Anomaly Detector",
    category: "Quantum",
    description: "Quantum Boltzmann Machine resolving sub-atomic network traffic anomalies.",
    technicalDetails: "Models thermal packet distribution states to detect micro-jitter and sub-atomic timings linked to advanced covert channels.",
    defaultStatus: "Active"
  },
  {
    id: 24,
    name: "LLM Query Interface",
    category: "Neural & ML",
    description: "Gemini-powered local assistant to interactively query and analyze Sentinel findings.",
    technicalDetails: "Leverages Gemini 3.5 Flash to summarize logs, answer architectural questions, and suggest targeted remediation scripts.",
    defaultStatus: "Active"
  },
  {
    id: 25,
    name: "Executive Report Generator",
    category: "Integrity & Compliance",
    description: "Generates interactive D3/Recharts-powered security overviews verified by our blockchain anchor.",
    technicalDetails: "Builds a clean, downloadable and auditable cryptographic snapshot summarizing defense readiness metrics.",
    defaultStatus: "Active"
  },
  {
    id: 26,
    name: "Continuous Monitoring",
    category: "Monitoring & Auditing",
    description: "Live operational metrics pipeline mimicking Prometheus and OpenTelemetry structures.",
    technicalDetails: "Compiles system CPU, memory usage, transaction rates, and packet levels into high-frequency time-series feeds.",
    defaultStatus: "Active"
  },
  {
    id: 27,
    name: "Cloud Audit (AWS/Azure/GCP)",
    category: "Monitoring & Auditing",
    description: "Simulated multi-cloud infrastructure auditing and security posture analysis.",
    technicalDetails: "Evaluates S3 buckets, IAM roles, metadata interfaces, and security groups against CIS benchmarks.",
    defaultStatus: "Active"
  },
  {
    id: 28,
    name: "Neuromorphic Spiking Immune Core",
    category: "Autonomous & Bio-Digital",
    description: "Bio-inspired Spiking Neural Network (LIF neurons) synthesizing digital antigen-antibodies to neutralize malicious bytecode at 100 Gbps line-rate.",
    technicalDetails: "Simulates leaky integrate-and-fire spike train dynamics and clonal selection algorithms to neutralize polymorphic payloads with zero CPU interrupt latency.",
    defaultStatus: "Active"
  },
  {
    id: 29,
    name: "Quantum Entanglement Honeynet",
    category: "Quantum",
    description: "Multi-cloud Bell-state entangled decoy clusters where adversary memory probes trigger instantaneous wave function collapse and key entrapment.",
    technicalDetails: "Maintains EPR-entangled state vectors between edge decoys. Adversarial observation triggers quantum state collapse and zero-entropy key entrapment.",
    defaultStatus: "Active"
  },
  {
    id: 30,
    name: "Causal Counterfactual Interrogator",
    category: "Neural & ML",
    description: "Judea Pearl structural causal model (SCM) executing do-calculus interventions to mathematically prove counterfactual attack prevention.",
    technicalDetails: "Maps threat telemetry into directed acyclic causal graphs (DAGs), evaluating do(X) operators to establish invariant defensive countermeasures.",
    defaultStatus: "Active"
  },
  {
    id: 31,
    name: "Polymorphic Binary Transmuter",
    category: "Active Defense & Deception",
    description: "In-memory continuous LLVM AST micro-rewriter modifying executable opcodes every 50ms without terminating running process sockets.",
    technicalDetails: "Dynamic register re-allocation and dead-code permutation eliminates ROP gadgets and static buffer-overflow attack surfaces in active memory.",
    defaultStatus: "Active"
  },
  {
    id: 32,
    name: "Sub-Atomic Thermal Ghost Cloak",
    category: "Monitoring & Auditing",
    description: "Thermodynamic Casimir-effect noise injector scrambling microarchitectural cache timing channels and side-channel leakage.",
    technicalDetails: "Injects calibrated thermal entropy and frequency jitter into L1/L2 cache prefetchers to defeat Spectre, Meltdown, and Rowhammer timing probes.",
    defaultStatus: "Active"
  },
  {
    id: 33,
    name: "zk-SNARK Proof-of-Exploit Oracle",
    category: "Integrity & Compliance",
    description: "Zero-knowledge homomorphic cryptographic verifier proving vulnerability exploitability without executing or disclosing exploit payloads.",
    technicalDetails: "Generates Groth16 zk-SNARK mathematical proofs validating exploit paths against compiled bytecode, anchored directly to our blockchain.",
    defaultStatus: "Active"
  },
  {
    id: 34,
    name: "DNA Air-Gap Steganography Auditor",
    category: "Autonomous & Bio-Digital",
    description: "Sub-perceptual acoustic, optical LED micro-flicker, and biochemical covert air-gap exfiltration frequency scanner.",
    technicalDetails: "Analyzes physical telemetry for high-frequency acoustic modulation (>20kHz) and optical LED PWM variations used to bypass air-gapped critical infrastructure.",
    defaultStatus: "Active"
  },
  {
    id: 35,
    name: "Autonomous SwarmMesh Defense Grid",
    category: "Autonomous & Bio-Digital",
    description: "Decentralized emergent peer-to-peer micro-agent mesh using ant-colony stigmergy to dynamically encircle and smother distributed cyber assaults.",
    technicalDetails: "Deploys eBPF kernel agents that autonomously synthesize distributed firewall rings and isolate rogue routing prefixes across cloud meshes.",
    defaultStatus: "Active"
  }
];
