#!/usr/bin/env python3
"""
Quantum AI Unified Engine Runner - Built from scratch in pure Python 3.
Provides high-performance, hardened execution of Quantum AI algorithms
with input sanitization, strict boundary checking, and JSON output formatting.
"""

import sys
import os
import json
import time
import argparse
from typing import Dict, Any

# Ensure project root directory is in sys.path for direct script execution
_root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _root_dir not in sys.path:
    sys.path.insert(0, _root_dir)

from quantum_ai_engine.quantum_math import QuantumRegister
from quantum_ai_engine.vqc_classifier import VariationalQuantumClassifier
from quantum_ai_engine.quantum_walk import ContinuousTimeQuantumWalk
from quantum_ai_engine.qgan_synthesizer import QuantumGenerativeAdversarialNetwork
from quantum_ai_engine.qrl_defense import QuantumRLDefenseAgent
from quantum_ai_engine.qnlp_intel import QuantumNLPThreatParser

def run_vqc(params: Dict[str, Any]) -> Dict[str, Any]:
    """Execute Variational Quantum Classifier module."""
    num_qubits = int(params.get("num_qubits", 4))
    num_qubits = max(2, min(8, num_qubits)) # Guarded bounds
    depth = int(params.get("depth", 2))
    depth = max(1, min(4, depth))
    
    # Feature vector representing telemetry: [risk_density, lateral_flux, port_entropy, tls_deviation]
    features = params.get("features", [0.75, 0.42, 0.88, 0.65])
    if not isinstance(features, list) or len(features) == 0:
        features = [0.75, 0.42, 0.88, 0.65]
    features = [float(f) for f in features][:8]

    vqc = VariationalQuantumClassifier(num_qubits=num_qubits, depth=depth, learning_rate=0.15)
    
    # Run a quick training cycle if requested
    training_steps = int(params.get("train_steps", 3))
    training_steps = max(0, min(10, training_steps))
    dataset = [
        ([0.1, 0.2, 0.15, 0.1], 0.0), # Nominal
        ([0.85, 0.9, 0.78, 0.95], 1.0), # Critical Anomaly
        ([0.3, 0.25, 0.4, 0.35], 0.0), # Nominal
        ([0.7, 0.8, 0.85, 0.75], 1.0) # Exploit
    ]

    for _ in range(training_steps):
        vqc.train_step(dataset)

    inspection = vqc.inspect_quantum_state(features)
    inspection["module"] = "Variational Quantum Circuit (VQC) Anomaly Classifier"
    inspection["loss_convergence"] = vqc.loss_history
    return inspection

def run_quantum_walk(params: Dict[str, Any]) -> Dict[str, Any]:
    """Execute Continuous-Time Quantum Walk Attack Path Optimizer."""
    node_names = params.get("node_names", [
        "DMZ-Edge-Gateway",
        "PQC-Proxy-Router",
        "Core-Backbone-Switch",
        "Identity-Auth-Cluster",
        "Chronos-Ledger-Node",
        "Internal-Database-Vault"
    ])
    if not isinstance(node_names, list) or len(node_names) < 3:
        node_names = ["DMZ-Edge-Gateway", "PQC-Proxy-Router", "Core-Backbone-Switch", "Chronos-Ledger-Node"]
    node_names = node_names[:8] # Bounds limit

    num_nodes = len(node_names)
    # Default network connectivity mesh
    adjacency = [
        [0, 1, 1, 0, 0, 0],
        [1, 0, 1, 1, 0, 0],
        [1, 1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1, 1],
        [0, 0, 1, 1, 0, 1],
        [0, 0, 0, 1, 1, 0]
    ]
    # Resize or adapt to node_names
    current_adj = [[0] * num_nodes for _ in range(num_nodes)]
    for i in range(num_nodes):
        for j in range(num_nodes):
            if i < len(adjacency) and j < len(adjacency[0]):
                current_adj[i][j] = adjacency[i][j]
            elif abs(i - j) == 1:
                current_adj[i][j] = 1

    evolution_time = float(params.get("evolution_time", 2.8))
    evolution_time = max(0.5, min(10.0, evolution_time))

    qw = ContinuousTimeQuantumWalk(node_names, current_adj)
    result = qw.find_critical_attack_pivots(ingress_node=0, time_steps=8, max_time=evolution_time)
    result["module"] = "Continuous-Time Quantum Walk (CTQW) Topology Optimizer"
    return result

def run_qgan(params: Dict[str, Any]) -> Dict[str, Any]:
    """Execute Quantum Generative Adversarial Network payload synthesizer."""
    num_qubits = int(params.get("num_qubits", 3))
    num_qubits = max(2, min(5, num_qubits))
    epochs = int(params.get("epochs", 4))
    epochs = max(1, min(10, epochs))

    qgan = QuantumGenerativeAdversarialNetwork(num_qubits=num_qubits)
    baseline_dist = [0.125] * (1 << num_qubits)

    training_metrics = []
    for _ in range(epochs):
        metric = qgan.train_epoch(baseline_dist)
        training_metrics.append(metric)

    synthesized = qgan.synthesize_evasion_variants()
    synthesized["module"] = "Quantum Generative Adversarial Network (QGAN) Shellcode Mutator"
    synthesized["training_epochs_run"] = epochs
    synthesized["final_training_metrics"] = training_metrics[-1]
    return synthesized

def run_qrl(params: Dict[str, Any]) -> Dict[str, Any]:
    """Execute Quantum Reinforcement Learning defense policy agent."""
    severity = str(params.get("severity", "critical")).lower()
    if severity not in ["critical", "warning", "info"]:
        severity = "critical"

    qrl = QuantumRLDefenseAgent(num_qubits=3)
    result = qrl.run_simulation_episode(attack_severity=severity)
    result["module"] = "Quantum Reinforcement Learning (QRL) Adaptive Firewall Agent"
    return result

def run_qnlp(params: Dict[str, Any]) -> Dict[str, Any]:
    """Execute Quantum NLP threat intelligence analyzer."""
    query = str(params.get("query", "adversary exploits zero_day kernel_socket bypasses"))
    qnlp = QuantumNLPThreatParser(num_qubits=4)
    result = qnlp.analyze_threat_intel(query)
    result["module"] = "Quantum Natural Language Processing (QNLP) Threat Intelligence Parser"
    return result

def run_self_tests() -> Dict[str, Any]:
    """Run comprehensive automated regression self-test over all modules."""
    test_results = {}
    
    # Test 1: Quantum Register
    reg = QuantumRegister(3)
    reg.apply_h(0)
    reg.apply_cnot(0, 1)
    reg.apply_cnot(1, 2) # GHZ state (|000> + |111>)/sqrt(2)
    probs = reg.get_probabilities()
    assert abs(probs[0] - 0.5) < 1e-4 and abs(probs[7] - 0.5) < 1e-4, "GHZ state fidelity error"
    test_results["quantum_register_ghz_state"] = "PASSED"

    # Test 2: VQC Classifier
    vqc_res = run_vqc({"num_qubits": 3, "depth": 1, "train_steps": 1})
    assert "anomaly_probability" in vqc_res, "VQC missing anomaly_probability"
    test_results["vqc_classifier"] = "PASSED"

    # Test 3: Quantum Walk
    qw_res = run_quantum_walk({"evolution_time": 1.5})
    assert "primary_critical_pivot" in qw_res, "Quantum Walk missing pivot"
    test_results["quantum_walk"] = "PASSED"

    # Test 4: QGAN
    qgan_res = run_qgan({"num_qubits": 2, "epochs": 2})
    assert "evasion_resilience_rating" in qgan_res, "QGAN missing rating"
    test_results["qgan_synthesizer"] = "PASSED"

    # Test 5: QRL Defense
    qrl_res = run_qrl({"severity": "critical"})
    assert "selected_quantum_action" in qrl_res, "QRL missing selected action"
    test_results["qrl_defense"] = "PASSED"

    # Test 6: QNLP Threat Intel
    qnlp_res = run_qnlp({"query": "malware exfiltrates key"})
    assert "quantum_semantic_fidelity" in qnlp_res, "QNLP missing fidelity"
    test_results["qnlp_threat_intel"] = "PASSED"

    return {
        "status": "ALL_TESTS_PASSED",
        "modules_tested": len(test_results),
        "test_results": test_results
    }

def main():
    parser = argparse.ArgumentParser(description="Quantum AI Engine Runner")
    parser.add_argument("--module", type=str, choices=["vqc", "quantum_walk", "qgan", "qrl", "qnlp"], help="Quantum module to execute")
    parser.add_argument("--input", type=str, default="{}", help="JSON input arguments")
    parser.add_argument("--test", action="store_true", help="Run automated self-tests")

    args = parser.parse_args()

    start_time = time.time()

    if args.test:
        test_out = run_self_tests()
        duration_ms = round((time.time() - start_time) * 1000, 2)
        test_out["duration_ms"] = duration_ms
        print(json.dumps(test_out, indent=2))
        return

    if not args.module:
        print(json.dumps({"error": "No module specified. Use --module or --test."}))
        sys.exit(1)

    try:
        input_params = json.loads(args.input)
    except Exception as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}))
        sys.exit(1)

    try:
        if args.module == "vqc":
            res = run_vqc(input_params)
        elif args.module == "quantum_walk":
            res = run_quantum_walk(input_params)
        elif args.module == "qgan":
            res = run_qgan(input_params)
        elif args.module == "qrl":
            res = run_qrl(input_params)
        elif args.module == "qnlp":
            res = run_qnlp(input_params)
        else:
            res = {"error": f"Unknown module {args.module}"}

        duration_ms = round((time.time() - start_time) * 1000, 2)
        res["execution_duration_ms"] = duration_ms
        res["engine"] = "Quantum AI Python Core (Pure Python 3, Built from Scratch)"
        print(json.dumps(res, indent=2))

    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "module": args.module,
            "status": "EXECUTION_FAILED"
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
