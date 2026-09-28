import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Cpu, 
  Binary, 
  Zap, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Radio, 
  Database,
  ArrowRight,
  Sliders,
  Play,
  RotateCcw,
  Network
} from "lucide-react";

interface AvantGardeLabToolsProps {
  onTriggerLog: (message: string) => void;
  onUpdateHealth: (healthDelta: number, riskDelta: number) => void;
  onAnchorReceipt?: (title: string, data: any) => void;
}

export const AvantGardeLabTools: React.FC<AvantGardeLabToolsProps> = ({
  onTriggerLog,
  onUpdateHealth,
  onAnchorReceipt
}) => {
  const [activeTool, setActiveTool] = useState<
    "neuromorphic" | "polymorphic" | "entanglement" | "causal-do" | "zk-proof"
  >("neuromorphic");

  // ==========================================
  // TOOL 1: NEUROMORPHIC SPIKING IMMUNE CORE
  // ==========================================
  const [antigenType, setAntigenType] = useState<string>("polymorphic-rop");
  const [membraneThreshold, setMembraneThreshold] = useState<number>(68); // mV
  const [membranePotential, setMembranePotential] = useState<number>(42);
  const [spikeCount, setSpikeCount] = useState<number>(1420);
  const [isStimulating, setIsStimulating] = useState<boolean>(false);
  const [immuneStatus, setImmuneStatus] = useState<"idle" | "synthesizing" | "neutralized">("idle");
  const [antibodyAffinity, setAntibodyAffinity] = useState<number>(99.4);

  // Spike wave animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMembranePotential(prev => {
        const noise = (Math.random() - 0.48) * 8;
        const next = Math.max(30, Math.min(membraneThreshold - 2, prev + noise));
        return +next.toFixed(1);
      });
    }, 400);
    return () => clearInterval(interval);
  }, [membraneThreshold]);

  const handleStimulateAntigen = () => {
    setIsStimulating(true);
    setMembranePotential(membraneThreshold + 12);
    setSpikeCount(prev => prev + 128);
    setImmuneStatus("synthesizing");

    onTriggerLog(
      `[${new Date().toLocaleTimeString()}] SNN IMMUNE CORE: Ingested antigen [${antigenType.toUpperCase()}]. Membrane crossed ${membraneThreshold}mV. Initiating Clonal Selection.`
    );

    setTimeout(() => {
      setImmuneStatus("neutralized");
      setIsStimulating(false);
      setMembranePotential(38);
      onUpdateHealth(0.8, -3);
      onTriggerLog(
        `[${new Date().toLocaleTimeString()}] SNN IMMUNE CORE: Clonal affinity maturation reached ${antibodyAffinity}%. Bytecode bound and neutralized at 102.4 Gbps.`
      );
    }, 1100);
  };

  // ==========================================
  // TOOL 2: POLYMORPHIC BINARY TRANSMUTER
  // ==========================================
  const [isAutoMutating, setIsAutoMutating] = useState<boolean>(true);
  const [mutationCount, setMutationCount] = useState<number>(8420);
  const [eliminatedGadgets, setEliminatedGadgets] = useState<number>(1420);
  const [ropSimulationState, setRopSimulationState] = useState<"idle" | "testing" | "blocked">("idle");
  const [binaryOpcodes, setBinaryOpcodes] = useState<string[]>([
    "0x004011a0:  mov r11, [rbp-0x18]    ; mutated register alloc",
    "0x004011a4:  lea rdi, [r11+0x20]     ; non-deterministic lea",
    "0x004011a8:  xor rdx, rdx           ; stack frame randomized",
    "0x004011ab:  push 0x7fff0042        ; shadow call frame",
    "0x004011b0:  sub rsp, 0x30          ; dynamic stack offset",
    "0x004011b4:  ret                    ; eliminated gadget chain"
  ]);

  useEffect(() => {
    if (!isAutoMutating) return;
    const interval = setInterval(() => {
      setMutationCount(prev => prev + 1);
      // Randomize one opcode line subtly
      const variants = [
        "0x004011a0:  mov r9, [rbp-0x20]     ; JIT register shuffle #48",
        "0x004011a4:  add rdi, 0x18          ; AST arithmetic permutation",
        "0x004011a8:  nop dword [rax+rax*1]  ; opaque dead-code barrier",
        "0x004011ab:  xchg r11, rax          ; dynamic register pivot",
        "0x004011b0:  call [gs:0x10]         ; canary integrity verify",
        "0x004011b4:  pop rbp; ret           ; transient trampoline"
      ];
      const pickedLine = Math.floor(Math.random() * 6);
      setBinaryOpcodes(prev => {
        const next = [...prev];
        next[pickedLine] = variants[pickedLine];
        return next;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [isAutoMutating]);

  const testRopExploit = () => {
    setRopSimulationState("testing");
    onTriggerLog(
      `[${new Date().toLocaleTimeString()}] POLYMORPHIC TRANSMUTER: Simulating inbound ROP chain targeting gadget at 0x004011b4...`
    );

    setTimeout(() => {
      setRopSimulationState("blocked");
      setEliminatedGadgets(prev => prev + 12);
      onUpdateHealth(0.5, -2);
      onTriggerLog(
        `[${new Date().toLocaleTimeString()}] ATTACK DEFLECTED: Target gadget vanished due to in-memory LLVM AST permutation! Exploit crashed safely without host execution.`
      );
    }, 900);
  };

  // ==========================================
  // TOOL 3: QUANTUM ENTANGLEMENT HONEYNET
  // ==========================================
  const [entanglementStatus, setEntanglementStatus] = useState<"entangled" | "collapsed_captured">("entangled");
  const [capturedKey, setCapturedKey] = useState<string | null>(null);
  const [entangledNodes] = useState([
    { id: "AWS-Decoy-01", region: "us-east-1", status: "superposition" },
    { id: "GCP-Decoy-02", region: "us-west1", status: "superposition" },
    { id: "Azure-Decoy-03", region: "westeurope", status: "superposition" },
    { id: "OnPrem-Decoy-04", region: "core-dc", status: "superposition" }
  ]);

  const handleAdversaryProbe = () => {
    setEntanglementStatus("collapsed_captured");
    const fakeKey = `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    setCapturedKey(fakeKey);
    onUpdateHealth(1.2, -5);

    onTriggerLog(
      `[${new Date().toLocaleTimeString()}] QUANTUM HONEYNET: Memory probe detected on GCP-Decoy-02! Wave function collapsed instantaneously across all 4 nodes.`
    );
    onTriggerLog(
      `[${new Date().toLocaleTimeString()}] ZERO-ENTROPY TRAP: Captured adversary decryption session key [${fakeKey.slice(0, 14)}...]. Quarantine active.`
    );
  };

  const resetEntanglement = () => {
    setEntanglementStatus("entangled");
    setCapturedKey(null);
    onTriggerLog(
      `[${new Date().toLocaleTimeString()}] QUANTUM HONEYNET: Re-seeded Bell pairs (|00⟩ + |11⟩)/√2 via optical QKD link. Superposition restored.`
    );
  };

  // ==========================================
  // TOOL 4: CAUSAL COUNTERFACTUAL INTERROGATOR
  // ==========================================
  const [intervention, setIntervention] = useState<"none" | "zero-trust" | "ast-morph" | "pqc-lattice">("none");

  const getCausalStats = () => {
    switch (intervention) {
      case "zero-trust":
        return { risk: 1.4, preventionProb: 98.6, theorem: "P(Breach | do(ZeroTrust=1)) = 0.014" };
      case "ast-morph":
        return { risk: 0.6, preventionProb: 99.4, theorem: "P(Breach | do(Polymorphic=1)) = 0.006" };
      case "pqc-lattice":
        return { risk: 0.1, preventionProb: 99.9, theorem: "P(Breach | do(KyberLattice=1)) = 0.001" };
      default:
        return { risk: 89.4, preventionProb: 10.6, theorem: "P(Breach | Unmitigated Baseline) = 0.894" };
    }
  };

  const currentCausal = getCausalStats();

  const applyIntervention = (type: "none" | "zero-trust" | "ast-morph" | "pqc-lattice") => {
    setIntervention(type);
    onTriggerLog(
      `[${new Date().toLocaleTimeString()}] DO-CALCULUS SCM: Applied causal intervention do(${type.toUpperCase()}). Derived structural counterfactual invariance.`
    );
  };

  // ==========================================
  // TOOL 5: zk-SNARK PROOF-OF-EXPLOIT ORACLE
  // ==========================================
  const [zkCve, setZkCve] = useState<string>("CVE-2026-49912 (Zero-Day JIT Memory Escape)");
  const [zkProvingState, setZkProvingState] = useState<"idle" | "proving" | "verified">("idle");
  const [zkReceipt, setZkReceipt] = useState<{
    proofHash: string;
    r1csConstraints: number;
    provingTimeMs: number;
    pairingVerified: boolean;
  } | null>(null);

  const generateZkProof = () => {
    setZkProvingState("proving");
    onTriggerLog(
      `[${new Date().toLocaleTimeString()}] zk-PoEX ORACLE: Compiling arithmetic circuit over BN254 elliptic curve for ${zkCve}...`
    );

    setTimeout(() => {
      const receipt = {
        proofHash: `0xzk${Array.from({ length: 28 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        r1csConstraints: 65536,
        provingTimeMs: 4.2,
        pairingVerified: true
      };
      setZkReceipt(receipt);
      setZkProvingState("verified");
      onUpdateHealth(1.0, -2);
      onTriggerLog(
        `[${new Date().toLocaleTimeString()}] zk-PoEX PROOF GENERATED: Verified pairing e(A, B) == e(α, β)·e(x, γ). Exploitability certified WITHOUT disclosing payload!`
      );
    }, 1200);
  };

  const handleAnchorToLedger = () => {
    if (!zkReceipt) return;
    if (onAnchorReceipt) {
      onAnchorReceipt("zk-SNARK Exploit Certification", {
        cve: zkCve,
        receipt: zkReceipt,
        timestamp: new Date().toISOString()
      });
    }
    onTriggerLog(
      `[${new Date().toLocaleTimeString()}] BLOCKCHAIN ANCHOR: zk-SNARK receipt [${zkReceipt.proofHash.slice(0, 14)}...] anchored to Chronos ledger.`
    );
  };

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-5 shadow-2xl" id="avant-garde-labs-root">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3" id="avant-garde-header">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-100 flex items-center gap-2">
              <span>Avant-Garde Cyber Labs</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                WORLD-FIRST
              </span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Unprecedented defensive technologies engineered beyond conventional corporate cybersecurity
          </p>
        </div>

        <span className="text-[10px] font-mono text-slate-500 self-start sm:self-auto px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
          Quantum-Neuromorphic Fabric
        </span>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-slate-900/60 p-1.5 rounded-lg border border-slate-900" id="avant-garde-tool-nav">
        {[
          { id: "neuromorphic", label: "Neuromorphic SNN", icon: Activity },
          { id: "polymorphic", label: "Binary Transmuter", icon: Binary },
          { id: "entanglement", label: "Quantum Honeynet", icon: Zap },
          { id: "causal-do", label: "Causal Interrogator", icon: Network },
          { id: "zk-proof", label: "zk-SNARK Oracle", icon: Lock }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id as any)}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-md text-[11px] font-mono transition-all ${
                isActive 
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-semibold shadow-sm" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TOOL 1: NEUROMORPHIC SPIKING IMMUNE CORE                  */}
      {/* ========================================================= */}
      {activeTool === "neuromorphic" && (
        <div className="space-y-4" id="tool-neuromorphic-panel">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Leaky Integrate-and-Fire (LIF) Spike Dynamics</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Bio-inspired cyber immune core synthesizing digital antibodies to bind polymorphic bytecode at 100 Gbps line-rate.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900">
                102.4 Gbps Zero-CPU Line Rate
              </span>
            </div>

            {/* Membrane Oscilloscope Display */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Neuron Membrane Potential:</span>
                <span className={`font-bold ${membranePotential >= membraneThreshold ? "text-red-400 animate-pulse" : "text-cyan-400"}`}>
                  {membranePotential} mV / Threshold: {membraneThreshold} mV
                </span>
              </div>
              
              {/* Oscilloscope Progress Bar with Threshold Marker */}
              <div className="relative w-full h-4 bg-slate-900 rounded overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-300 ${
                    membranePotential >= membraneThreshold ? "bg-red-500" : "bg-gradient-to-r from-blue-600 to-cyan-500"
                  }`}
                  style={{ width: `${Math.min(100, (membranePotential / 100) * 100)}%` }}
                />
                {/* Threshold line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                  style={{ left: `${membraneThreshold}%` }}
                  title={`Threshold: ${membraneThreshold}mV`}
                />
              </div>

              {/* Spike Train Raster Simulation */}
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                <span>Spike Count: <strong className="text-slate-300">{spikeCount.toLocaleString()}</strong></span>
                <span>Clonal Affinity: <strong className="text-emerald-400">{antibodyAffinity}%</strong></span>
                <span>Refractory Period: <strong className="text-slate-300">1.8 ms</strong></span>
              </div>
            </div>

            {/* Interactive Antigen Stimulator Form */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Target Bytecode Antigen:</label>
                <select
                  value={antigenType}
                  onChange={(e) => setAntigenType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="polymorphic-rop">0x90 Polymorphic ROP Payload</option>
                  <option value="stuxnet-scada">SCADA PLC Microcode Exploit</option>
                  <option value="ultrasonic-airgap">Ultrasonic Covert Air-Gap Carrier</option>
                  <option value="ebpf-escape">eBPF Ring0 Kernel Escape Vector</option>
                </select>
              </div>

              <div className="sm:col-span-4 space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Threshold Sensitivity:</span>
                  <span className="text-cyan-400">{membraneThreshold} mV</span>
                </div>
                <input 
                  type="range" 
                  min={50} 
                  max={85} 
                  value={membraneThreshold} 
                  onChange={(e) => setMembraneThreshold(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="sm:col-span-4">
                <button
                  onClick={handleStimulateAntigen}
                  disabled={isStimulating}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-mono font-semibold rounded bg-cyan-600 hover:bg-cyan-500 text-white transition-all disabled:opacity-50 shadow-md shadow-cyan-600/20"
                >
                  <Zap className={`w-3.5 h-3.5 ${isStimulating ? "animate-spin" : ""}`} />
                  <span>{isStimulating ? "Clonal Expansion..." : "Stimulate & Neutralize"}</span>
                </button>
              </div>
            </div>

            {/* Neutralization Alert Banner */}
            {immuneStatus === "neutralized" && (
              <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-lg p-3 flex items-center space-x-2.5 text-xs font-mono text-emerald-300 animate-fadeIn">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <strong>Antigen Bound:</strong> High-affinity digital antibodies synthesized and loaded into hardware pipeline. Payload neutralized before OS execution.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOOL 2: POLYMORPHIC BINARY TRANSMUTER                     */}
      {/* ========================================================= */}
      {activeTool === "polymorphic" && (
        <div className="space-y-4" id="tool-polymorphic-panel">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center space-x-2">
                  <Binary className="w-4 h-4 text-cyan-400" />
                  <span>In-Memory LLVM Continuous AST Transmuter</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Continuously rewrites running execution opcodes and registers every 50ms, rendering static ROP chains mathematically invalid.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAutoMutating(prev => !prev)}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded border transition-all ${
                    isAutoMutating 
                      ? "bg-cyan-950 text-cyan-400 border-cyan-800" 
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  {isAutoMutating ? "● Mutating Active (20Hz)" : "Paused"}
                </button>
              </div>
            </div>

            {/* Live Assembly Microcode Disassembly View */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 font-mono text-xs space-y-1 text-slate-300">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-900 flex justify-between">
                <span>Active Process Memory Stream: libsystem_kernel.so</span>
                <span className="text-cyan-400">Mutations: #{mutationCount}</span>
              </div>
              <div className="pt-1 space-y-1">
                {binaryOpcodes.map((code, idx) => (
                  <div key={idx} className="hover:bg-slate-900/60 px-1 rounded transition-colors text-[11px] font-mono">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            {/* Transmutation Stats Bar */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-900">
                <div className="text-slate-500 text-[10px]">ROP GADGETS KILLED</div>
                <div className="text-base font-bold text-emerald-400">{eliminatedGadgets}</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-900">
                <div className="text-slate-500 text-[10px]">TRANSFORMATION OVERHEAD</div>
                <div className="text-base font-bold text-cyan-400">&lt; 0.8%</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-900">
                <div className="text-slate-500 text-[10px]">SOCKET PRESERVATION</div>
                <div className="text-base font-bold text-blue-400">100% Zero-Drop</div>
              </div>
            </div>

            {/* Exploit Test Action */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={testRopExploit}
                disabled={ropSimulationState === "testing"}
                className="flex items-center space-x-2 px-3.5 py-1.5 text-xs font-mono font-semibold rounded bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900/60 text-rose-300 transition-all disabled:opacity-50"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>{ropSimulationState === "testing" ? "Simulating ROP Attack..." : "Test Inbound ROP Attack"}</span>
              </button>

              {ropSimulationState === "blocked" && (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>ROP Gadget Vanished: Attack Deflected!</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOOL 3: QUANTUM ENTANGLEMENT HONEYNET                     */}
      {/* ========================================================= */}
      {activeTool === "entanglement" && (
        <div className="space-y-4" id="tool-entanglement-panel">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Bell-State Entangled Multi-Cloud Honeynet (QETH)</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Adversarial memory probes collapse the quantum state across all distributed decoys, instantly trapping attacker session keys.
                </p>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                entanglementStatus === "entangled" 
                  ? "bg-blue-950 text-blue-400 border-blue-900" 
                  : "bg-red-950 text-red-400 border-red-900 animate-pulse"
              }`}>
                ● {entanglementStatus === "entangled" ? "Bell State (|00⟩ + |11⟩)/√2" : "Wave Function Collapsed"}
              </span>
            </div>

            {/* Distributed Entangled Nodes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              {entangledNodes.map(node => (
                <div 
                  key={node.id} 
                  className={`p-3 rounded-lg border flex flex-col justify-between space-y-2 transition-all ${
                    entanglementStatus === "entangled" 
                      ? "bg-slate-950/80 border-slate-800 hover:border-cyan-500/40" 
                      : "bg-red-950/20 border-red-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold">{node.id}</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                  <div className="text-[10px] text-slate-500">{node.region}</div>
                  <div className="text-[10px] font-semibold text-cyan-300">
                    {entanglementStatus === "entangled" ? "Ψ Superposition" : "Decoherence Lock"}
                  </div>
                </div>
              ))}
            </div>

            {/* Trap Results / Action Buttons */}
            {capturedKey ? (
              <div className="bg-red-950/30 border border-red-900/60 rounded-lg p-3 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-red-300 font-bold">
                  <span className="flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-red-400" />
                    <span>Adversary Trapped in Zero-Entropy Isolation Lattice!</span>
                  </span>
                  <button 
                    onClick={resetEntanglement}
                    className="text-[10px] text-slate-400 hover:text-white underline flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Re-seed Qubits</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px] text-slate-300 break-all">
                  Quarantined Adversary Key: <span className="text-cyan-400 font-bold">{capturedKey}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400 font-mono">
                  All 4 decoy clouds are coupled via optical entangled photon links.
                </span>
                <button
                  onClick={handleAdversaryProbe}
                  className="px-3.5 py-1.5 text-xs font-mono font-semibold rounded bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-600/20"
                >
                  Simulate Adversary Memory Probe
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOOL 4: CAUSAL COUNTERFACTUAL INTERROGATOR                */}
      {/* ========================================================= */}
      {activeTool === "causal-do" && (
        <div className="space-y-4" id="tool-causal-panel">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center space-x-2">
                  <Network className="w-4 h-4 text-cyan-400" />
                  <span>Judea Pearl Structural Causal Model & Do-Calculus</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Evaluates do(X) causal interventions on threat DAGs to mathematically eliminate unobserved confounders.
                </p>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900">
                SCM Invariance Engine
              </span>
            </div>

            {/* Interactive Causal Intervention Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs pt-1">
              {[
                { id: "none", label: "Baseline (Unmitigated)", color: "border-slate-800" },
                { id: "zero-trust", label: "do(ZeroTrust = 1)", color: "border-blue-800" },
                { id: "ast-morph", label: "do(Polymorphic = 1)", color: "border-cyan-800" },
                { id: "pqc-lattice", label: "do(Kyber1024 = 1)", color: "border-emerald-800" }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => applyIntervention(item.id as any)}
                  className={`p-2.5 rounded border text-left transition-all ${
                    intervention === item.id 
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="text-[10px] text-slate-500">INTERVENTION:</div>
                  <div className="text-xs mt-0.5">{item.label}</div>
                </button>
              ))}
            </div>

            {/* Causal Theorem Proof Result */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Formal Do-Calculus Reduction:</span>
                <span className="text-cyan-400 font-bold">{currentCausal.theorem}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2 bg-slate-900/60 rounded border border-slate-900">
                  <div className="text-[10px] text-slate-500">RESIDUAL BREACH LIKELIHOOD</div>
                  <div className={`text-base font-bold ${currentCausal.risk > 50 ? "text-red-400" : "text-emerald-400"}`}>
                    {currentCausal.risk}%
                  </div>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-slate-900">
                  <div className="text-[10px] text-slate-500">COUNTERFACTUAL ATTACK PREVENTION</div>
                  <div className="text-base font-bold text-cyan-400">
                    {currentCausal.preventionProb}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOOL 5: zk-SNARK PROOF-OF-EXPLOIT ORACLE                  */}
      {/* ========================================================= */}
      {activeTool === "zk-proof" && (
        <div className="space-y-4" id="tool-zkproof-panel">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>zk-SNARK Zero-Knowledge Proof-of-Exploit (zk-PoEX)</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Mathematically certifies zero-day exploitability on compiled binaries without disclosing the weaponized payload.
                </p>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900">
                Groth16 / BN254 Curve
              </span>
            </div>

            {/* Target CVE Selector */}
            <div className="space-y-1 font-mono text-xs">
              <label className="text-[10px] text-slate-400 uppercase">Target Vulnerability Circuit:</label>
              <select
                value={zkCve}
                onChange={(e) => setZkCve(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
              >
                <option value="CVE-2026-49912 (Zero-Day JIT Memory Escape)">CVE-2026-49912 (Zero-Day JIT Memory Escape)</option>
                <option value="CVE-2026-1184 (Hypervisor VM-Breakout Primitive)">CVE-2026-1184 (Hypervisor VM-Breakout Primitive)</option>
                <option value="CVE-2026-8803 (Sub-Nanosecond Side-Channel Key Leak)">CVE-2026-8803 (Sub-Nanosecond Side-Channel Key Leak)</option>
              </select>
            </div>

            {/* Proof Action or Generated Receipt */}
            {zkReceipt ? (
              <div className="bg-slate-950 border border-emerald-900/60 rounded-lg p-3 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Cryptographic zk-SNARK Verified! (Payload Undisclosed)</span>
                  </span>
                  <span className="text-slate-400 text-[10px]">{zkReceipt.provingTimeMs} ms proving time</span>
                </div>

                <div className="space-y-1 bg-slate-900/80 p-2.5 rounded border border-slate-800 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Proof Hash (π):</span>
                    <span className="text-cyan-400 font-bold">{zkReceipt.proofHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rank-1 Constraints:</span>
                    <span className="text-slate-300">{zkReceipt.r1csConstraints.toLocaleString()} R1CS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bilinear Pairing Check:</span>
                    <span className="text-emerald-400 font-bold">e(A, B) = e(α, β) · e(x, γ) [VALID]</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    onClick={handleAnchorToLedger}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Anchor zk-Proof to Blockchain</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end pt-1">
                <button
                  onClick={generateZkProof}
                  disabled={zkProvingState === "proving"}
                  className="flex items-center space-x-2 px-4 py-2 text-xs font-mono font-semibold rounded bg-cyan-600 hover:bg-cyan-500 text-white transition-all disabled:opacity-50 shadow-md shadow-cyan-600/20"
                >
                  <Lock className={`w-3.5 h-3.5 ${zkProvingState === "proving" ? "animate-spin" : ""}`} />
                  <span>{zkProvingState === "proving" ? "Synthesizing Proof..." : "Generate zk-Proof of Exploit"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
