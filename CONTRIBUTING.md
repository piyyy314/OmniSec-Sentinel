# Contributing to Quantum Sentinel AI (QSAI)

Thank you for your interest in contributing to Quantum Sentinel AI and the Chronos Cyber Defense Platform! We welcome contributions from cybersecurity researchers, quantum computing specialists, frontend developers, and machine learning engineers.

---

## Code of Conduct

All contributors are expected to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before participating.

---

## Development Setup

### Prerequisites
* **Node.js**: v18.0.0 or later (LTS recommended)
* **npm**: v9.0.0 or later
* **Python**: v3.10.0 or later (with standard library math, json, sys, os)
* **Git**: v2.30+

### Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/quantum-sentinel-ai.git
cd quantum-sentinel-ai

# Install Node.js dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run local development server (Express backend + Vite client)
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## Testing & Quality Assurance

Before submitting any Pull Request, ensure that all automated checks pass:

```bash
# 1. Typecheck & Lint TypeScript codebase
npm run lint

# 2. Test the scratch-built Pure Python 3 Quantum AI Engine
python3 quantum_ai_engine/runner.py --test

# 3. Test compilation & build
npm run build
```

---

## Branching & Commit Conventions

### Branch Naming
* `feature/<short-name>`: New defense module, visualization, or API endpoint
* `fix/<short-name>`: Bug fix or telemetry patch
* `quantum/<short-name>`: Quantum AI Python algorithm enhancement
* `docs/<short-name>`: Documentation improvements
* `security/<short-name>`: Security hardening or CVE remediations

### Conventional Commits
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
* `feat:` A new feature or module
* `fix:` A bug fix
* `docs:` Documentation updates
* `style:` Code style/formatting changes with no logic impact
* `refactor:` Code restructuring without functional changes
* `perf:` Performance optimizations
* `test:` Adding or updating automated tests
* `chore:` Build process or dependency maintenance

---

## Architecture Guidelines

1. **Pure Python Quantum AI Engine (`quantum_ai_engine/`)**:
   - Zero third-party dependency rule: All tensor operations, quantum gates, state vectors, and circuits must be implemented using pure Python standard library (`math`, `random`, `complex`, `typing`).
   - Any new quantum module must include comprehensive unit tests callable via `runner.py --test`.

2. **Frontend UI/UX Guidelines**:
   - Maintain the high-tech, responsive dark mode cyber telemetry aesthetic.
   - Use Tailwind CSS with clear semantic class names.
   - Support zero-pill discipline and accessible typographic hierarchy.

3. **Backend & Security Hardening**:
   - Any new server route must validate inputs against buffer exhaustion and injection attacks.
   - Do not expose raw API keys or system environment variables to client bundles.

---

## Pull Request Process

1. Fork the repository and create your feature branch from `main`.
2. Commit your changes with conventional commit messages.
3. Verify `npm run lint`, `python3 quantum_ai_engine/runner.py --test`, and `npm run build` succeed locally.
4. Push to your fork and submit a Pull Request to `main`.
5. Fill out the [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md) completely.
6. A maintainer will review your code within 2-3 business days.
