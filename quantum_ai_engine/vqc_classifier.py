"""
Variational Quantum Classifier (VQC) - Built from scratch in pure Python 3.
Implements Parameterized Quantum Circuits (PQC), feature encoding,
and the exact Parameter-Shift Rule for quantum gradient descent optimization.
"""

import math
import random
from typing import List, Dict, Any, Tuple
from quantum_ai_engine.quantum_math import QuantumRegister

class VariationalQuantumClassifier:
    """
    N-qubit Variational Quantum Circuit (VQC) classifier for cyber threat anomaly detection.
    Encodes continuous telemetry vectors into quantum Hilbert space, applies a layered
    entangling ansatz, and computes analytic gradients via the Parameter-Shift Rule.
    """
    def __init__(self, num_qubits: int = 4, depth: int = 2, learning_rate: float = 0.15):
        self.num_qubits = num_qubits
        self.depth = depth
        self.learning_rate = learning_rate

        # Number of parameters: For each layer, 2 rotation angles per qubit (RY and RZ)
        self.num_params = self.depth * self.num_qubits * 2
        # Initialize parameters with small random angles [-pi/4, pi/4]
        self.params: List[float] = [random.uniform(-math.pi / 4, math.pi / 4) for _ in range(self.num_params)]
        self.loss_history: List[float] = []

    def _encode_features(self, reg: QuantumRegister, features: List[float]):
        """
        Quantum angle encoding: Map normalized telemetry features [0, 1]
        to qubit rotation angles [0, pi] using Hadamard and R_Y gates.
        """
        for i in range(self.num_qubits):
            reg.apply_h(i)
            feat = features[i % len(features)]
            angle = feat * math.pi
            reg.apply_ry(i, angle)

    def _apply_ansatz(self, reg: QuantumRegister, params: List[float]):
        """
        Apply layered Parameterized Quantum Circuit (PQC) ansatz:
        - Parameterized RY and RZ rotations on each qubit.
        - Circular CNOT entangling ladder to generate quantum superposition and entanglement.
        """
        param_idx = 0
        for d in range(self.depth):
            # Parameterized Single-Qubit Rotations
            for q in range(self.num_qubits):
                theta_y = params[param_idx]
                param_idx += 1
                theta_z = params[param_idx]
                param_idx += 1
                reg.apply_ry(q, theta_y)
                reg.apply_rz(q, theta_z)

            # Entangling Ring / Ladder via CNOTs
            for q in range(self.num_qubits):
                target = (q + 1) % self.num_qubits
                reg.apply_cnot(q, target)

    def forward(self, features: List[float], params: List[float] = None) -> float:
        """
        Execute forward quantum circuit pass.
        Returns expectation value <Z_0> in range [-1.0, 1.0].
        """
        if params is None:
            params = self.params

        reg = QuantumRegister(self.num_qubits)
        self._encode_features(reg, features)
        self._apply_ansatz(reg, params)

        # Measure expectation value of Pauli-Z on readout qubit 0
        exp_z = reg.measure_expectation_z(0)
        return exp_z

    def predict_probability(self, features: List[float]) -> float:
        """
        Convert quantum expectation value <Z> in [-1, 1] to anomaly probability in [0, 1].
        Using sigmoid-like affine transformation: P(anomaly) = (1 - <Z>) / 2.
        <Z> = -1 corresponds to 100% anomaly, <Z> = +1 corresponds to 0% anomaly (nominal).
        """
        exp_z = self.forward(features)
        prob = (1.0 - exp_z) / 2.0
        return max(0.0, min(1.0, prob))

    def compute_gradient_parameter_shift(self, features: List[float], target_y: float) -> List[float]:
        """
        Compute EXACT analytic quantum gradients using the Parameter-Shift Rule:
        d<Z>/d theta_i = [ <Z>(theta_i + pi/2) - <Z>(theta_i - pi/2) ] / 2
        """
        shift = math.pi / 2.0
        gradients = [0.0] * self.num_params
        current_pred = self.predict_probability(features)
        # Binary cross-entropy or mean squared error loss gradient: dL/dPred = 2 * (pred - target)
        loss_deriv = 2.0 * (current_pred - target_y)

        for i in range(self.num_params):
            # Forward shift
            params_plus = list(self.params)
            params_plus[i] += shift
            exp_plus = self.forward(features, params_plus)

            # Backward shift
            params_minus = list(self.params)
            params_minus[i] -= shift
            exp_minus = self.forward(features, params_minus)

            # Parameter-shift derivative of <Z>
            d_exp_d_theta = (exp_plus - exp_minus) / 2.0
            # d(prob)/d(theta) = -0.5 * d<Z>/d(theta)
            d_prob_d_theta = -0.5 * d_exp_d_theta

            gradients[i] = loss_deriv * d_prob_d_theta

        return gradients

    def train_step(self, dataset: List[Tuple[List[float], float]]) -> float:
        """Execute one gradient descent optimization epoch over the dataset."""
        batch_grads = [0.0] * self.num_params
        total_loss = 0.0

        for features, target in dataset:
            pred = self.predict_probability(features)
            loss = (pred - target) ** 2
            total_loss += loss

            grads = self.compute_gradient_parameter_shift(features, target)
            for i in range(self.num_params):
                batch_grads[i] += grads[i] / len(dataset)

        # Update variational angles via gradient descent
        for i in range(self.num_params):
            self.params[i] -= self.learning_rate * batch_grads[i]

        avg_loss = total_loss / len(dataset)
        self.loss_history.append(round(avg_loss, 5))
        return avg_loss

    def inspect_quantum_state(self, features: List[float]) -> Dict[str, Any]:
        """Inspect detailed quantum telemetry: Bloch vectors, probabilities, and entropy."""
        reg = QuantumRegister(self.num_qubits)
        self._encode_features(reg, features)
        self._apply_ansatz(reg, self.params)

        bloch_vectors = [reg.get_bloch_coordinates(q) for q in range(self.num_qubits)]
        probs = reg.get_probabilities()
        entropy = reg.von_neumann_entropy()
        exp_z_all = reg.measure_all_expectation_z()

        # Extract top 8 basis states
        top_basis = sorted(
            [(f"|{bin(i)[2:].zfill(self.num_qubits)}>", round(probs[i], 4)) for i in range(len(probs))],
            key=lambda x: x[1],
            reverse=True
        )[:8]

        pred_anomaly = self.predict_probability(features)

        return {
            "num_qubits": self.num_qubits,
            "circuit_depth": self.depth,
            "num_parameters": self.num_params,
            "anomaly_probability": round(pred_anomaly, 4),
            "threat_classification": "CRITICAL_ANOMALY" if pred_anomaly >= 0.70 else "ELEVATED_RISK" if pred_anomaly >= 0.40 else "NOMINAL",
            "readout_expectation_z": round(reg.measure_expectation_z(0), 4),
            "qubit_bloch_vectors": bloch_vectors,
            "von_neumann_entropy": entropy,
            "top_basis_amplitudes": top_basis,
            "all_qubits_expectation_z": [round(z, 4) for z in exp_z_all]
        }
