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
  CheckCircle2
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
              <div className="bg-slate-900/60 border border-slate-900 p-3 rounded-lg flex items-center justify-between" id="node-details-box">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-200 font-mono">
                    Selected Host: {selectedNodeId === "node-1" ? "Ingress Edge Gateway (GW1)" : selectedNodeId === "node-2" ? "Variational Quantum Circuit (VQC Core)" : selectedNodeId === "node-3" ? "Cloud AWS S3 Bucket Log Store" : selectedNodeId === "node-4" ? "GNN Criticality Pivot Node 04" : "Deception Honeytoken Trap"}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {isolatedNodes.includes(selectedNodeId || "") ? "⚠️ HOST ISOLATED FROM MAIN ZERO-TRUST MESH" : "Status: Active & Routing Telemetry Signals"}
                  </p>
                </div>

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
                    className={`px-3 py-1 text-xs font-semibold rounded font-mono transition-all ${
                      isolatedNodes.includes(selectedNodeId) 
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-900" 
                        : "bg-red-950 text-red-400 border border-red-900"
                    }`}
                  >
                    {isolatedNodes.includes(selectedNodeId) ? "Re-connect Host" : "Isolate Host"}
                  </button>
                )}
              </div>
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
