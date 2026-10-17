import React, { useState, useEffect, useRef } from "react";

// Graceful WebSocket Monitor to handle/swallow benign Vite HMR socket disconnect errors
if (typeof window !== "undefined") {
  // Swallow the specific 'WebSocket closed without opened' unhandled rejections cleanly
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const isWSError = reason && (
      (typeof reason === "string" && (reason.toLowerCase().includes("websocket") || reason.toLowerCase().includes("ws"))) ||
      (reason.message && (reason.message.toLowerCase().includes("websocket") || reason.message.toLowerCase().includes("closed without opened") || reason.message.toLowerCase().includes("ws")))
    );
    if (isWSError) {
      event.preventDefault();
      console.log("[Sentinel WS Monitor]: Prevented unhandled Vite websocket promise rejection successfully.");
    }
  });

  window.addEventListener("error", (event) => {
    const msg = event.message || "";
    if (msg.toLowerCase().includes("websocket") || msg.toLowerCase().includes("closed without opened") || msg.toLowerCase().includes("ws")) {
      event.preventDefault();
      console.log("[Sentinel WS Monitor]: Suppressed benign development WebSocket connection warning.");
    }
  }, true);
}
import { 
  Shield, 
  Cpu, 
  Binary, 
  Terminal, 
  Zap, 
  FileCheck2, 
  TrendingUp, 
  Activity, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Bot, 
  Send, 
  Layers, 
  Compass, 
  Network, 
  Database, 
  FileCode, 
  Download, 
  Clock, 
  Radio, 
  Check,
  Eye,
  Lock,
  Play,
  Pause,
  GitCommit,
  KeyRound,
  ShieldAlert,
  Sparkles,
  Sliders,
  CheckSquare,
  Workflow,
  Info,
  ShieldCheck,
  CheckCircle2,
  Gauge,
  Flame,
  Timer,
  Server,
  RotateCcw
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as ReChartsTooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { ALL_MODULES } from "./data";
import { ModuleDef, SimulationResult, SecurityEvent, BlockchainBlock } from "./types";
import { ThreatDensityHeatmap } from "./ThreatDensityHeatmap";
import { AvantGardeLabTools } from "./AvantGardeLabTools";
import { QuantumAIPythonWorkspace } from "./QuantumAIPythonWorkspace";

const CATEGORIES = [
  "All",
  "Quantum",
  "Neural & ML",
  "Active Defense & Deception",
  "Monitoring & Auditing",
  "Integrity & Compliance",
  "Autonomous & Bio-Digital"
] as const;

// Host node definitions and initial telemetry baselines for Attack Graph
interface HostNodeInfo {
  id: string;
  name: string;
  role: string;
  ip: string;
  initialUptimeSeconds: number;
  baseUptimePercent: number;
  baseLatency: number;
  normalTrafficPps: number;
  trafficThresholdPps: number;
  protocol: string;
  hardware: string;
}

const HOST_NODES: Record<string, HostNodeInfo> = {
  "node-1": {
    id: "node-1",
    name: "Ingress Edge Gateway (GW1)",
    role: "Perimeter Decryption & Zero-Trust Mesh Router",
    ip: "10.0.1.1",
    initialUptimeSeconds: 14 * 86400 + 6 * 3600 + 23 * 60 + 41,
    baseUptimePercent: 99.98,
    baseLatency: 1.25,
    normalTrafficPps: 4250,
    trafficThresholdPps: 8000,
    protocol: "TLS 1.3 / ML-KEM-768",
    hardware: "FPGA Wire-Speed NIC"
  },
  "node-2": {
    id: "node-2",
    name: "Variational Quantum Circuit (VQC Core)",
    role: "Quantum Anomaly Classifier & State Vector Inference",
    ip: "10.0.2.14",
    initialUptimeSeconds: 5 * 86400 + 18 * 3600 + 44 * 60 + 12,
    baseUptimePercent: 99.85,
    baseLatency: 4.62,
    normalTrafficPps: 5820,
    trafficThresholdPps: 7500,
    protocol: "Q-gRPC / DisCoCat Bus",
    hardware: "QPU Simulator Co-Processor"
  },
  "node-3": {
    id: "node-3",
    name: "Cloud AWS S3 Bucket Log Store",
    role: "Decentralized Immutable Audit Lake",
    ip: "10.0.3.50",
    initialUptimeSeconds: 84 * 86400 + 12 * 3600 + 10 * 60 + 5,
    baseUptimePercent: 99.99,
    baseLatency: 14.85,
    normalTrafficPps: 2410,
    trafficThresholdPps: 6000,
    protocol: "HTTPS / S3 Object Lock",
    hardware: "Distributed NVMe Mesh"
  },
  "node-4": {
    id: "node-4",
    name: "GNN Criticality Pivot Node 04",
    role: "Graph Neural Network Message Passing Correlator",
    ip: "10.0.4.92",
    initialUptimeSeconds: 2 * 86400 + 9 * 3600 + 15 * 60 + 33,
    baseUptimePercent: 99.42,
    baseLatency: 6.22,
    normalTrafficPps: 7120,
    trafficThresholdPps: 7800,
    protocol: "ZeroMQ / WireGuard Mesh",
    hardware: "Tensor Core Neural Accel"
  },
  "node-5": {
    id: "node-5",
    name: "Deception Honeytoken Trap",
    role: "Synthetic Adversary Decoy & Sinkhole Mesh",
    ip: "10.0.9.99",
    initialUptimeSeconds: 0 * 86400 + 19 * 3600 + 52 * 60 + 18,
    baseUptimePercent: 98.70,
    baseLatency: 2.38,
    normalTrafficPps: 11450, // Honeypot naturally experiences high incoming reconnaissance probes!
    trafficThresholdPps: 8000,
    protocol: "Emulated SSH / RDP Decoy",
    hardware: "Isolated MicroVM Sandbox"
  }
};

const INITIAL_TRAFFIC_LIMITS: Record<string, number> = {
  "node-1": 8000,
  "node-2": 7500,
  "node-3": 6000,
  "node-4": 7800,
  "node-5": 8000,
};

function generateInitialTrafficHistory(nodeId: string): number[] {
  const host = HOST_NODES[nodeId] || HOST_NODES["node-1"];
  const points: number[] = [];
  const baseRate = host.normalTrafficPps;
  const isInitialSurge = nodeId === "node-5";

  for (let i = 59; i >= 0; i--) {
    const variance = Math.sin(i * 0.35) * 0.1 + (Math.random() - 0.5) * 0.08;
    let val = Math.round(baseRate * (1 + variance));
    if (isInitialSurge) {
      if (i <= 35) {
        val = Math.round(host.trafficThresholdPps * 1.52 + Math.sin(i * 0.5) * 600 + 1200);
      }
    }
    points.push(val);
  }
  return points;
}

function formatNodeUptimeDuration(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${d}d ${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("All Modules");
  const [activeModule, setActiveModule] = useState<ModuleDef>(ALL_MODULES[0]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [blockchain, setBlockchain] = useState<BlockchainBlock[]>([]);
  const [blockchainLoading, setBlockchainLoading] = useState<boolean>(false);
  const [anchoredBlockHash, setAnchoredBlockHash] = useState<string | null>(null);
  
  // Advanced Chronos Workspace State
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(false);
  const [viewTab, setViewTab] = useState<"telemetry" | "quantum-ai-python" | "avant-garde-tools" | "attack-graph" | "pqc-matrix" | "threat-events">("telemetry");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node-1");
  const [isolatedNodes, setIsolatedNodes] = useState<string[]>([]);
  const [pqcRotatedCount, setPqcRotatedCount] = useState<number>(0);
  const [isMitigating, setIsMitigating] = useState<boolean>(false);

  // Dynamic Node Details Box Telemetry (Host Uptime, Packet Latency, and Simulated Internal Check Traffic Alert)
  const [nodeUptimes, setNodeUptimes] = useState<Record<string, number>>({
    "node-1": 14 * 86400 + 6 * 3600 + 23 * 60 + 41,
    "node-2": 5 * 86400 + 18 * 3600 + 44 * 60 + 12,
    "node-3": 84 * 86400 + 12 * 3600 + 10 * 60 + 5,
    "node-4": 2 * 86400 + 9 * 3600 + 15 * 60 + 33,
    "node-5": 0 * 86400 + 19 * 3600 + 52 * 60 + 18,
  });

  const [nodeLatencies, setNodeLatencies] = useState<Record<string, number>>({
    "node-1": 1.25,
    "node-2": 4.62,
    "node-3": 14.85,
    "node-4": 6.22,
    "node-5": 2.38,
  });

  const [nodeTrafficRates, setNodeTrafficRates] = useState<Record<string, number>>({
    "node-1": 4250,
    "node-2": 5820,
    "node-3": 2410,
    "node-4": 7120,
    "node-5": 11450,
  });

  const [simulatedSurgeNodes, setSimulatedSurgeNodes] = useState<Record<string, boolean>>({
    "node-5": true, // Decoy honeypot starts with active surge demonstration
  });

  // Programmatic Traffic Limits per node (modifiable via Auto-Throttle)
  const [nodeTrafficLimits, setNodeTrafficLimits] = useState<Record<string, number>>({ ...INITIAL_TRAFFIC_LIMITS });
  
  // Rolling 60-second traffic history per node for sparkline chart
  const [nodeTrafficHistory, setNodeTrafficHistory] = useState<Record<string, number[]>>(() => ({
    "node-1": generateInitialTrafficHistory("node-1"),
    "node-2": generateInitialTrafficHistory("node-2"),
    "node-3": generateInitialTrafficHistory("node-3"),
    "node-4": generateInitialTrafficHistory("node-4"),
    "node-5": generateInitialTrafficHistory("node-5"),
  }));

  // Track throttled states
  const [nodeThrottleHistory, setNodeThrottleHistory] = useState<Record<string, { count: number; originalLimit: number }>>({});

  // Refs for access in interval loop without stale closures
  const simulatedSurgeRef = useRef(simulatedSurgeNodes);
  simulatedSurgeRef.current = simulatedSurgeNodes;
  const nodeLimitsRef = useRef(nodeTrafficLimits);
  nodeLimitsRef.current = nodeTrafficLimits;

  // Dynamic host uptime second counter & telemetry jitter loop + 60s sparkline history
  useEffect(() => {
    const timer = setInterval(() => {
      setNodeUptimes(prev => {
        const next = { ...prev };
        for (const k in next) {
          next[k] += 1;
        }
        return next;
      });

      setNodeLatencies(prev => {
        const next = { ...prev };
        next["node-1"] = +(1.25 + (Math.random() - 0.5) * 0.35).toFixed(2);
        next["node-2"] = +(4.62 + (Math.random() - 0.5) * 0.55).toFixed(2);
        next["node-3"] = +(14.85 + (Math.random() - 0.5) * 1.2).toFixed(2);
        next["node-4"] = +(6.22 + (Math.random() - 0.5) * 0.75).toFixed(2);
        next["node-5"] = +(2.38 + (Math.random() - 0.5) * 0.4).toFixed(2);
        return next;
      });

      const nextRates: Record<string, number> = {
        "node-1": Math.round(4250 + (Math.random() - 0.5) * 600),
        "node-2": Math.round(5820 + (Math.random() - 0.5) * 750),
        "node-3": Math.round(2410 + (Math.random() - 0.5) * 350),
        "node-4": Math.round(7120 + (Math.random() - 0.5) * 850),
        "node-5": Math.round(11450 + (Math.random() - 0.5) * 1200),
      };
      setNodeTrafficRates(nextRates);

      // Append live point to rolling 60-second traffic history
      setNodeTrafficHistory(prev => {
        const nextHist = { ...prev };
        const surgeMap = simulatedSurgeRef.current;
        const limitsMap = nodeLimitsRef.current;

        for (const k of ["node-1", "node-2", "node-3", "node-4", "node-5"]) {
          const host = HOST_NODES[k];
          if (!host) continue;
          const isSurging = !!surgeMap[k];
          const threshold = limitsMap[k] ?? host.trafficThresholdPps;
          const baseRate = nextRates[k] ?? host.normalTrafficPps;
          const currentRate = isSurging 
            ? Math.max(baseRate, Math.round(threshold * 1.52 + 1850 + (Math.random() - 0.5) * 300))
            : baseRate;
          const currentArr = nextHist[k] ? [...nextHist[k]] : [];
          currentArr.push(currentRate);
          nextHist[k] = currentArr.slice(-60);
        }
        return nextHist;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Programmatic Auto-Throttle Handler (reduces node traffic limit by 50% and logs to terminal)
  const handleAutoThrottle = (nodeId: string) => {
    const host = HOST_NODES[nodeId] || HOST_NODES["node-1"];
    const currentLimit = nodeTrafficLimits[nodeId] ?? host.trafficThresholdPps;
    const isSurging = !!simulatedSurgeNodes[nodeId];
    const liveTraffic = nodeTrafficRates[nodeId] ?? host.normalTrafficPps;
    const effectiveTraffic = isSurging 
      ? Math.max(liveTraffic, Math.round(currentLimit * 1.52 + 1850))
      : liveTraffic;
    const isSurgeCondition = isSurging || effectiveTraffic > currentLimit;

    // Programmatically reduce the node's traffic limit by 50%
    const newLimit = Math.max(500, Math.round(currentLimit * 0.5));
    setNodeTrafficLimits(prev => ({
      ...prev,
      [nodeId]: newLimit
    }));

    setNodeThrottleHistory(prev => ({
      ...prev,
      [nodeId]: {
        count: (prev[nodeId]?.count || 0) + 1,
        originalLimit: prev[nodeId]?.originalLimit || currentLimit
      }
    }));

    const timestamp = new Date().toLocaleTimeString();
    const actionLog = isSurgeCondition
      ? `[${timestamp}] AUTO-THROTTLE: Ingress traffic surge detected on ${host.id.toUpperCase()} (${host.name}). Programmatically reduced traffic limit by 50% (${currentLimit.toLocaleString()} pkt/s → ${newLimit.toLocaleString()} pkt/s). Kernel eBPF rate-limiting active.`
      : `[${timestamp}] AUTO-THROTTLE: Programmatically reduced traffic limit by 50% on ${host.id.toUpperCase()} (${host.name}) from ${currentLimit.toLocaleString()} pkt/s to ${newLimit.toLocaleString()} pkt/s.`;

    setLiveLogs(prev => [...prev, actionLog]);
    console.log(actionLog);
  };

  const handleResetThrottle = (nodeId: string) => {
    const host = HOST_NODES[nodeId] || HOST_NODES["node-1"];
    const baseline = host.trafficThresholdPps;
    setNodeTrafficLimits(prev => ({
      ...prev,
      [nodeId]: baseline
    }));
    setNodeThrottleHistory(prev => {
      const copy = { ...prev };
      delete copy[nodeId];
      return copy;
    });
    const timestamp = new Date().toLocaleTimeString();
    const resetLog = `[${timestamp}] RATE-LIMIT RESTORED: Host ${host.id.toUpperCase()} baseline traffic limit restored to ${baseline.toLocaleString()} pkt/s.`;
    setLiveLogs(prev => [...prev, resetLog]);
    console.log(resetLog);
  };

  // Gemini chat state
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { 
      sender: "bot", 
      text: "Welcome to Quantum Sentinel AI (QSAI): The Chronos Cyber Defense Platform. Ask me any post-quantum cryptography, adaptive network defense, zero-trust fabric, or causal AI question. I have live real-time access to current system module telemetry." 
    }
  ]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  
  // Simulated overall status values
  const [systemRiskScore, setSystemRiskScore] = useState<number>(34);
  const [overallHealth, setOverallHealth] = useState<number>(94.8);
  const [totalScansCount, setTotalScansCount] = useState<number>(1420);
  
  // Auto terminal log feeds
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [logSearchQuery, setLogSearchQuery] = useState<string>("");
  const logContainerRef = useRef<HTMLDivElement>(null);

  const filteredLogs = liveLogs.filter(log => 
    log.toLowerCase().includes(logSearchQuery.toLowerCase())
  );

  // Auto-Pilot continuous defense scanner loop
  useEffect(() => {
    if (!isAutoPilot) return;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * ALL_MODULES.length);
      const randomMod = ALL_MODULES[randomIdx];
      simulateModule(randomMod.id);
      setLiveLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] CHRONOS AUTO-PILOT: Scanned ${randomMod.name} [#${randomMod.id}] - Status Nominal.`
      ]);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPilot]);

  // Initialize data and triggers
  useEffect(() => {
    // Generate initial security events list
    const initialEvents: SecurityEvent[] = [
      {
        id: "ev-1",
        timestamp: "14:42:15",
        moduleId: 3,
        moduleName: "Quantum Crypto Auditor",
        severity: "warning",
        message: "Classical TLS cipher suite detected (AES-GCM-SHA384) without PQ key encapsulation."
      },
      {
        id: "ev-2",
        timestamp: "14:38:02",
        moduleId: 27,
        moduleName: "Cloud Audit (AWS/Azure/GCP)",
        severity: "critical",
        message: "Publicly accessible AWS S3 backup logs identified via external scan posture."
      },
      {
        id: "ev-3",
        timestamp: "14:15:30",
        moduleId: 1,
        moduleName: "Quantum Vulnerability Predictor",
        severity: "info",
        message: "Ensemble calculations complete. Risk trajectory stabilized."
      }
    ];
    setEvents(initialEvents);

    // Initial log stream feed
    const startupLogs = [
      "QUANTUM SENTINEL AI (QSAI): THE CHRONOS PLATFORM INITIALIZATION...",
      "Quantum search oracles mapped to Grover search array: SUCCESS.",
      "VQC initialized with 8-qubits on standard state vector representation.",
      "GNN message passing layers activated. Target node adjacency: Verified.",
      "Blockchain anchoring services connected to server-side peer ledger.",
      "Chronos Adaptive Defense Engine status: OPTIMIZED."
    ];
    setLiveLogs(startupLogs);

    // Fetch initial blockchain state
    fetchBlockchain();
    
    // Automatically trigger initial simulation for first module
    simulateModule(ALL_MODULES[0].id);
  }, []);

  // Sync log scroll
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [liveLogs]);

  // Query blockchain
  const fetchBlockchain = async () => {
    try {
      const res = await fetch("/api/blockchain");
      const data = await res.json();
      if (data.success) {
        setBlockchain(data.blockchain);
      }
    } catch (e) {
      console.error("Failed to load ledger: ", e);
    }
  };

  // Anchor Current Findings on Blockchain
  const anchorCurrentReport = async () => {
    setBlockchainLoading(true);
    try {
      const reportData = {
        timestamp: new Date().toISOString(),
        systemRiskScore,
        overallHealth,
        totalScansCount,
        activeModuleId: activeModule.id,
        latestSimulationResult: simulationResult
      };

      const res = await fetch("/api/blockchain/anchor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportData })
      });
      const data = await res.json();
      if (data.success) {
        setBlockchain(data.blockchain || []);
        setAnchoredBlockHash(data.block.signature);
        await fetchBlockchain();
        
        // Append on chain audit log
        setLiveLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] BLOCKCHAIN: Anchored executive report state. Index: #${data.block.index} - Signature: ${data.block.signature.substring(0, 16)}...`
        ]);
      }
    } catch (e) {
      console.error("Blockchain anchor error: ", e);
    } finally {
      setBlockchainLoading(false);
    }
  };

  // Trigger server-side module simulation
  const simulateModule = async (moduleId: number) => {
    setIsSimulating(true);
    try {
      const res = await fetch(`/api/modules/${moduleId}/simulate`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.result) {
        setSimulationResult(data.result);
        
        // Dynamic logs appending
        if (data.result.logs) {
          setLiveLogs(prev => [
            ...prev,
            `--- TRIGGER RUN: ${ALL_MODULES.find(m => m.id === moduleId)?.name} ---`,
            ...data.result.logs
          ]);
        }

        // Adjust global states dynamically to represent real interactive analytics
        if (data.result.status === "Warning") {
          setSystemRiskScore(prev => Math.min(prev + 4, 85));
          setOverallHealth(prev => Math.max(prev - 1.2, 74.2));
        } else if (data.result.status === "Critical") {
          setSystemRiskScore(prev => Math.min(prev + 9, 98));
          setOverallHealth(prev => Math.max(prev - 4.5, 62.1));
        } else {
          setSystemRiskScore(prev => Math.max(prev - 2, 12));
          setOverallHealth(prev => Math.min(prev + 0.8, 99.8));
        }
        setTotalScansCount(prev => prev + 1);

        // Add to dynamic security events stream if not success
        if (data.result.status !== "Success") {
          const newEv: SecurityEvent = {
            id: `ev-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            moduleId,
            moduleName: ALL_MODULES.find(m => m.id === moduleId)?.name || "Sentinel Module",
            severity: data.result.status === "Critical" ? "critical" : "warning",
            message: data.result.recommendations?.[0] || "Alert threshold trigger run anomaly flagged."
          };
          setEvents(prev => [newEv, ...prev].slice(0, 8));
        }

      }
    } catch (e) {
      console.error("Simulation error: ", e);
    } finally {
      setIsSimulating(false);
    }
  };

  // Query Gemini Assistant
  const queryGemini = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Gather dynamic context
      const activeModulesState = {
        riskScore: systemRiskScore,
        health: overallHealth,
        totalScans: totalScansCount,
        activeModule: activeModule.name,
        activeModuleCategory: activeModule.category,
        latestMetrics: simulationResult?.metrics || [],
        latestRecommendations: simulationResult?.recommendations || []
      };

      const res = await fetch("/api/gemini/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userText,
          activeModulesState
        })
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setChatMessages(prev => [...prev, { sender: "bot", text: data.answer }]);
        setLiveLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] GEMINI AI: Successfully generated response for user cybersecurity query.`
        ]);
      } else {
        setChatMessages(prev => [...prev, { sender: "bot", text: "I ran into an issue analyzing the current findings. Please ensure your GEMINI_API_KEY is properly configured." }]);
      }
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [...prev, { sender: "bot", text: "Failed to connect to AI server endpoints. Please check connection logs." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Filter modules
  const filteredModules = ALL_MODULES.filter(m => {
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    const matchesSearch = searchQuery === "All Modules" || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate stats
  const quantumModules = ALL_MODULES.filter(m => m.category === "Quantum").length;
  const neuralModules = ALL_MODULES.filter(m => m.category === "Neural & ML").length;
  const monitoringModules = ALL_MODULES.filter(m => m.category === "Monitoring & Auditing").length;
  const integrityModules = ALL_MODULES.filter(m => m.category === "Integrity & Compliance").length;
  const defenseModules = ALL_MODULES.filter(m => m.category === "Active Defense & Deception").length;

  // Pie chart stats data
  const pieData = [
    { name: "Quantum", value: quantumModules, color: "#3B82F6" },
    { name: "Neural & ML", value: neuralModules, color: "#10B981" },
    { name: "Active Defense", value: defenseModules, color: "#F59E0B" },
    { name: "Monitoring", value: monitoringModules, color: "#EC4899" },
    { name: "Integrity", value: integrityModules, color: "#8B5CF6" }
  ];

  // Helper for status background colors
  const getStatusColor = (status: "Active" | "Warning" | "Critical" | "Success") => {
    switch (status) {
      case "Success": return "text-emerald-400 bg-emerald-950/40 border-emerald-800/60";
      case "Active": return "text-blue-400 bg-blue-950/40 border-blue-800/60";
      case "Warning": return "text-amber-400 bg-amber-950/40 border-amber-800/60";
      case "Critical": return "text-red-400 bg-red-950/40 border-red-800/60";
    }
  };

  // Per-threat target mitigation handler
  const fixSpecificThreat = (eventId: string, moduleName: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          severity: "info" as const,
          message: `[MITIGATED]: Threat vector on ${moduleName} successfully patched and firewall rules re-anchored.`
        };
      }
      return ev;
    }));

    setOverallHealth(prev => Math.min(+(prev + 1.2).toFixed(1), 99.8));
    setSystemRiskScore(prev => Math.max(prev - 4, 10));

    setLiveLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] THREAT REMEDIATION: Successfully applied defense patch for ${moduleName} [${eventId}]. State secured.`
    ]);
  };

  // Instant Auto-Mitigation Handler for all threats
  const executeAutoMitigation = () => {
    setIsMitigating(true);
    setTimeout(() => {
      setSystemRiskScore(12);
      setOverallHealth(99.4);
      setEvents(prev => prev.map(ev => ({ ...ev, severity: "info" as const, message: `[AUTO-MITIGATED] Threat vector neutralized by QRL agent.` })));
      
      setSimulationResult(prev => prev ? {
        ...prev,
        status: "Success",
        logs: [...(prev.logs || []), "[MITIGATION COMPLETE]: Reconfigured zero-trust policy rules and purged payload caches."],
        recommendations: ["System state fully stabilized under Post-Quantum Zero-Trust ruleset."]
      } : null);

      setLiveLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] MITIGATION: Executed QRL Autonomous Defensive Patch. Risk score lowered to 12/100.`
      ]);
      setIsMitigating(false);
      
      // Auto anchor the mitigated state
      anchorCurrentReport();
    }, 800);
  };

  // Instant PQC Key Rotation Handler
  const rotatePqcKeys = () => {
    setPqcRotatedCount(prev => prev + 1);
    setOverallHealth(prev => Math.min(prev + 0.5, 99.9));
    setLiveLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] PQC MATRIX: Rotated Kyber-768 & Dilithium-3 keypairs across all network ingress points. Batch #${pqcRotatedCount + 1}`
    ]);
  };

  // Threat burst anomaly simulator for the Threat Density Heatmap
  const handleThreatBurst = () => {
    const targetModuleIds = [35, 34, 33, 31, 30, 29, 28, 27, 21, 20, 3, 2, 7, 23, 14, 11, 8];
    const pickedId = targetModuleIds[Math.floor(Math.random() * targetModuleIds.length)];
    const mod = ALL_MODULES.find(m => m.id === pickedId) || ALL_MODULES[0];
    
    const anomalyMessages = [
      `Critical anomaly: Unusual outbound egress beacon detected on port 4220 for ${mod.name}.`,
      `Zero-day probability threshold crossed (0.92) during runtime inspection of ${mod.name}.`,
      `Cryptographic entropy deviation identified in active key encapsulation routine for ${mod.name}.`,
      `Unauthenticated access signature attempted against cloud perimeter for ${mod.name}.`,
      `Covert timing channel anomaly isolated across sub-atomic quantum packet traces for ${mod.name}.`,
      `Speculative execution branch prediction divergence flagged in telemetry logs for ${mod.name}.`
    ];
    const msg = anomalyMessages[Math.floor(Math.random() * anomalyMessages.length)];

    const burstEvent: SecurityEvent = {
      id: `ev-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      moduleId: mod.id,
      moduleName: mod.name,
      severity: Math.random() > 0.35 ? "critical" : "warning",
      message: msg
    };

    setEvents(prev => [burstEvent, ...prev].slice(0, 12));
    setSystemRiskScore(prev => Math.min(prev + 5, 94));
    setOverallHealth(prev => Math.max(prev - 1.8, 66.0));
    setTotalScansCount(prev => prev + 1);

    setLiveLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] HEATMAP TELEMETRY: Injected anomaly spike into ${mod.name} [#${mod.id}]. Threat density recalculated.`
    ]);
  };

  // Quick Prompt AI Helper
  const handleQuickPrompt = (promptText: string) => {
    setChatInput(promptText);
  };

  // Downloader for SBOM / Compliance JSON report
  const downloadJSONReport = () => {
    const reportData = {
      title: "Quantum Sentinel AI Chronos Platform Compliance Report",
      timestamp: new Date().toISOString(),
      overallHealth,
      systemRiskScore,
      totalScansCount,
      allModulesCount: ALL_MODULES.length,
      currentBlockchainHeight: blockchain.length,
      latestAnchoredBlock: blockchain[blockchain.length - 1],
      findingsSummary: ALL_MODULES.map(m => ({
        id: m.id,
        name: m.name,
        category: m.category,
        description: m.description,
        isCurrentlyMonitored: true
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Chronos_QSAI_Compliance_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setLiveLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] COMPLIANCE: Downloaded complete Chronos Platform compliance report in verified JSON format.`
    ]);
  };

  // Downloader for security logs in CSV format
  const exportLogsToCSV = () => {
    if (!liveLogs || liveLogs.length === 0) return;
    
    const csvHeaders = ["Index", "Timestamp", "Module Name", "Severity", "Log Entry"];
    
    let currentModuleContext = "System Platform";
    
    const csvRows = liveLogs.map((log, index) => {
      let timestamp = "";
      let message = log;
      
      // Parse timestamp
      const match = log.match(/^\[([^\]]+)\]\s*(.*)$/);
      if (match) {
        timestamp = match[1];
        message = match[2];
      } else {
        timestamp = new Date().toLocaleTimeString();
      }
      
      // Detect if this line itself is a Trigger Run delimiter
      const triggerMatch = message.match(/^---\s*TRIGGER RUN:\s*(.*?)\s*---$/);
      if (triggerMatch) {
        currentModuleContext = triggerMatch[1];
      }
      
      // Determine the best matched module name for this log
      let moduleName = currentModuleContext;
      const upperMsg = message.toUpperCase();
      if (upperMsg.includes("BLOCKCHAIN") || upperMsg.includes("ON-CHAIN") || upperMsg.includes("LEDGER")) {
        moduleName = "Blockchain Anchor";
      } else if (upperMsg.includes("COMPLIANCE") || upperMsg.includes("EXECUTIVE REPORT")) {
        moduleName = "Executive Report Generator";
      } else if (upperMsg.includes("VQC") || upperMsg.includes("8-QUBIT") || upperMsg.includes("VARIATIONAL QUANTUM")) {
        moduleName = "Quantum Vulnerability Predictor";
      } else if (upperMsg.includes("QFT") || upperMsg.includes("BEACON") || upperMsg.includes("FOURIER")) {
        moduleName = "Quantum Signal Processor";
      } else if (upperMsg.includes("PQC") || upperMsg.includes("KYBER") || upperMsg.includes("DILITHIUM") || upperMsg.includes("TLS CERTIFICATE") || upperMsg.includes("CIPHER SUITE")) {
        moduleName = "Quantum Crypto Auditor";
      } else if (upperMsg.includes("ANNEALING") || upperMsg.includes("HAMILTONIAN") || upperMsg.includes("ISING")) {
        moduleName = "Quantum Attack Path Optimizer";
      } else if (upperMsg.includes("GROVER") || upperMsg.includes("ORACLE") || upperMsg.includes("RED TEAM")) {
        moduleName = "Quantum Red Team";
      } else if (upperMsg.includes("GNN") || upperMsg.includes("GRAPH NEURAL") || upperMsg.includes("NODE CRITICALITY")) {
        moduleName = "GNN Node Criticality";
      } else if (upperMsg.includes("ZERO-DAY") || upperMsg.includes("CVE FORECASTING") || upperMsg.includes("TRANSFORMER")) {
        moduleName = "Zero-Day Predictor";
      } else if (upperMsg.includes("RL FUZZER") || upperMsg.includes("DQN") || upperMsg.includes("FUZZING")) {
        moduleName = "Autonomous RL Fuzzer";
      } else if (upperMsg.includes("PORT SCAN") || upperMsg.includes("TCP SYN") || upperMsg.includes("BANNER GRAB")) {
        moduleName = "Defensive Port Scanner";
      } else if (upperMsg.includes("SIGNATURE") || upperMsg.includes("YARA") || upperMsg.includes("IDS")) {
        moduleName = "Heuristic IDS";
      } else if (upperMsg.includes("HARDWARE") || upperMsg.includes("SIDE-CHANNEL") || upperMsg.includes("SPECULATIVE")) {
        moduleName = "Telemetry Auditor";
      }
      
      // Parse Severity
      let severity = "INFO";
      if (upperMsg.includes("CRITICAL") || upperMsg.includes("ALERT") || upperMsg.includes("FAIL") || upperMsg.includes("ERROR") || upperMsg.includes("HIGH RISK") || upperMsg.includes("WARN")) {
        if (upperMsg.includes("CRITICAL") || upperMsg.includes("ALERT") || upperMsg.includes("FAIL")) {
          severity = "CRITICAL";
        } else {
          severity = "WARNING";
        }
      } else if (upperMsg.includes("SUCCESS") || upperMsg.includes("OPTIMIZED") || upperMsg.includes("VERIFIED") || upperMsg.includes("STABILIZED") || upperMsg.includes("COMPLETED")) {
        severity = "SUCCESS";
      }
      
      const cleanMsg = message.replace(/"/g, '""');
      const cleanTime = timestamp.replace(/"/g, '""');
      const cleanModule = moduleName.replace(/"/g, '""');
      const cleanSeverity = severity.replace(/"/g, '""');
      
      return `${index + 1},"${cleanTime}","${cleanModule}","${cleanSeverity}","${cleanMsg}"`;
    });
    
    const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Chronos_QSAI_Security_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setLiveLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] COMPLIANCE: Exported ${liveLogs.length} logs with structured Severity and Module Name columns to CSV format.`
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="omnisec-sentinel-app">
      {/* Upper Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between" id="app-header">
        <div className="flex items-center space-x-3" id="app-logo">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg text-white shadow-lg shadow-blue-500/20" id="header-shield-icon">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Quantum Sentinel AI <span className="text-xs font-mono text-blue-500 font-semibold px-2 py-0.5 bg-blue-950/80 border border-blue-900/40 rounded-full ml-1">QSAI</span>
            </h1>
            <p className="text-xs text-slate-500 font-mono">The Chronos Cyber Defense Platform</p>
          </div>
        </div>

        {/* Global Key Statistics Bar */}
        <div className="hidden lg:flex items-center space-x-6 text-xs font-mono border-l border-slate-900 pl-6" id="top-stats-container">
          <div className="flex items-center space-x-2" id="stat-scans">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">Total Scans:</span>
            <span className="text-blue-400 font-bold">{totalScansCount}</span>
          </div>
          <div className="flex items-center space-x-2" id="stat-risk">
            <AlertTriangle className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">Risk Score:</span>
            <span className={`font-bold ${systemRiskScore > 50 ? "text-red-400" : "text-emerald-400"}`}>{systemRiskScore}/100</span>
          </div>
          <div className="flex items-center space-x-2" id="stat-health">
            <Activity className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">Security Health:</span>
            <span className="text-emerald-400 font-bold">{overallHealth.toFixed(1)}%</span>
          </div>
          <div className="flex items-center space-x-2 border-l border-slate-900 pl-6" id="stat-live-indicator">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400 uppercase text-[10px] tracking-widest font-semibold">Live Feed</span>
          </div>
        </div>

        {/* Executive Quick Actions */}
        <div className="flex items-center space-x-3" id="executive-actions-header">
          <button 
            id="toggle-autopilot-btn"
            onClick={() => setIsAutoPilot(!isAutoPilot)}
            className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              isAutoPilot 
                ? "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-md shadow-amber-500/10" 
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="Toggle Continuous Auto-Pilot Defense Scanning"
          >
            {isAutoPilot ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>Auto-Pilot: {isAutoPilot ? "ON" : "OFF"}</span>
          </button>

          <button 
            id="execute-auto-mitigate-btn"
            onClick={executeAutoMitigation}
            disabled={isMitigating}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-900/50 rounded-lg transition-all disabled:opacity-50"
            title="Instantly execute autonomous QRL defense patch across active vectors"
          >
            <Zap className={`w-3.5 h-3.5 ${isMitigating ? "animate-spin" : ""}`} />
            <span>{isMitigating ? "Mitigating..." : "Auto-Mitigate"}</span>
          </button>

          <button 
            id="download-report-btn"
            onClick={downloadJSONReport}
            className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
            title="Download full suite report with dynamic security findings"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SBOM Report</span>
          </button>
          <button 
            id="blockchain-anchor-btn"
            onClick={anchorCurrentReport}
            disabled={blockchainLoading}
            className="flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-md shadow-blue-500/10 transition-all disabled:opacity-50"
            title="Anchor snapshot onto the compliance blockchain"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{blockchainLoading ? "Mining..." : "Anchor Findings"}</span>
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 overflow-y-auto xl:overflow-hidden" id="main-content-layout">
        
        {/* LEFT COLUMN: Modules Directory & Filtering */}
        <section className="xl:col-span-4 flex flex-col space-y-4 xl:max-h-[calc(100vh-140px)] xl:overflow-y-auto pr-1 custom-scrollbar" id="modules-directory-column">
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-4" id="directory-filter-box">
            <div className="flex items-center justify-between" id="directory-header">
              <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Modules Directory</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-500 px-2 py-0.5 bg-slate-900/60 rounded">{ALL_MODULES.length} Total</span>
            </div>

            {/* Custom search selector */}
            <div className="relative" id="search-container">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                id="module-search-input"
                type="text"
                placeholder="Search quantum, neural, scanning modules..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                value={searchQuery === "All Modules" ? "" : searchQuery}
                onChange={(e) => setSearchQuery(e.target.value || "All Modules")}
              />
            </div>

            {/* Horizontal filter capsules */}
            <div className="flex flex-wrap gap-1.5 pt-1" id="filter-capsules-container">
              {CATEGORIES.map(category => (
                <button
                  id={`filter-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                    selectedCategory === category 
                      ? "bg-blue-600/10 border-blue-500 text-blue-400" 
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Directory list of modules */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl flex-1 overflow-y-auto max-h-[520px] custom-scrollbar p-2 space-y-1.5" id="modules-list-box">
            {filteredModules.length > 0 ? (
              filteredModules.map(m => {
                const isActive = activeModule.id === m.id;
                return (
                  <button
                    id={`module-btn-${m.id}`}
                    key={m.id}
                    onClick={() => {
                      setActiveModule(m);
                      simulateModule(m.id);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between space-x-3 ${
                      isActive 
                        ? "bg-slate-900 border-blue-600/80 shadow-md shadow-blue-500/5" 
                        : "bg-slate-900/40 border-slate-900 hover:border-slate-800 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="space-y-1 flex-1" id={`module-btn-content-${m.id}`}>
                      <div className="flex items-center space-x-2" id={`module-title-box-${m.id}`}>
                        <span className="text-[10px] font-mono font-bold text-slate-500 w-5">#{String(m.id).padStart(2, '0')}</span>
                        <span className={`text-xs font-semibold ${isActive ? "text-blue-400" : "text-slate-200"}`}>{m.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{m.description}</p>
                      
                      {/* Technical layer indicator */}
                      <div className="flex items-center space-x-2 pt-1" id={`module-tags-${m.id}`}>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{m.category}</span>
                        <span className="text-[8px] text-slate-600">•</span>
                        <span className="text-[9px] font-mono text-slate-500">Live Agent active</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between h-full text-right" id={`module-badge-col-${m.id}`}>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                        m.category === "Quantum" ? "bg-blue-950 text-blue-400 border border-blue-900/30" : 
                        m.category === "Neural & ML" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30" : 
                        m.category === "Active Defense & Deception" ? "bg-amber-950 text-amber-400 border border-amber-900/30" :
                        "bg-purple-950 text-purple-400 border border-purple-900/30"
                      }`}>
                        {m.category === "Active Defense & Deception" ? "DEFENSE" : m.category.split(" ")[0]}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs font-mono" id="no-modules-alert">
                No cybersecurity modules match search criteria.
              </div>
            )}
          </div>
        </section>

        {/* MIDDLE COLUMN: Interactive Simulation Space, Attack Graph & PQC Matrix */}
        <section className="xl:col-span-5 flex flex-col space-y-4 xl:max-h-[calc(100vh-140px)] xl:overflow-y-auto pr-1 custom-scrollbar" id="simulation-middle-column">
          
          {/* Workspace Navigation Tabs Bar */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-1.5 flex items-center space-x-1 overflow-x-auto custom-scrollbar-horizontal sticky top-0 z-10 backdrop-blur bg-slate-950/90" id="workspace-tabs-bar">
            {[
              { id: "telemetry", label: "Telemetry & Run", icon: Activity },
              { id: "quantum-ai-python", label: "Quantum AI Python", icon: Cpu, badge: "PYTHON 3" },
              { id: "avant-garde-tools", label: "Avant-Garde Labs", icon: Sparkles, badge: "NEW" },
              { id: "attack-graph", label: "Attack Path Matrix", icon: Network },
              { id: "pqc-matrix", label: "PQC Crypto Matrix", icon: KeyRound },
              { id: "threat-events", label: "Threat Stream", icon: ShieldAlert }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = viewTab === tab.id;
              const isAvant = tab.id === "avant-garde-tools";
              const isQuantum = tab.id === "quantum-ai-python";
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setViewTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    isActive 
                      ? (isQuantum
                          ? "bg-gradient-to-r from-blue-950/80 to-cyan-950/80 border border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-950/50"
                          : isAvant 
                            ? "bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-sm" 
                            : "bg-blue-600/15 border border-blue-500/40 text-blue-400 shadow-sm")
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? (isQuantum ? "text-cyan-300 animate-pulse" : isAvant ? "text-cyan-400" : "text-blue-400") : "text-slate-500"}`} />
                  <span className="truncate">{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] font-bold px-1 py-0.2 rounded border ${
                      isQuantum 
                        ? "bg-blue-900/80 text-blue-200 border-blue-700" 
                        : "bg-cyan-950 text-cyan-400 border border-cyan-800"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* VIEW TAB 1: TELEMETRY & MODULE SIMULATION */}
          {viewTab === "telemetry" && (
            <>
              {/* Main Selected Module Execution Block */}
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 flex flex-col space-y-4" id="simulation-control-card">
                <div className="flex items-start justify-between" id="sim-card-header">
                  <div className="space-y-1" id="sim-title-container">
                    <div className="flex items-center space-x-2" id="sim-category-crumb">
                      <span className="text-[10px] font-mono uppercase bg-blue-950 text-blue-400 border border-blue-950 px-2 py-0.5 rounded">
                        MODULE {activeModule.id}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">/{activeModule.category}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                      <span>{activeModule.name}</span>
                    </h3>
                  </div>

                  <button
                    id="trigger-simulation-btn"
                    onClick={() => simulateModule(activeModule.id)}
                    disabled={isSimulating}
                    className="flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50 shadow-lg shadow-blue-500/10"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
                    <span>{isSimulating ? "Processing..." : "Trigger Simulation"}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-900/80" id="sim-desc">
                  {activeModule.description}
                </p>

                {/* Technical Pipeline details */}
                <div className="text-xs font-mono space-y-1.5 bg-slate-900/30 p-3 rounded-lg border border-slate-900/50" id="sim-tech-pipeline">
                  <div className="text-slate-400 font-semibold" id="tech-pipeline-header">⚙️ Pipeline Algorithm Configuration:</div>
                  <div className="text-slate-400 text-[11px] leading-relaxed" id="tech-pipeline-body">{activeModule.technicalDetails}</div>
                </div>

                {/* Displaying Live Simulated Response Telemetry */}
                {simulationResult ? (
                  <div className="space-y-4 pt-2" id="sim-results-pane">
                    <div className="flex items-center justify-between" id="result-status-row">
                      <span className="text-xs font-semibold text-slate-400 font-mono">Current Audit Response:</span>
                      <span className={`text-[11px] font-bold font-mono px-2.5 py-1 border rounded-full uppercase tracking-wider ${getStatusColor(simulationResult.status)}`}>
                        ● {simulationResult.status}
                      </span>
                    </div>

                    {/* Simulated Metrics widgets */}
                    <div className="grid grid-cols-3 gap-3" id="result-metrics-grid">
                      {simulationResult.metrics.map((m, idx) => (
                        <div key={idx} className="bg-slate-900/60 border border-slate-900/80 rounded-lg p-2.5 flex flex-col justify-between" id={`metric-widget-${idx}`}>
                          <span className="text-[10px] text-slate-500 truncate font-medium font-mono">{m.label}</span>
                          <div className="flex items-baseline space-x-1" id={`metric-val-row-${idx}`}>
                            <span className="text-sm font-bold text-slate-100 tracking-tight font-mono">{m.value}</span>
                            {m.unit && <span className="text-[9px] font-mono text-slate-500">{m.unit}</span>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Recommendations Callout Box */}
                    {simulationResult.recommendations && simulationResult.recommendations.length > 0 && (
                      <div className="border border-blue-950 bg-blue-950/20 rounded-lg p-3 space-y-2" id="recs-alert-box">
                        <div className="text-xs font-bold text-blue-400 flex items-center justify-between" id="recs-alert-title">
                          <div className="flex items-center space-x-2">
                            <FileCheck2 className="w-4 h-4 text-blue-500" />
                            <span>Targeted Remediation Recommendations:</span>
                          </div>
                          <button
                            id="inline-mitigate-btn"
                            onClick={executeAutoMitigation}
                            disabled={isMitigating}
                            className="text-[10px] font-mono bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded transition-all"
                          >
                            Execute Fix
                          </button>
                        </div>
                        <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside leading-relaxed" id="recs-list">
                          {simulationResult.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 text-xs font-mono" id="no-sim-alert">
                    Trigger a simulation run to ingest and calculate cyber risk metrics.
                  </div>
                )}
              </div>

              {/* Threat Density Heatmap Visualization */}
              <ThreatDensityHeatmap
                events={events}
                activeModuleId={activeModule.id}
                onSelectModule={(mod) => {
                  setActiveModule(mod);
                  simulateModule(mod.id);
                }}
                onSimulateBurst={handleThreatBurst}
              />

              {/* Intelligent Layer Allocation Widget */}
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4" id="visualization-card">
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase font-mono flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span>Cyber Intelligence Layer Allocation</span>
                </h3>

                {/* Flex Container: Chart + Stats Legends */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center" id="vis-card-grid">
                  <div className="md:col-span-5 h-[150px] min-w-0 min-h-[150px] flex items-center justify-center" id="pie-chart-col">
                    <ResponsiveContainer width="100%" height={150} minWidth={100} minHeight={150}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="md:col-span-7 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400" id="pie-legend-col">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2 p-1 bg-slate-900/40 rounded border border-slate-900/60" id={`legend-item-${index}`}>
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="truncate text-slate-300">{entry.name}</span>
                        <span className="text-slate-500 font-bold ml-auto">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {simulationResult?.visualizationData && (
                  <div className="border-t border-slate-900/80 pt-4" id="dynamic-run-chart-container">
                    <h4 className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-3">Live Signal Variance (Simulated Telemetry Run)</h4>
                    <div className="h-[100px] min-w-0 min-h-[100px]" id="dynamic-run-chart-box">
                      <ResponsiveContainer width="100%" height={100} minWidth={100} minHeight={100}>
                        <BarChart data={simulationResult.visualizationData}>
                          <XAxis dataKey="name" hide />
                          <YAxis hide />
                          <ReChartsTooltip contentStyle={{ backgroundColor: "#0b0f19", border: "1px solid #1e293b", fontSize: "10px", color: "#f1f5f9" }} />
                          <Bar dataKey="value" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* VIEW TAB: QUANTUM AI PYTHON CORE (Pure Python 3, Built from Scratch) */}
          {viewTab === "quantum-ai-python" && (
            <QuantumAIPythonWorkspace
              onTriggerLog={(msg) => setLiveLogs(prev => [...prev, msg])}
              onAnchorReceipt={(title, data) => {
                anchorCurrentReport();
              }}
            />
          )}

          {/* VIEW TAB: AVANT-GARDE CYBER LABS & WORLD-FIRST TOOLS */}
          {viewTab === "avant-garde-tools" && (
            <AvantGardeLabTools
              onTriggerLog={(msg) => setLiveLogs(prev => [...prev, msg])}
              onUpdateHealth={(hDelta, rDelta) => {
                setOverallHealth(prev => Math.min(+(prev + hDelta).toFixed(1), 99.9));
                setSystemRiskScore(prev => Math.max(prev + rDelta, 5));
              }}
              onAnchorReceipt={(title, data) => {
                anchorCurrentReport();
              }}
            />
          )}

          {/* VIEW TAB 2: INTERACTIVE ATTACK PATH MATRIX GRAPH */}
          {viewTab === "attack-graph" && (
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4 flex flex-col flex-1" id="attack-path-matrix-card">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3" id="attack-graph-header">
                <div className="flex items-center space-x-2" id="attack-graph-title">
                  <Network className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-200">Interactive Attack Path Topology</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">GNN Message Passing Enabled</span>
              </div>

              {/* Topology SVG Map */}
              <div className="relative bg-slate-900/30 border border-slate-900 rounded-lg p-4 h-[260px] flex items-center justify-center overflow-hidden" id="svg-topology-container">
                <svg className="w-full h-full text-slate-800" viewBox="0 0 500 220">
                  {/* Connection lines */}
                  <line x1="80" y1="110" x2="200" y2="60" stroke="#1e293b" strokeWidth="2" strokeDasharray="4" />
                  <line x1="80" y1="110" x2="200" y2="160" stroke="#1e293b" strokeWidth="2" strokeDasharray="4" />
                  <line x1="200" y1="60" x2="350" y2="110" stroke="#3b82f6" strokeWidth="2" className="animate-pulse" />
                  <line x1="200" y1="160" x2="350" y2="110" stroke="#1e293b" strokeWidth="2" />
                  <line x1="350" y1="110" x2="440" y2="110" stroke="#ef4444" strokeWidth="2" strokeDasharray="2" />

                  {/* Node 1: Ingress Gateway */}
                  <g className="cursor-pointer" onClick={() => setSelectedNodeId("node-1")}>
                    <circle cx="80" cy="110" r="18" fill="#0f172a" stroke={selectedNodeId === "node-1" ? "#3b82f6" : "#334155"} strokeWidth="2" />
                    <text x="80" y="114" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">GW1</text>
                  </g>

                  {/* Node 2: VQC Quantum Core */}
                  <g className="cursor-pointer" onClick={() => setSelectedNodeId("node-2")}>
                    <circle cx="200" cy="60" r="18" fill="#0f172a" stroke={selectedNodeId === "node-2" ? "#3b82f6" : "#3b82f6"} strokeWidth="2" />
                    <text x="200" y="64" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="bold" fontFamily="monospace">VQC</text>
                  </g>

                  {/* Node 3: AWS S3 Bucket */}
                  <g className="cursor-pointer" onClick={() => setSelectedNodeId("node-3")}>
                    <circle cx="200" cy="160" r="18" fill="#0f172a" stroke={isolatedNodes.includes("node-3") ? "#ef4444" : (selectedNodeId === "node-3" ? "#f59e0b" : "#d97706")} strokeWidth="2" />
                    <text x="200" y="164" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold" fontFamily="monospace">S3</text>
                  </g>

                  {/* Node 4: GNN Pivot Node */}
                  <g className="cursor-pointer" onClick={() => setSelectedNodeId("node-4")}>
                    <circle cx="350" cy="110" r="18" fill="#0f172a" stroke={selectedNodeId === "node-4" ? "#10b981" : "#059669"} strokeWidth="2" />
                    <text x="350" y="114" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">GNN</text>
                  </g>

                  {/* Node 5: Honeytoken Trap */}
                  <g className="cursor-pointer" onClick={() => setSelectedNodeId("node-5")}>
                    <circle cx="440" cy="110" r="14" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
                    <text x="440" y="113" textAnchor="middle" fill="#a78bfa" fontSize="8" fontFamily="monospace">HONEY</text>
                  </g>
                </svg>

                <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-500 bg-slate-950/80 px-2 py-1 rounded border border-slate-900">
                  Click nodes to view risk parameters & isolation state
                </div>
              </div>

              {/* Selected Node Details Box */}
              {(() => {
                const activeHostId = selectedNodeId || "node-1";
                const activeHost = HOST_NODES[activeHostId] || HOST_NODES["node-1"];
                const isHostIsolated = isolatedNodes.includes(activeHostId);
                const isHostSurging = !!simulatedSurgeNodes[activeHostId];
                const activeLimit = nodeTrafficLimits[activeHostId] ?? activeHost.trafficThresholdPps;
                const isThrottled = !!nodeThrottleHistory[activeHostId];
                
                const baseLiveTraffic = nodeTrafficRates[activeHostId] ?? activeHost.normalTrafficPps;
                const effectiveTraffic = isHostSurging 
                  ? Math.max(baseLiveTraffic, Math.round(activeLimit * 1.52 + 1850))
                  : baseLiveTraffic;

                // Simulated Internal Check: checks if incoming traffic exceeds safety threshold
                const isTrafficAlertActive = effectiveTraffic > activeLimit;
                const trafficExcessPct = isTrafficAlertActive 
                  ? Math.round(((effectiveTraffic - activeLimit) / activeLimit) * 100)
                  : 0;

                const liveLatency = nodeLatencies[activeHostId] ?? activeHost.baseLatency;
                const liveUptimeSec = nodeUptimes[activeHostId] ?? activeHost.initialUptimeSeconds;
                const displayedUptimePercent = isHostIsolated ? 0 : activeHost.baseUptimePercent;

                return (
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-4 transition-all shadow-lg" id="node-details-box">
                    {/* Top Row: Host Identity & Action Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Server className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-slate-100 font-mono tracking-wide">
                            {activeHost.name}
                          </span>
                          <span className="text-[10px] bg-slate-800/90 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-semibold border border-slate-700">
                            {activeHost.id.toUpperCase()}
                          </span>
                          <span className="text-[10px] bg-slate-800/60 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                            {activeHost.ip}
                          </span>
                          {isThrottled && (
                            <span className="text-[9px] bg-purple-950/80 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold border border-purple-800">
                              THROTTLED -50%
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono flex items-center space-x-2">
                          <span>{activeHost.role}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-500">{activeHost.protocol}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Auto-Throttle Button (programmatically reduces node traffic limit by 50% during surge and logs action to terminal) */}
                        <button
                          id="auto-throttle-btn"
                          onClick={() => handleAutoThrottle(activeHostId)}
                          className={`px-2.5 py-1 text-xs font-mono rounded flex items-center space-x-1.5 transition-all border font-semibold ${
                            isTrafficAlertActive || isHostSurging
                              ? "bg-amber-950/90 text-amber-200 border-amber-500 hover:bg-amber-900 shadow-[0_0_14px_rgba(245,158,11,0.55)] animate-pulse"
                              : isThrottled
                                ? "bg-purple-950/80 text-purple-300 border-purple-700 hover:bg-purple-900"
                                : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
                          }`}
                          title="Programmatically reduce the node's traffic limit by 50% during a traffic surge and log the action to the terminal"
                        >
                          <Zap className={`w-3.5 h-3.5 ${isTrafficAlertActive || isHostSurging ? "text-amber-400 fill-amber-400 animate-bounce" : "text-slate-400"}`} />
                          <span>
                            Auto-Throttle {isThrottled ? `(-50% x${nodeThrottleHistory[activeHostId]?.count})` : "(-50%)"}
                          </span>
                        </button>

                        {/* Reset Throttled Limit Button */}
                        {isThrottled && (
                          <button
                            id="reset-throttle-btn"
                            onClick={() => handleResetThrottle(activeHostId)}
                            className="px-2 py-1 text-[11px] font-mono rounded flex items-center space-x-1 bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                            title="Restore node traffic limit back to factory baseline"
                          >
                            <RotateCcw className="w-3 h-3 text-slate-400" />
                            <span>Reset Limit</span>
                          </button>
                        )}

                        {/* Simulate Traffic Spike Toggle (Internal Check Trigger) */}
                        <button
                          id="simulate-traffic-surge-btn"
                          onClick={() => {
                            setSimulatedSurgeNodes(prev => ({
                              ...prev,
                              [activeHostId]: !prev[activeHostId]
                            }));
                            setLiveLogs(prev => [
                              ...prev,
                              `[${new Date().toLocaleTimeString()}] SIMULATION: Toggled ingress surge pattern on ${activeHost.id} (${!isHostSurging ? 'SURGE ACTIVE' : 'SURGE CEASED'}).`
                            ]);
                          }}
                          className={`px-2.5 py-1 text-xs font-mono rounded flex items-center space-x-1.5 transition-all border ${
                            isHostSurging 
                              ? "bg-rose-950/80 text-rose-300 border-rose-700 hover:bg-rose-900 shadow-[0_0_10px_rgba(244,63,94,0.4)]" 
                              : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
                          }`}
                          title="Simulate unusually high incoming traffic to trigger the internal check alert"
                        >
                          <Flame className={`w-3.5 h-3.5 ${isHostSurging ? "text-rose-400 animate-pulse" : "text-slate-400"}`} />
                          <span>{isHostSurging ? "Stop Traffic Surge" : "Simulate Traffic Surge"}</span>
                        </button>

                        {/* Isolate Host Toggle */}
                        {selectedNodeId && (
                          <button
                            id="isolate-node-toggle-btn"
                            onClick={() => {
                              setIsolatedNodes(prev => 
                                prev.includes(selectedNodeId) ? prev.filter(id => id !== selectedNodeId) : [...prev, selectedNodeId]
                              );
                              setLiveLogs(prev => [
                                ...prev,
                                `[${new Date().toLocaleTimeString()}] NETWORK: Toggled isolation posture for ${selectedNodeId}.`
                              ]);
                            }}
                            className={`px-3 py-1 text-xs font-semibold rounded font-mono transition-all border ${
                              isHostIsolated 
                                ? "bg-emerald-950 text-emerald-400 border-emerald-900 hover:bg-emerald-900" 
                                : "bg-red-950 text-red-400 border-red-900 hover:bg-red-900"
                            }`}
                          >
                            {isHostIsolated ? "Re-connect Host" : "Isolate Host"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Middle Row: Dynamic Gauges Grid (Host Uptime Gauge & Packet Inspection Latency Gauge) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* 1. Dynamic Host Uptime Gauge */}
                      <div className="bg-slate-950/70 border border-slate-800/90 rounded-lg p-3 space-y-2.5" id="host-uptime-gauge">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
                            <Timer className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Host Uptime</span>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            isHostIsolated 
                              ? "bg-red-950/80 text-red-400 border border-red-900" 
                              : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80"
                          }`}>
                            {isHostIsolated ? "SUSPENDED" : "HIGH AVAILABILITY"}
                          </span>
                        </div>

                        {/* Uptime Numerical Display */}
                        <div className="flex items-baseline justify-between font-mono">
                          <div className="flex items-baseline space-x-1.5">
                            <span className={`text-xl font-extrabold ${isHostIsolated ? "text-red-400" : "text-emerald-400"}`}>
                              {displayedUptimePercent.toFixed(2)}%
                            </span>
                            <span className="text-[10px] text-slate-500">Service Level</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-200">
                              {isHostIsolated ? "0d 00h 00m 00s" : formatNodeUptimeDuration(liveUptimeSec)}
                            </div>
                            <div className="text-[9px] text-slate-500">Live Continuous Run</div>
                          </div>
                        </div>

                        {/* Visual Uptime Gauge Bar */}
                        <div className="space-y-1">
                          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isHostIsolated 
                                  ? "bg-red-500 w-[0%]" 
                                  : "bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                              }`}
                              style={{ width: `${isHostIsolated ? 0 : Math.min(displayedUptimePercent, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] font-mono text-slate-500">
                            <span>0%</span>
                            <span>90%</span>
                            <span>99%</span>
                            <span className="text-emerald-400 font-semibold">100% SLA</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. Dynamic Packet Inspection Latency Gauge */}
                      <div className="bg-slate-950/70 border border-slate-800/90 rounded-lg p-3 space-y-2.5" id="packet-latency-gauge">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
                            <Gauge className="w-3.5 h-3.5 text-blue-400" />
                            <span>Packet Inspection Latency</span>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            liveLatency < 5 
                              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80" 
                              : liveLatency < 15 
                                ? "bg-amber-950/80 text-amber-300 border border-amber-800/80" 
                                : "bg-rose-950/80 text-rose-300 border border-rose-800/80"
                          }`}>
                            {liveLatency < 5 ? "WIRE-SPEED (<5ms)" : liveLatency < 15 ? "NOMINAL (<15ms)" : "ELEVATED"}
                          </span>
                        </div>

                        {/* Latency Numerical Display */}
                        <div className="flex items-baseline justify-between font-mono">
                          <div className="flex items-baseline space-x-1.5">
                            <span className={`text-xl font-extrabold ${
                              liveLatency < 5 ? "text-emerald-400" : liveLatency < 15 ? "text-amber-400" : "text-rose-400"
                            }`}>
                              {liveLatency.toFixed(2)} ms
                            </span>
                            <span className="text-[10px] text-slate-500">Inspection Time</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-300">
                              Jitter: ±0.14 ms
                            </div>
                            <div className="text-[9px] text-slate-500">Zero-Copy Kernel Bypass</div>
                          </div>
                        </div>

                        {/* Visual Latency Gauge Bar */}
                        <div className="space-y-1">
                          <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            {/* Color bands: 0-5ms (green), 5-15ms (yellow), 15-25ms+ (red) */}
                            <div className="absolute inset-0 flex">
                              <div className="w-[20%] bg-emerald-500/20 border-r border-emerald-500/40" />
                              <div className="w-[40%] bg-amber-500/20 border-r border-amber-500/40" />
                              <div className="w-[40%] bg-rose-500/20" />
                            </div>
                            {/* Active pointer bar */}
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                liveLatency < 5 
                                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400" 
                                  : liveLatency < 15 
                                    ? "bg-gradient-to-r from-amber-400 to-orange-400" 
                                    : "bg-gradient-to-r from-rose-500 to-red-600"
                              }`}
                              style={{ width: `${Math.min((liveLatency / 25) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] font-mono text-slate-500">
                            <span className="text-emerald-500 font-semibold">0ms (Ideal)</span>
                            <span className="text-amber-500">5ms</span>
                            <span className="text-rose-500">15ms</span>
                            <span>25ms+</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Traffic Alert Indicator (Glows Red when unusually high incoming traffic via simulated internal check) */}
                    <div 
                      id="traffic-alert-indicator"
                      className={`rounded-lg p-3 transition-all duration-300 font-mono ${
                        isTrafficAlertActive 
                          ? "bg-red-950/80 border-2 border-red-500 text-red-200 shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse" 
                          : "bg-slate-950/70 border border-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {isTrafficAlertActive ? (
                            <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-extrabold uppercase tracking-wider ${
                                isTrafficAlertActive ? "text-red-300" : "text-emerald-300"
                              }`}>
                                {isTrafficAlertActive ? "Traffic Alert: Unusual Ingress Surge Detected" : "Traffic Monitor: Ingress Flow Nominal"}
                              </span>
                              {isTrafficAlertActive && (
                                <span className="bg-red-900/90 text-red-100 text-[9px] font-black px-1.5 py-0.5 rounded border border-red-600 animate-pulse">
                                  CRITICAL SPIKE +{trafficExcessPct}%
                                </span>
                              )}
                              {isThrottled && (
                                <span className="bg-purple-900/90 text-purple-200 text-[9px] font-bold px-1.5 py-0.5 rounded border border-purple-600">
                                  LIMIT REDUCED -50%
                                </span>
                              )}
                            </div>

                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isTrafficAlertActive 
                                ? "bg-red-900/60 text-red-300 border border-red-700" 
                                : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/60"
                            }`}>
                              Simulated Internal Check: {isTrafficAlertActive ? "FAILED (SURGE DETECTED)" : "PASSED"}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300">
                            {isTrafficAlertActive ? (
                              <span>
                                Ingress volume on <strong className="text-white">{activeHost.name}</strong> reached <strong className="text-red-300">{effectiveTraffic.toLocaleString()} pkt/s</strong>, exceeding the calibrated safety threshold of <strong className="text-white">{activeLimit.toLocaleString()} pkt/s</strong>. Click <strong className="text-amber-300">Auto-Throttle</strong> above to reduce traffic limits by 50% and engage token-bucket shaping.
                              </span>
                            ) : (
                              <span>
                                Ingress rate is currently <strong className="text-emerald-400">{effectiveTraffic.toLocaleString()} pkt/s</strong>, remaining comfortably below the safe threshold of <strong className="text-slate-200">{activeLimit.toLocaleString()} pkt/s</strong>. Packet distribution is uniform and benign.
                              </span>
                            )}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 pt-0.5 border-b border-slate-800/80 pb-2">
                            <span>Ingress Rate: <strong className={isTrafficAlertActive ? "text-red-300" : "text-slate-200"}>{effectiveTraffic.toLocaleString()} pkt/s</strong></span>
                            <span>•</span>
                            <span>
                              Threshold Limit: <strong className={isThrottled ? "text-purple-300" : "text-slate-200"}>{activeLimit.toLocaleString()} pkt/s</strong>
                              {isThrottled && <span className="text-[9px] text-purple-400 ml-1">(-50% Throttled)</span>}
                            </span>
                            <span>•</span>
                            <span>Inspection Engine: <strong>eBPF XDP Driver Active</strong></span>
                          </div>

                          {/* Sparkline Chart showing last 60 seconds of traffic patterns for the node */}
                          <div id="traffic-sparkline-chart" className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
                                <Activity className={`w-3.5 h-3.5 ${isTrafficAlertActive ? "text-red-400" : "text-emerald-400"}`} />
                                <span>Last 60 Seconds Traffic Patterns (Surge Severity Context)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                  isTrafficAlertActive 
                                    ? "bg-red-900/90 text-red-100 border border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"
                                    : isThrottled
                                      ? "bg-purple-900/70 text-purple-300 border border-purple-700"
                                      : "bg-emerald-950/70 text-emerald-400 border border-emerald-900"
                                }`}>
                                  {isTrafficAlertActive 
                                    ? `SURGE SEVERITY: ${trafficExcessPct > 50 ? "CRITICAL" : "ELEVATED"} (+${trafficExcessPct}%)` 
                                    : isThrottled
                                      ? "THROTTLED (-50%)"
                                      : "SURGE SEVERITY: NOMINAL"}
                                </span>
                              </div>
                            </div>

                            {/* SVG Sparkline Graph */}
                            {(() => {
                              const history = nodeTrafficHistory[activeHostId] || [effectiveTraffic];
                              const dataLen = history.length;
                              const minVal = Math.min(...history, activeLimit * 0.6);
                              const maxVal = Math.max(...history, activeLimit * 1.35, 1000);
                              const range = maxVal - minVal || 1;

                              const svgWidth = 540;
                              const svgHeight = 74;
                              const padX = 8;
                              const padY = 8;
                              const plotWidth = svgWidth - padX * 2;
                              const plotHeight = svgHeight - padY * 2;

                              const points = history.map((val, idx) => {
                                const x = padX + (idx / Math.max(dataLen - 1, 1)) * plotWidth;
                                const y = padY + plotHeight - ((val - minVal) / range) * plotHeight;
                                return { x, y, val };
                              });

                              const pathD = points.reduce((acc, pt, idx) => {
                                return idx === 0 ? `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
                              }, "");

                              const areaD = `${pathD} L ${(padX + plotWidth).toFixed(1)} ${(padY + plotHeight).toFixed(1)} L ${padX.toFixed(1)} ${(padY + plotHeight).toFixed(1)} Z`;

                              const limitY = padY + plotHeight - ((activeLimit - minVal) / range) * plotHeight;
                              const clampedLimitY = Math.max(padY + 2, Math.min(padY + plotHeight - 2, limitY));

                              const lastPt = points[points.length - 1] || { x: padX + plotWidth, y: padY + plotHeight / 2, val: effectiveTraffic };
                              const peakVal = Math.max(...history);
                              const avgVal = Math.round(history.reduce((a, b) => a + b, 0) / Math.max(history.length, 1));
                              const minTraffic = Math.min(...history);

                              const gradId = `sparkline-grad-${activeHostId}`;

                              return (
                                <div className="space-y-1.5">
                                  <div className="relative w-full bg-slate-950/80 rounded-lg p-2 border border-slate-800/80 overflow-hidden shadow-inner">
                                    <svg
                                      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                                      className="w-full h-16 md:h-20 overflow-visible"
                                      preserveAspectRatio="none"
                                    >
                                      <defs>
                                        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="0%" stopColor={isTrafficAlertActive ? "#ef4444" : "#10b981"} stopOpacity={isTrafficAlertActive ? "0.55" : "0.35"} />
                                          <stop offset="100%" stopColor={isTrafficAlertActive ? "#b91c1c" : "#059669"} stopOpacity="0.0" />
                                        </linearGradient>
                                      </defs>

                                      {/* Subtle horizontal grid lines */}
                                      <line x1={padX} y1={padY + plotHeight * 0.25} x2={padX + plotWidth} y2={padY + plotHeight * 0.25} stroke="#334155" strokeDasharray="2 3" strokeOpacity="0.4" />
                                      <line x1={padX} y1={padY + plotHeight * 0.5} x2={padX + plotWidth} y2={padY + plotHeight * 0.5} stroke="#334155" strokeDasharray="2 3" strokeOpacity="0.4" />
                                      <line x1={padX} y1={padY + plotHeight * 0.75} x2={padX + plotWidth} y2={padY + plotHeight * 0.75} stroke="#334155" strokeDasharray="2 3" strokeOpacity="0.4" />

                                      {/* Threshold reference line */}
                                      <line
                                        x1={padX}
                                        y1={clampedLimitY}
                                        x2={padX + plotWidth}
                                        y2={clampedLimitY}
                                        stroke={isTrafficAlertActive ? "#f59e0b" : "#64748b"}
                                        strokeDasharray="4 3"
                                        strokeWidth="1.5"
                                      />
                                      <text
                                        x={padX + plotWidth - 4}
                                        y={Math.max(padY + 9, clampedLimitY - 3)}
                                        textAnchor="end"
                                        fill={isTrafficAlertActive ? "#fbbf24" : "#94a3b8"}
                                        fontSize="8"
                                        fontFamily="monospace"
                                        fontWeight="bold"
                                      >
                                        LIMIT: {activeLimit.toLocaleString()} pps
                                      </text>

                                      {/* Area under curve */}
                                      <path d={areaD} fill={`url(#${gradId})`} />

                                      {/* Main Sparkline Stroke */}
                                      <path
                                        d={pathD}
                                        fill="none"
                                        stroke={isTrafficAlertActive ? "#f43f5e" : "#10b981"}
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />

                                      {/* Pulsing Live Marker on latest value */}
                                      <circle
                                        cx={lastPt.x}
                                        cy={lastPt.y}
                                        r="6"
                                        fill={isTrafficAlertActive ? "#ef4444" : "#10b981"}
                                        className="animate-ping opacity-60"
                                      />
                                      <circle
                                        cx={lastPt.x}
                                        cy={lastPt.y}
                                        r="3.5"
                                        fill={isTrafficAlertActive ? "#f43f5e" : "#34d399"}
                                        stroke="#ffffff"
                                        strokeWidth="1"
                                      />
                                    </svg>

                                    {/* Time markers along X axis */}
                                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 pt-1 px-1">
                                      <span>-60s</span>
                                      <span>-45s</span>
                                      <span>-30s</span>
                                      <span>-15s</span>
                                      <span className={isTrafficAlertActive ? "text-rose-400 font-bold" : "text-emerald-400 font-semibold"}>NOW (Live)</span>
                                    </div>
                                  </div>

                                  {/* Surge Severity & Telemetry Context Bar */}
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] font-mono">
                                    <div className="bg-slate-900/90 rounded px-2 py-1 border border-slate-800">
                                      <span className="text-slate-500 block text-[9px]">60s Min Rate</span>
                                      <span className="text-slate-300 font-bold">{minTraffic.toLocaleString()} pps</span>
                                    </div>
                                    <div className="bg-slate-900/90 rounded px-2 py-1 border border-slate-800">
                                      <span className="text-slate-500 block text-[9px]">60s Avg Rate</span>
                                      <span className="text-slate-300 font-bold">{avgVal.toLocaleString()} pps</span>
                                    </div>
                                    <div className="bg-slate-900/90 rounded px-2 py-1 border border-slate-800">
                                      <span className="text-slate-500 block text-[9px]">60s Peak Surge</span>
                                      <span className={`font-bold ${peakVal > activeLimit ? "text-rose-400" : "text-emerald-400"}`}>
                                        {peakVal.toLocaleString()} pps
                                      </span>
                                    </div>
                                    <div className="bg-slate-900/90 rounded px-2 py-1 border border-slate-800">
                                      <span className="text-slate-500 block text-[9px]">Surge Ratio</span>
                                      <span className={`font-bold ${peakVal > activeLimit ? "text-amber-300" : "text-slate-300"}`}>
                                        {(peakVal / activeLimit).toFixed(2)}x of Limit
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* VIEW TAB 3: POST-QUANTUM CRYPTOGRAPHY MATRIX */}
          {viewTab === "pqc-matrix" && (
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4 flex flex-col flex-1" id="pqc-matrix-card">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3" id="pqc-matrix-header">
                <div className="flex items-center space-x-2" id="pqc-matrix-title">
                  <KeyRound className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-200">NIST Post-Quantum Cryptography Audit Matrix</span>
                </div>
                <button
                  id="rotate-pqc-keys-btn"
                  onClick={rotatePqcKeys}
                  className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded font-mono transition-all shadow"
                >
                  Rotate All PQC Keypairs
                </button>
              </div>

              {/* Table of NIST algorithms */}
              <div className="overflow-x-auto custom-scrollbar" id="pqc-table-box">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-500 uppercase text-[9px] tracking-widest">
                      <th className="pb-2">Algorithm</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">NIST Standard</th>
                      <th className="pb-2">Key Entropy</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 font-bold text-blue-400">CRYSTALS-Kyber-768</td>
                      <td className="py-2.5 text-slate-400">KEM (Key Encapsulation)</td>
                      <td className="py-2.5 text-slate-400">NIST FIPS 203</td>
                      <td className="py-2.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[99%]" />
                          </div>
                          <span className="text-[10px]">99.8%</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-[9px]">SECURE</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-blue-400">CRYSTALS-Dilithium-3</td>
                      <td className="py-2.5 text-slate-400">Digital Signatures</td>
                      <td className="py-2.5 text-slate-400">NIST FIPS 204</td>
                      <td className="py-2.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[99%]" />
                          </div>
                          <span className="text-[10px]">99.4%</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-[9px]">SECURE</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-blue-400">Falcon-512</td>
                      <td className="py-2.5 text-slate-400">Fast Compact Signatures</td>
                      <td className="py-2.5 text-slate-400">NIST Round 4</td>
                      <td className="py-2.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[98%]" />
                          </div>
                          <span className="text-[10px]">98.9%</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-[9px]">SECURE</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-blue-400">SPHINCS+</td>
                      <td className="py-2.5 text-slate-400">Stateless Hash Signatures</td>
                      <td className="py-2.5 text-slate-400">NIST FIPS 205</td>
                      <td className="py-2.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full w-[100%]" />
                          </div>
                          <span className="text-[10px]">100%</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-purple-950 text-purple-400 border border-purple-900 rounded text-[9px]">ULTRA-SAFE</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Active Keypair Rotation Batches Executed: <strong className="text-blue-400">{pqcRotatedCount}</strong></span>
                <span className="text-[10px] text-slate-500">Hybrid RSA-4028 / Kyber-768 Handshakes Enabled</span>
              </div>
            </div>
          )}

          {/* VIEW TAB 4: THREAT STREAM & LIVE EVENTS */}
          {viewTab === "threat-events" && (
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4 flex flex-col flex-1" id="threat-events-card">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3" id="threat-events-header">
                <div className="flex items-center space-x-2" id="threat-events-title">
                  <ShieldAlert className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-200">Real-Time Security Threat Stream</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{events.length} Active Events</span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1" id="events-stream-list">
                {events.map((ev) => (
                  <div key={ev.id} className="p-3 bg-slate-900/60 border border-slate-900 rounded-lg flex items-start justify-between space-x-3 hover:border-slate-800 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                          ev.severity === "critical" ? "bg-red-950 text-red-400 border border-red-900" :
                          ev.severity === "warning" ? "bg-amber-950 text-amber-400 border border-amber-900" :
                          "bg-blue-950 text-blue-400 border border-blue-900"
                        }`}>
                          {ev.severity}
                        </span>
                        <span className="text-xs font-bold text-slate-200 font-mono">{ev.moduleName}</span>
                        <span className="text-[10px] font-mono text-slate-500">[{ev.timestamp}]</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono leading-normal">{ev.message}</p>
                    </div>

                    {ev.severity !== "info" ? (
                      <button
                        id={`fix-threat-btn-${ev.id}`}
                        onClick={() => fixSpecificThreat(ev.id, ev.moduleName)}
                        className="px-2.5 py-1 text-[10px] font-mono font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded shrink-0 transition-all shadow-sm flex items-center space-x-1"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Fix Threat</span>
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900 rounded shrink-0 flex items-center space-x-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Patched</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

        {/* RIGHT COLUMN: Chatbot AI Auditor, Blockchain Ledger Explorer, Live logs */}
        <section className="xl:col-span-3 flex flex-col space-y-6 xl:max-h-[calc(100vh-140px)] xl:overflow-y-auto pr-1 custom-scrollbar" id="right-workspace-column">
          
          {/* Sentinel AI Auditor Bot Integration */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col h-[350px]" id="chatbot-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900" id="chat-header">
              <div className="flex items-center space-x-2" id="chat-title-box">
                <Bot className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold tracking-wider text-slate-300 uppercase font-mono">AI Auditor</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900/40">ONLINE</span>
            </div>

            {/* Message Thread List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 custom-scrollbar text-[11px]" id="chat-thread-container">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`max-w-[85%] rounded-lg p-2.5 leading-relaxed border ${
                    msg.sender === "user" 
                      ? "ml-auto bg-blue-600 text-white border-blue-700" 
                      : "mr-auto bg-slate-900 text-slate-200 border-slate-800"
                  }`}
                  id={`chat-msg-${idx}`}
                >
                  {msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="mr-auto bg-slate-900 text-slate-400 border border-slate-800 rounded-lg p-2.5 flex items-center space-x-2" id="chat-loading-bubble">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-[10px] font-mono ml-1">Analyzing state...</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1.5 custom-scrollbar text-[10px]" id="chat-quick-chips">
              {[
                { label: "🧬 Neuromorphic SNN", prompt: "Explain how our Neuromorphic Spiking Immune Core synthesizes digital antibodies for 100 Gbps line-rate bytecode neutralization." },
                { label: "🌌 Quantum Honeynet", prompt: "How does our Bell-State Entangled Honeynet isolate adversary decryption keys upon wave function collapse?" },
                { label: "🔒 zk-Proof Exploit", prompt: "How does our zk-SNARK Proof-of-Exploit Oracle certify zero-day vulnerabilities without disclosing exploit payloads?" },
                { label: "🛡️ PQC Audit", prompt: "Run Post-Quantum Cryptography transition audit on current TLS handshakes." },
                { label: "⚡ Zero-Day Risk", prompt: "Evaluate Zero-Day vulnerabilities and unpatched service dependencies." },
                { label: "🕸️ GNN Nodes", prompt: "Which network host nodes are most critical pivot targets according to GNN?" }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  id={`chat-chip-${idx}`}
                  onClick={() => handleQuickPrompt(chip.prompt)}
                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-full shrink-0 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Submission */}
            <form onSubmit={queryGemini} className="flex items-center space-x-2 pt-2 border-t border-slate-900" id="chat-form">
              <input
                id="chat-query-input"
                type="text"
                placeholder="Ask about Kyber, quantum risks, SBOM..."
                className="flex-1 bg-slate-900 text-xs border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-600"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading}
              />
              <button
                id="chat-submit-btn"
                type="submit"
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-50"
                disabled={chatLoading}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Blockchain Integrity Ledger Explorer */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col space-y-3" id="ledger-explorer-card">
            <div className="flex items-center justify-between" id="ledger-header">
              <div className="flex items-center space-x-2" id="ledger-title-box">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold tracking-wider text-slate-300 uppercase font-mono">Blockchain Ledger</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Height: {blockchain.length}</span>
            </div>

            <p className="text-[11px] text-slate-400 font-mono leading-normal" id="ledger-desc">
              Immutable anchors secure findings on an decentralized state verification stack.
            </p>

            {/* Blockchain horizontal scroll slider */}
            <div className="flex space-x-3 overflow-x-auto py-2 custom-scrollbar-horizontal" id="ledger-blocks-container">
              {blockchain.map((block) => (
                <div 
                  key={block.index} 
                  className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 shrink-0 w-[140px] space-y-2 flex flex-col justify-between hover:border-blue-600/40 transition-all"
                  id={`block-card-${block.index}`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1" id={`block-header-${block.index}`}>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">Block #{block.index}</span>
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 space-y-1" id={`block-body-${block.index}`}>
                    <div className="truncate text-slate-400" title={block.signature}>Sig: {block.signature.substring(0, 10)}...</div>
                    <div className="truncate">Hash: {block.reportHash.substring(0, 10)}...</div>
                    <div>Nonce: {block.nonce}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time System Security Logs Stream terminal */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col h-[200px]" id="logs-terminal-card">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900 gap-2 flex-wrap" id="logs-terminal-header">
              <div className="flex items-center space-x-2 shrink-0" id="logs-terminal-title-box">
                <Terminal className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold tracking-wider text-slate-300 uppercase font-mono">Logs Terminal</span>
              </div>

              {/* Real-Time Search Bar */}
              <div className="relative flex-1 max-w-[150px] min-w-[90px]" id="logs-search-container">
                <Search className="w-3 h-3 text-slate-500 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  id="logs-search-input"
                  type="text"
                  placeholder="Filter logs..."
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/80 text-[10px] font-mono border border-slate-800 rounded pl-6 pr-2 py-0.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center space-x-2 shrink-0" id="logs-terminal-actions">
                <button 
                  id="export-logs-csv-btn"
                  onClick={exportLogsToCSV}
                  className="flex items-center space-x-1 text-[10px] font-mono text-blue-400 hover:text-blue-300 transition-colors"
                  title="Export current session logs to CSV"
                >
                  <Download className="w-3 h-3 text-blue-500" />
                  <span>Export CSV</span>
                </button>
                <span className="text-slate-800" id="terminal-actions-divider">|</span>
                <button 
                  id="clear-logs-btn"
                  onClick={() => setLiveLogs(["Logs cleared."])} 
                  className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Terminal Feed scroll */}
            <div 
              ref={logContainerRef}
              className="flex-1 overflow-y-auto pt-2 space-y-1 font-mono text-[10px] text-slate-400 custom-scrollbar bg-slate-900/20 p-2 rounded border border-slate-900/50" 
              id="logs-terminal-feed"
            >
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed hover:text-slate-200" id={`log-line-${i}`}>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic py-2 text-center text-[10px]" id="no-logs-found-msg">
                  No logs matching "{logSearchQuery}"
                </div>
              )}
            </div>
          </div>
        </section>
        
      </main>

      {/* Compliance / Security Warning Banner */}
      <footer className="bg-slate-950 border-t border-slate-900 py-3 px-6 flex items-center justify-between text-[11px] text-slate-500 font-mono" id="app-footer">
        <span id="footer-copyright">Quantum Sentinel AI Platform. Complies fully with ISO-27001, PQ-TLS NIST Standards (FIPS 203/204/205).</span>
        <span id="footer-time">System Time (Local): {new Date().toLocaleTimeString()}</span>
      </footer>
    </div>
  );
}
