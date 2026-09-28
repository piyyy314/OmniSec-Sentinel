"""
Quantum Math Core - Built from scratch in pure Python 3.
Provides complex linear algebra, tensor products, quantum gates,
state vector simulation, and expectation value computation without third-party dependencies.
"""

import math
import cmath
import random
from typing import List, Tuple, Dict, Any, Union

# Complex scalar type alias
ComplexNum = complex
Matrix = List[List[complex]]
Vector = List[complex]

def zeros_matrix(rows: int, cols: int) -> Matrix:
    """Create a matrix filled with complex zeros."""
    return [[complex(0.0, 0.0) for _ in range(cols)] for _ in range(rows)]

def identity_matrix(n: int) -> Matrix:
    """Create an n x n identity matrix."""
    mat = zeros_matrix(n, n)
    for i in range(n):
        mat[i][i] = complex(1.0, 0.0)
    return mat

def matrix_multiply(a: Matrix, b: Matrix) -> Matrix:
    """Multiply two complex matrices a and b."""
    rows_a = len(a)
    cols_a = len(a[0])
    rows_b = len(b)
    cols_b = len(b[0])
    if cols_a != rows_b:
        raise ValueError(f"Matrix dimension mismatch: ({rows_a}x{cols_a}) and ({rows_b}x{cols_b})")
    
    result = zeros_matrix(rows_a, cols_b)
    for i in range(rows_a):
        for k in range(cols_a):
            if abs(a[i][k]) < 1e-15:
                continue
            for j in range(cols_b):
                result[i][j] += a[i][k] * b[k][j]
    return result

def matrix_vector_multiply(m: Matrix, v: Vector) -> Vector:
    """Multiply complex matrix m by complex vector v."""
    rows = len(m)
    cols = len(m[0])
    if cols != len(v):
        raise ValueError(f"Matrix-vector dimension mismatch: matrix cols {cols} != vector len {len(v)}")
    
    result = [complex(0.0, 0.0) for _ in range(rows)]
    for i in range(rows):
        s = complex(0.0, 0.0)
        for j in range(cols):
            s += m[i][j] * v[j]
        result[i] = s
    return result

def kronecker_product(a: Matrix, b: Matrix) -> Matrix:
    """Compute the Kronecker (tensor) product A (x) B."""
    rows_a = len(a)
    cols_a = len(a[0])
    rows_b = len(b)
    cols_b = len(b[0])
    
    result = zeros_matrix(rows_a * rows_b, cols_a * cols_b)
    for i in range(rows_a):
        for j in range(cols_a):
            for k in range(rows_b):
                for l in range(cols_b):
                    result[i * rows_b + k][j * cols_b + l] = a[i][j] * b[k][l]
    return result

def conjugate_transpose(m: Matrix) -> Matrix:
    """Return the Hermitian conjugate (conjugate transpose) of a matrix."""
    rows = len(m)
    cols = len(m[0])
    result = zeros_matrix(cols, rows)
    for i in range(rows):
        for j in range(cols):
            result[j][i] = m[i][j].conjugate()
    return result

def vector_norm(v: Vector) -> float:
    """Calculate Euclidean L2 norm of a complex state vector."""
    return math.sqrt(sum(abs(z) ** 2 for z in v))

def normalize_vector(v: Vector) -> Vector:
    """Normalize a state vector so sum(|c_i|^2) == 1."""
    norm = vector_norm(v)
    if norm < 1e-12:
        raise ValueError("Cannot normalize a near-zero vector")
    return [z / norm for z in v]

def inner_product(v1: Vector, v2: Vector) -> complex:
    """Compute bra-ket inner product <v1 | v2>."""
    if len(v1) != len(v2):
        raise ValueError("Inner product vector lengths must match")
    return sum(v1[i].conjugate() * v2[i] for i in range(len(v1)))

# --- Standard Single-Qubit Quantum Gates ---
GATE_I: Matrix = [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(1, 0)]
]

GATE_X: Matrix = [
    [complex(0, 0), complex(1, 0)],
    [complex(1, 0), complex(0, 0)]
]

GATE_Y: Matrix = [
    [complex(0, 0), complex(0, -1)],
    [complex(0, 1), complex(0, 0)]
]

GATE_Z: Matrix = [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(-1, 0)]
]

INV_SQRT2 = 1.0 / math.sqrt(2.0)
GATE_H: Matrix = [
    [complex(INV_SQRT2, 0), complex(INV_SQRT2, 0)],
    [complex(INV_SQRT2, 0), complex(-INV_SQRT2, 0)]
]

def gate_rx(theta: float) -> Matrix:
    """Parameterized X-rotation gate: R_X(theta) = cos(theta/2)*I - i*sin(theta/2)*X."""
    c = math.cos(theta / 2.0)
    s = math.sin(theta / 2.0)
    return [
        [complex(c, 0.0), complex(0.0, -s)],
        [complex(0.0, -s), complex(c, 0.0)]
    ]

def gate_ry(theta: float) -> Matrix:
    """Parameterized Y-rotation gate: R_Y(theta) = cos(theta/2)*I - sin(theta/2)*Y."""
    c = math.cos(theta / 2.0)
    s = math.sin(theta / 2.0)
    return [
        [complex(c, 0.0), complex(-s, 0.0)],
        [complex(s, 0.0), complex(c, 0.0)]
    ]

def gate_rz(theta: float) -> Matrix:
    """Parameterized Z-rotation gate: R_Z(theta) = diag(e^(-i*theta/2), e^(i*theta/2))."""
    phase_neg = cmath.exp(complex(0.0, -theta / 2.0))
    phase_pos = cmath.exp(complex(0.0, theta / 2.0))
    return [
        [phase_neg, complex(0.0, 0.0)],
        [complex(0.0, 0.0), phase_pos]
    ]

def gate_phase(phi: float) -> Matrix:
    """Phase shift gate P(phi) = diag(1, e^(i*phi))."""
    return [
        [complex(1.0, 0.0), complex(0.0, 0.0)],
        [complex(0.0, 0.0), cmath.exp(complex(0.0, phi))]
    ]

# --- Multi-Qubit State Simulator ---
class QuantumRegister:
    """
    N-qubit quantum state vector simulator built from first principles.
    Supports single qubit gate applications, multi-qubit CNOT / CZ gates,
    measurements, expectation values, and density matrix state analysis.
    """
    def __init__(self, num_qubits: int):
        if num_qubits < 1 or num_qubits > 12:
            raise ValueError(f"Number of qubits must be between 1 and 12 (got {num_qubits})")
        self.num_qubits = num_qubits
        self.dim = 1 << num_qubits
        # Initialize to state |00...0>
        self.state: Vector = [complex(0.0, 0.0) for _ in range(self.dim)]
        self.state[0] = complex(1.0, 0.0)

    def reset(self):
        """Reset state back to |00...0>."""
        for i in range(self.dim):
            self.state[i] = complex(0.0, 0.0)
        self.state[0] = complex(1.0, 0.0)

    def apply_single_gate(self, target_qubit: int, gate: Matrix):
        """
        Apply a 2x2 unitary gate to target_qubit (0-indexed, 0 = least significant qubit).
        Directly updates state vector using bitwise indexing for optimal O(2^N) speed.
        """
        if target_qubit < 0 or target_qubit >= self.num_qubits:
            raise IndexError(f"Target qubit {target_qubit} out of bounds for {self.num_qubits} qubits")
        
        bit_mask = 1 << target_qubit
        step = 1 << (target_qubit + 1)
        half_step = 1 << target_qubit

        u00, u01 = gate[0][0], gate[0][1]
        u10, u11 = gate[1][0], gate[1][1]

        for i in range(0, self.dim, step):
            for j in range(half_step):
                idx0 = i + j
                idx1 = idx0 + half_step
                a = self.state[idx0]
                b = self.state[idx1]
                self.state[idx0] = u00 * a + u01 * b
                self.state[idx1] = u10 * a + u11 * b

    def apply_h(self, qubit: int):
        self.apply_single_gate(qubit, GATE_H)

    def apply_x(self, qubit: int):
        self.apply_single_gate(qubit, GATE_X)

    def apply_y(self, qubit: int):
        self.apply_single_gate(qubit, GATE_Y)

    def apply_z(self, qubit: int):
        self.apply_single_gate(qubit, GATE_Z)

    def apply_rx(self, qubit: int, theta: float):
        self.apply_single_gate(qubit, gate_rx(theta))

    def apply_ry(self, qubit: int, theta: float):
        self.apply_single_gate(qubit, gate_ry(theta))

    def apply_rz(self, qubit: int, theta: float):
        self.apply_single_gate(qubit, gate_rz(theta))

    def apply_cnot(self, control: int, target: int):
        """Apply Controlled-NOT (CX) gate between control and target qubits."""
        if control == target:
            raise ValueError("Control and target qubits cannot be the same")
        
        control_mask = 1 << control
        target_mask = 1 << target

        for i in range(self.dim):
            # Apply X gate on target only if control bit is 1 and target bit is 0
            if (i & control_mask) and not (i & target_mask):
                flipped_idx = i | target_mask
                # Swap amplitudes between |...0...> and |...1...>
                self.state[i], self.state[flipped_idx] = self.state[flipped_idx], self.state[i]

    def apply_cz(self, control: int, target: int):
        """Apply Controlled-Z gate (inverts phase if both qubits are 1)."""
        mask = (1 << control) | (1 << target)
        for i in range(self.dim):
            if (i & mask) == mask:
                self.state[i] = -self.state[i]

    def get_probabilities(self) -> List[float]:
        """Compute Born rule measurement probabilities P(i) = |c_i|^2."""
        return [abs(c) ** 2 for c in self.state]

    def measure_expectation_z(self, qubit: int) -> float:
        """
        Compute exact expectation value <psi | Z_qubit | psi>.
        Eigenvalues are +1 for |0> and -1 for |1>.
        """
        mask = 1 << qubit
        exp_val = 0.0
        for i in range(self.dim):
            prob = abs(self.state[i]) ** 2
            sign = -1.0 if (i & mask) else 1.0
            exp_val += sign * prob
        return exp_val

    def measure_all_expectation_z(self) -> List[float]:
        """Compute <Z> for all qubits."""
        return [self.measure_expectation_z(q) for q in range(self.num_qubits)]

    def sample_measurement(self, shots: int = 1000) -> Dict[str, int]:
        """Sample discrete projective measurement shots."""
        probs = self.get_probabilities()
        counts: Dict[str, int] = {}
        outcomes = random.choices(range(self.dim), weights=probs, k=shots)
        format_str = f"{{0:0{self.num_qubits}b}}"
        for outcome in outcomes:
            bitstr = format_str.format(outcome)
            counts[bitstr] = counts.get(bitstr, 0) + 1
        return counts

    def get_bloch_coordinates(self, qubit: int) -> Tuple[float, float, float]:
        """Calculate single-qubit reduced density matrix Bloch vector (x, y, z)."""
        # <Z> = Tr(rho * Z)
        z = self.measure_expectation_z(qubit)

        # Clone state to measure X and Y
        saved_state = list(self.state)

        # <X>: Apply H to convert X-basis to Z-basis
        self.apply_h(qubit)
        x = self.measure_expectation_z(qubit)

        # Restore state
        self.state = list(saved_state)

        # <Y>: Apply S^dagger then H
        # S^dagger = P(-pi/2)
        self.apply_single_gate(qubit, gate_phase(-math.pi / 2.0))
        self.apply_h(qubit)
        y = self.measure_expectation_z(qubit)

        # Restore state
        self.state = saved_state

        return (round(x, 4), round(y, 4), round(z, 4))

    def von_neumann_entropy(self) -> float:
        """Estimate Von Neumann entropy S = -sum(p * log2(p))."""
        probs = self.get_probabilities()
        entropy = 0.0
        for p in probs:
            if p > 1e-12:
                entropy -= p * math.log2(p)
        return round(entropy, 4)
