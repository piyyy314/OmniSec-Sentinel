import React, { useState, useMemo, useEffect, useRef } from "react";
import * as d3 from "d3";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Cell,
  ReferenceLine,
  CartesianGrid
} from "recharts";
import { 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  Grid3X3, 
  BarChart3, 
  Sparkles, 
  Layers,
  ArrowUpRight,
  Filter,
  ShieldAlert,
  Activity,
  Clock,
  TrendingUp,
  Zap,
  ChevronDown,
  Eye,
  EyeOff,
  Radio,
  Sliders
} from "lucide-react";
import { ModuleDef, SecurityEvent } from "./types";
import { ALL_MODULES } from "./data";

interface ThreatDensityHeatmapProps {
  modules?: ModuleDef[];
  events: SecurityEvent[];
  activeModuleId: number;
  onSelectModule: (module: ModuleDef) => void;
  onSimulateBurst?: () => void;
}

export interface ModuleThreatData {
  module: ModuleDef;
  totalEvents: number;
  criticalEvents: number;
  warningEvents: number;
  infoEvents: number;
  densityScore: number; // 0 - 100 integer rounded
  exactRiskScore: number; // Exact precise risk score
  activeThreats: number; // Active critical + warning threats
  riskZone: "high" | "elevated" | "nominal";
  lastEventMessage?: string;
  lastEventTime?: string;
  lastScannedTimestamp: string;
}

// Module Archetype classification: Quantum, Neural, Blockchain, Classic
export type ModuleArchetype = "Quantum" | "Neural" | "Blockchain" | "Classic";
export type RiskNodeFilterType = "All" | ModuleArchetype;

export function getModuleArchetype(m: ModuleDef): ModuleArchetype {
  // 1. Quantum Archetype
  if (
    m.category === "Quantum" ||
    m.name.toLowerCase().includes("quantum") ||
    m.name.toLowerCase().startsWith("q")
  ) {
    return "Quantum";
  }

  // 2. Blockchain Archetype
  if (
    m.name.toLowerCase().includes("blockchain") ||
    m.name.toLowerCase().includes("zk-snark") ||
    m.name.toLowerCase().includes("executive report") ||
    m.description.toLowerCase().includes("blockchain") ||
    m.description.toLowerCase().includes("ledger") ||
    m.technicalDetails.toLowerCase().includes("blockchain") ||
    m.technicalDetails.toLowerCase().includes("ledger")
  ) {
    return "Blockchain";
  }

  // 3. Neural Archetype
  if (
    m.category === "Neural & ML" ||
    m.name.toLowerCase().includes("neural") ||
    m.name.toLowerCase().includes("neuromorphic") ||
    m.name.toLowerCase().includes("causal") ||
    m.name.toLowerCase().includes("zero-day") ||
    m.name.toLowerCase().includes("fuzzer") ||
    m.name.toLowerCase().includes("anomaly") ||
    m.name.toLowerCase().includes("llm")
  ) {
    return "Neural";
  }

  // 4. Classic Archetype (Traditional defensive port scanning, IDS, file integrity, honeytokens, auditing)
  return "Classic";
}

// Threat Velocity Point representing rate of change in threat frequency over the 60-second window
export interface ThreatVelocityPoint {
  second: number; // -59 to 0
  label: string; // e.g. "-45s", "Now"
  time: string; // formatted timestamp
  frequency: number; // raw threat frequency (events/sec in sample window)
  velocity: number; // rate of change in threat frequency: dF/dt (ev/s)
  acceleration: number; // rate of change in velocity: dV/dt (ev/s²)
  isEscalating: boolean; // exceeds escalation threshold
}

// Baseline event distribution seeded across 27+ modules for rich cybersecurity telemetry
const BASELINE_EVENT_COUNTS: Record<number, { critical: number; warning: number; info: number; lastMsg: string }> = {
  1: { critical: 0, warning: 2, info: 5, lastMsg: "Ansatz parameter convergence drift noted" },
  2: { critical: 1, warning: 4, info: 3, lastMsg: "High SNR beacon detected on port 4220" },
  3: { critical: 2, warning: 5, info: 4, lastMsg: "Deprecated RSA-1024 handshake observed in DMZ" },
  4: { critical: 0, warning: 1, info: 6, lastMsg: "Hamiltonian traversal path computed" },
  5: { critical: 1, warning: 3, info: 2, lastMsg: "Simulated Grover oracle probe executed" },
  6: { critical: 0, warning: 2, info: 7, lastMsg: "Node pivot centrality score shifted +14%" },
  7: { critical: 2, warning: 4, info: 3, lastMsg: "Unpatched CVE forecasted in upstream lib" },
  8: { critical: 1, warning: 2, info: 4, lastMsg: "Fuzzer payload mutation triggered bypass" },
  9: { critical: 0, warning: 0, info: 8, lastMsg: "Block signature verified against ledger" },
  10: { critical: 0, warning: 3, info: 5, lastMsg: "Open port 8089 detected on secondary NIC" },
  11: { critical: 1, warning: 4, info: 6, lastMsg: "Heuristic YARA regex hit on ingress packet" },
  12: { critical: 0, warning: 2, info: 4, lastMsg: "L1 CPU cache speculative timing variance" },
  13: { critical: 0, warning: 1, info: 5, lastMsg: "SHA-256 binary hash baseline matched" },
  14: { critical: 1, warning: 3, info: 3, lastMsg: "Outlier behavioral vector scored 88th percentile" },
  15: { critical: 1, warning: 3, info: 2, lastMsg: "Pre-quantum key exchange flagged in legacy service" },
  16: { critical: 0, warning: 2, info: 4, lastMsg: "Red/Blue alignment blueprint updated" },
  17: { critical: 0, warning: 1, info: 5, lastMsg: "AutoML mutation generation cycle #42 nominal" },
  18: { critical: 1, warning: 2, info: 3, lastMsg: "Fake SSH honeypot decoy pinged from external IP" },
  19: { critical: 1, warning: 3, info: 4, lastMsg: "SBOM transitive dependency vulnerability" },
  20: { critical: 2, warning: 5, info: 2, lastMsg: "QGAN shellcode mutation evasion rating high" },
  21: { critical: 3, warning: 6, info: 3, lastMsg: "Dark web forum zero-day exploit chatter detected" },
  22: { critical: 0, warning: 1, info: 5, lastMsg: "Reinforcement learning policy weights updated" },
  23: { critical: 2, warning: 4, info: 2, lastMsg: "Covert timing channel anomaly isolated" },
  24: { critical: 0, warning: 0, info: 7, lastMsg: "Causal inquiry telemetry prompt completed" },
  25: { critical: 0, warning: 0, info: 6, lastMsg: "Executive cryptographic snapshot generated" },
  26: { critical: 0, warning: 2, info: 9, lastMsg: "Telemetry streaming pipeline nominal" },
  27: { critical: 3, warning: 5, info: 2, lastMsg: "Publicly readable AWS S3 backup bucket detected" },
  28: { critical: 0, warning: 1, info: 6, lastMsg: "LIF neuromorphic spike train rate nominal" },
  29: { critical: 1, warning: 2, info: 5, lastMsg: "Entangled honeynet decoy wave function intact" },
  30: { critical: 0, warning: 1, info: 4, lastMsg: "Structural causal model do-calculus verified" },
  31: { critical: 0, warning: 2, info: 7, lastMsg: "Polymorphic binary AST mutated without latency" },
  32: { critical: 0, warning: 1, info: 5, lastMsg: "Casimir noise injection cloaking cache channels" },
  33: { critical: 0, warning: 0, info: 8, lastMsg: "zk-SNARK exploit proof generated and verified" },
  34: { critical: 1, warning: 3, info: 4, lastMsg: "Ultrasonic covert acoustic carrier suppressed" },
  35: { critical: 1, warning: 2, info: 7, lastMsg: "SwarmMesh peer agents active across edge zones" }
};

// Rate of change escalation threshold in events/sec
export const ESCALATION_THRESHOLD_VELOCITY = 2.5;

export const ThreatDensityHeatmap: React.FC<ThreatDensityHeatmapProps> = ({
  modules = ALL_MODULES,
  events,
  activeModuleId,
  onSelectModule,
  onSimulateBurst
}) => {
  const [viewMode, setViewMode] = useState<"matrix" | "ranked">("matrix");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [archetypeFilter, setArchetypeFilter] = useState<RiskNodeFilterType>("All");
  const [onlyHighRisk, setOnlyHighRisk] = useState<boolean>(false);
  const [hoveredModule, setHoveredModule] = useState<ModuleThreatData | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Threat Velocity Overlay State
  const [showVelocityOverlay, setShowVelocityOverlay] = useState<boolean>(true);
  const [overlayStyle, setOverlayStyle] = useState<"docked" | "translucent">("docked");
  const [manualSurgeBonus, setManualSurgeBonus] = useState<number>(0);
  const lastEventCountRef = useRef<number>(events.length);

  // Generate initial 60-second sliding history buffer (-59s to 0s)
  const [velocityHistory, setVelocityHistory] = useState<ThreatVelocityPoint[]>(() => {
    const points: ThreatVelocityPoint[] = [];
    const now = Date.now();
    let prevFreq = 2.1;
    let prevVel = 0.2;

    for (let i = 59; i >= 0; i--) {
      const secOffset = -i;
      const pointTime = new Date(now - i * 1000);
      const timeStr = pointTime.toTimeString().split(" ")[0];
      const label = secOffset === 0 ? "Now" : `-${i}s`;

      // Seed realistic frequency with gentle oscillations and a simulated mid-window ripple
      const wave = Math.sin(i / 5) * 0.8;
      const microJitter = ((i * 13) % 7) * 0.15;
      const burstPeak = (i >= 18 && i <= 24) ? (24 - i) * 0.9 : 0;
      const freq = Number(Math.max(0.8, 2.2 + wave + microJitter + burstPeak).toFixed(2));
      
      const velocity = Number((freq - prevFreq).toFixed(2));
      const acceleration = Number((velocity - prevVel).toFixed(2));
      const isEscalating = velocity >= ESCALATION_THRESHOLD_VELOCITY;

      prevFreq = freq;
      prevVel = velocity;

      points.push({
        second: secOffset,
        label,
        time: timeStr,
        frequency: freq,
        velocity,
        acceleration,
        isEscalating
      });
    }
    return points;
  });

  // Track live threat events to calculate real-time rate of change velocity
  useEffect(() => {
    const interval = setInterval(() => {
      setVelocityHistory(prev => {
        if (prev.length === 0) return prev;
        const lastPoint = prev[prev.length - 1];
        const now = Date.now();
        const timeStr = new Date(now).toTimeString().split(" ")[0];

        // Did new events arrive since last tick?
        const eventDelta = Math.max(0, events.length - lastEventCountRef.current);
        lastEventCountRef.current = events.length;

        // Base frequency oscillation + live event injection + any active manual surge
        const wave = Math.sin(Date.now() / 6000) * 0.6;
        const randomFluctuation = (Math.random() - 0.5) * 0.4;
        const burstFactor = eventDelta * 3.5 + manualSurgeBonus;

        const currentFreq = Number(Math.max(0.6, 2.3 + wave + randomFluctuation + burstFactor).toFixed(2));
        const velocity = Number((currentFreq - lastPoint.frequency).toFixed(2));
        const acceleration = Number((velocity - lastPoint.velocity).toFixed(2));
        const isEscalating = velocity >= ESCALATION_THRESHOLD_VELOCITY;

        // Shift window forward by 1 second
        const shifted = prev.slice(1).map((pt, idx) => ({
          ...pt,
          second: -(59 - idx),
          label: idx === 58 ? "-1s" : `-${59 - idx}s`
        }));

        shifted.push({
          second: 0,
          label: "Now",
          time: timeStr,
          frequency: currentFreq,
          velocity,
          acceleration,
          isEscalating
        });

        return shifted;
      });

      // Decay manual surge bonus smoothly
      setManualSurgeBonus(prev => Math.max(0, Number((prev * 0.75).toFixed(2))));
    }, 1000);

    return () => clearInterval(interval);
  }, [events.length, manualSurgeBonus]);

  // Trigger simulated sudden velocity surge to showcase escalation pattern detection
  const triggerVelocitySurge = () => {
    setManualSurgeBonus(6.8);
    if (onSimulateBurst) {
      onSimulateBurst();
    }
  };

  // Derive current velocity, peak, and escalation status from the 60s window
  const latestVelocityPoint = velocityHistory[velocityHistory.length - 1] || {
    velocity: 0.4,
    acceleration: 0.1,
    frequency: 2.4,
    isEscalating: false
  };

  const currentVelocity = latestVelocityPoint.velocity;
  const currentAcceleration = latestVelocityPoint.acceleration;
  const peakVelocity60s = useMemo(() => {
    return Math.max(...velocityHistory.map(p => p.velocity));
  }, [velocityHistory]);

  const recentEscalationsCount = useMemo(() => {
    // Check points in the last 15 seconds
    return velocityHistory.slice(-15).filter(p => p.isEscalating).length;
  }, [velocityHistory]);

  const isRapidEscalation = latestVelocityPoint.isEscalating || recentEscalationsCount >= 2;

  // Compute live threat density metrics for each module
  const moduleDataList: ModuleThreatData[] = useMemo(() => {
    return modules.map(m => {
      const base = BASELINE_EVENT_COUNTS[m.id] || { critical: 0, warning: 1, info: 2, lastMsg: "Nominal telemetry" };
      
      // Correlate with real-time live events
      const liveEventsForMod = events.filter(e => e.moduleId === m.id);
      const liveCritical = liveEventsForMod.filter(e => e.severity === "critical").length;
      const liveWarning = liveEventsForMod.filter(e => e.severity === "warning").length;
      const liveInfo = liveEventsForMod.filter(e => e.severity === "info").length;

      const totalCritical = base.critical + liveCritical;
      const totalWarning = base.warning + liveWarning;
      const totalInfo = base.info + liveInfo;
      const totalEvents = totalCritical + totalWarning + totalInfo;

      // Active threats = total actionable critical and warning events
      const activeThreats = totalCritical + totalWarning;

      // Exact Risk Score calculation: Critical = 21.5pts, Warning = 9.8pts, Info = 2.2pts + deterministic micro-variance
      const rawScore = (totalCritical * 21.5) + (totalWarning * 9.8) + (totalInfo * 2.2) + ((m.id * 11) % 5) * 0.4;
      const exactRiskScore = Number(Math.min(99.4, Math.max(7.2, rawScore)).toFixed(1));
      const densityScore = Math.round(exactRiskScore);

      let riskZone: "high" | "elevated" | "nominal" = "nominal";
      if (exactRiskScore >= 65 || totalCritical >= 2) {
        riskZone = "high";
      } else if (exactRiskScore >= 35 || totalWarning >= 3) {
        riskZone = "elevated";
      }

      const latestLive = liveEventsForMod[0];
      const lastMsg = latestLive?.message || base.lastMsg;
      
      // Determine formatted last scanned timestamp
      let lastScannedTimestamp: string;
      if (latestLive?.timestamp) {
        if (latestLive.timestamp.includes("T")) {
          const d = new Date(latestLive.timestamp);
          lastScannedTimestamp = !isNaN(d.getTime()) 
            ? d.toISOString().replace("T", " ").substring(0, 19) + " UTC" 
            : latestLive.timestamp;
        } else if (latestLive.timestamp.includes(":")) {
          lastScannedTimestamp = `2026-09-28 ${latestLive.timestamp} UTC`;
        } else {
          lastScannedTimestamp = latestLive.timestamp;
        }
      } else {
        // Deterministic baseline scan timestamp (recent automated audit cycle)
        const staggerMinutes = ((m.id * 7 + 11) % 45) + 3;
        const baselineDate = new Date(Date.now() - staggerMinutes * 60 * 1000);
        const yyyy = baselineDate.getUTCFullYear();
        const mm = String(baselineDate.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(baselineDate.getUTCDate()).padStart(2, "0");
        const hours = String(baselineDate.getUTCHours()).padStart(2, "0");
        const mins = String(baselineDate.getUTCMinutes()).padStart(2, "0");
        const secs = String(baselineDate.getUTCSeconds()).padStart(2, "0");
        lastScannedTimestamp = `${yyyy}-${mm}-${dd} ${hours}:${mins}:${secs} UTC`;
      }

      return {
        module: m,
        totalEvents,
        criticalEvents: totalCritical,
        warningEvents: totalWarning,
        infoEvents: totalInfo,
        densityScore,
        exactRiskScore,
        activeThreats,
        riskZone,
        lastEventMessage: lastMsg,
        lastEventTime: latestLive?.timestamp || "Live Monitor",
        lastScannedTimestamp
      };
    });
  }, [modules, events]);

  // Archetype distribution counts for the dropdown badges
  const archetypeCounts = useMemo(() => {
    const counts = {
      All: modules.length,
      Quantum: 0,
      Neural: 0,
      Blockchain: 0,
      Classic: 0
    };
    modules.forEach(m => {
      const arch = getModuleArchetype(m);
      counts[arch] = (counts[arch] || 0) + 1;
    });
    return counts;
  }, [modules]);

  // Filter modules based on archetype dropdown filter, category tabs, and high-risk toggles
  const filteredData = useMemo(() => {
    return moduleDataList.filter(item => {
      const matchesArchetype = archetypeFilter === "All" || getModuleArchetype(item.module) === archetypeFilter;
      const matchesCat = categoryFilter === "All" || item.module.category === categoryFilter;
      const matchesRisk = !onlyHighRisk || item.riskZone === "high";
      return matchesArchetype && matchesCat && matchesRisk;
    });
  }, [moduleDataList, archetypeFilter, categoryFilter, onlyHighRisk]);

  // High-risk zone statistics
  const highRiskModules = useMemo(() => {
    return moduleDataList.filter(d => d.riskZone === "high");
  }, [moduleDataList]);

  const elevatedRiskModules = useMemo(() => {
    return moduleDataList.filter(d => d.riskZone === "elevated");
  }, [moduleDataList]);

  // D3 Color interpolator for smooth cyber threat heat mapping
  const d3ColorScale = useMemo(() => {
    const interpolator = d3.interpolateRgbBasis([
      "#0f1d32", // Nominal low cold
      "#0369a1", // Moderate blue
      "#0284c7", // Bright cyan
      "#d97706", // Elevated amber
      "#f97316", // High orange
      "#ef4444", // Critical Red
      "#b91c1c"  // Severe Crimson
    ]);
    return (score: number) => interpolator(Math.min(1, Math.max(0, score / 100)));
  }, []);

  // Sorted list for ranked view
  const rankedData = useMemo(() => {
    return [...filteredData].sort((a, b) => b.densityScore - a.densityScore);
  }, [filteredData]);

  return (
    <div 
      className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4 shadow-xl relative"
      id="threat-density-heatmap-card"
    >
      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3" id="heatmap-header">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-100 flex items-center gap-1.5">
              <span>Threat Density Heatmap</span>
              <span className="text-[10px] font-normal text-slate-500 font-mono">· {filteredData.length}/{modules.length} Nodes</span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Frequency mapping of live security anomalies, risk density & 60-second escalation velocity
          </p>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Threat Velocity Line Chart Overlay Toggle Button */}
          <button
            id="toggle-threat-velocity-btn"
            data-testid="toggle-threat-velocity-btn"
            onClick={() => setShowVelocityOverlay(prev => !prev)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-mono font-medium rounded transition-all border ${
              showVelocityOverlay
                ? isRapidEscalation
                  ? "bg-red-950/80 text-red-200 border-red-700 shadow-md shadow-red-950/50"
                  : "bg-cyan-950/80 text-cyan-300 border-cyan-700 shadow-md shadow-cyan-950/40"
                : "bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800"
            }`}
            title="Toggle secondary Threat Velocity (dF/dt) line chart overlay over the last 60 seconds"
          >
            <Activity className={`w-3.5 h-3.5 ${isRapidEscalation ? "text-red-400 animate-pulse" : "text-cyan-400"}`} />
            <span>Threat Velocity</span>
            <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
              showVelocityOverlay 
                ? (isRapidEscalation ? "bg-red-900 text-red-100 animate-pulse" : "bg-cyan-900 text-cyan-200") 
                : "bg-slate-800 text-slate-500"
            }`}>
              {showVelocityOverlay ? `${currentVelocity > 0 ? "+" : ""}${currentVelocity.toFixed(1)} ev/s` : "OFF"}
            </span>
          </button>

          {/* Simulate Burst / Spike */}
          {onSimulateBurst && (
            <button
              id="simulate-threat-burst-btn"
              onClick={triggerVelocitySurge}
              className="flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-mono font-medium text-amber-300 bg-amber-950/40 border border-amber-800/60 hover:bg-amber-900/40 rounded transition-all"
              title="Inject random anomalous security telemetry & induce rapid escalation velocity surge"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Simulate Spike</span>
            </button>
          )}

          {/* Matrix vs Ranked View Mode Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5" id="view-mode-toggle">
            <button
              id="view-mode-matrix-btn"
              onClick={() => setViewMode("matrix")}
              className={`flex items-center space-x-1 px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                viewMode === "matrix" 
                  ? "bg-blue-600 text-white font-semibold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Matrix Grid View"
            >
              <Grid3X3 className="w-3 h-3" />
              <span>Matrix</span>
            </button>
            <button
              id="view-mode-ranked-btn"
              onClick={() => setViewMode("ranked")}
              className={`flex items-center space-x-1 px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                viewMode === "ranked" 
                  ? "bg-blue-600 text-white font-semibold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Ranked Distribution View"
            >
              <BarChart3 className="w-3 h-3" />
              <span>Ranked</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Risk Zone Alert Summary Banner */}
      <div 
        className={`p-3 rounded-lg border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
          highRiskModules.length > 0 
            ? "bg-red-950/20 border-red-900/50 text-red-200" 
            : "bg-slate-900/40 border-slate-900 text-slate-300"
        }`}
        id="high-risk-zones-banner"
      >
        <div className="flex items-start space-x-2.5">
          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${highRiskModules.length > 0 ? "text-red-400 animate-bounce" : "text-emerald-400"}`} />
          <div className="space-y-0.5">
            <div className="font-semibold text-slate-200 flex items-center gap-2">
              <span>{highRiskModules.length} High-Risk Zones Flagged</span>
              <span className="text-[10px] text-slate-500">·</span>
              <span className="text-[10px] text-amber-400">{elevatedRiskModules.length} Elevated</span>
              <span className="text-[10px] text-slate-500">·</span>
              <span className="text-[10px] text-emerald-400">{modules.length - highRiskModules.length - elevatedRiskModules.length} Nominal</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {highRiskModules.length > 0 
                ? `Critical event clustering detected in: ${highRiskModules.slice(0, 3).map(m => `#${m.module.id} ${m.module.name}`).join(", ")}${highRiskModules.length > 3 ? "..." : ""}`
                : `All ${modules.length} defensive modules operating within baseline threat tolerance levels.`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
          <button
            id="toggle-only-high-risk-btn"
            onClick={() => setOnlyHighRisk(prev => !prev)}
            className={`px-2 py-1 text-[10px] font-mono rounded border transition-all ${
              onlyHighRisk 
                ? "bg-red-600 text-white border-red-500 font-semibold" 
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
            }`}
          >
            {onlyHighRisk ? `Show All ${modules.length}` : "Filter High-Risk Only"}
          </button>
          
          {highRiskModules.length > 0 && (
            <button
              id="inspect-highest-risk-btn"
              onClick={() => {
                const highest = [...highRiskModules].sort((a, b) => b.densityScore - a.densityScore)[0];
                if (highest) onSelectModule(highest.module);
              }}
              className="px-2 py-1 text-[10px] font-mono rounded bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 transition-colors flex items-center space-x-1"
            >
              <span>Inspect #1 Risk</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* DROPDOWN FILTER: Toggle visibility between 'Quantum', 'Neural', 'Blockchain', and 'Classic' module risk nodes */}
      <div 
        className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-900"
        id="heatmap-archetype-filter-bar"
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Dropdown Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <label htmlFor="risk-node-archetype-dropdown" className="text-[11px] font-mono text-slate-300 font-medium">
              Module Node Filter:
            </label>
            <div className="relative">
              <select
                id="risk-node-archetype-dropdown"
                data-testid="risk-node-dropdown-filter"
                value={archetypeFilter}
                onChange={(e) => setArchetypeFilter(e.target.value as RiskNodeFilterType)}
                className="bg-slate-950 border border-slate-700 hover:border-slate-500 text-slate-100 text-xs font-mono rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none shadow-sm transition-colors"
              >
                <option value="All">All Risk Nodes ({archetypeCounts.All})</option>
                <option value="Quantum">Quantum ({archetypeCounts.Quantum} nodes)</option>
                <option value="Neural">Neural ({archetypeCounts.Neural} nodes)</option>
                <option value="Blockchain">Blockchain ({archetypeCounts.Blockchain} nodes)</option>
                <option value="Classic">Classic ({archetypeCounts.Classic} nodes)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Quick Archetype Pills for 1-Click Toggling */}
          <div className="flex items-center space-x-1" id="archetype-quick-toggle-group">
            {(["All", "Quantum", "Neural", "Blockchain", "Classic"] as const).map(type => {
              const isActive = archetypeFilter === type;
              return (
                <button
                  key={type}
                  id={`archetype-btn-${type.toLowerCase()}`}
                  onClick={() => setArchetypeFilter(type)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                    isActive
                      ? "bg-blue-600 text-white font-bold shadow-sm ring-1 ring-blue-400/50"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 bg-slate-950/60 border border-slate-800/80"
                  }`}
                >
                  {type}
                  {type !== "All" && (
                    <span className="ml-1 opacity-70 text-[9px]">
                      ({archetypeCounts[type]})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Clutter Reduction Metric */}
        <div className="flex items-center space-x-2 text-[10px] font-mono shrink-0">
          <span className="text-slate-500">Visible:</span>
          <span className="text-slate-200 font-bold">{filteredData.length}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{modules.length} Nodes</span>
          {archetypeFilter !== "All" && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[9px] font-medium animate-in fade-in">
              Clutter reduced by {modules.length - filteredData.length} nodes
            </span>
          )}
        </div>
      </div>

      {/* SECONDARY 'THREAT VELOCITY' LINE CHART OVERLAY (Rate of Change over Last 60 Seconds) */}
      {showVelocityOverlay && (
        <div 
          className={`rounded-xl border transition-all duration-200 space-y-2.5 overflow-hidden ${
            isRapidEscalation 
              ? "bg-red-950/30 border-red-800/80 shadow-lg shadow-red-950/40" 
              : "bg-slate-900/40 border-slate-800/80 shadow-md"
          } ${
            overlayStyle === "translucent" 
              ? "p-4 backdrop-blur-md" 
              : "p-4"
          }`}
          id="threat-velocity-overlay"
          data-testid="threat-velocity-line-chart"
        >
          {/* Velocity Overlay Header: Rate Metrics, Escalation Detection & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800/80 pb-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center space-x-2">
                <TrendingUp className={`w-4 h-4 ${isRapidEscalation ? "text-red-400 animate-pulse" : "text-cyan-400"}`} />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-100">
                  Threat Velocity Overlay (dF/dt)
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  · Last 60 Seconds
                </span>
              </div>

              {/* Dynamic Rapid Escalation Alert Indicator */}
              {isRapidEscalation ? (
                <div 
                  id="rapid-escalation-alert" 
                  data-testid="rapid-escalation-status"
                  className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-red-900/70 border border-red-500 rounded-full text-red-200 text-[10px] font-mono font-bold animate-pulse shadow-sm shadow-red-900"
                >
                  <AlertTriangle className="w-3 h-3 text-red-300" />
                  <span>RAPID ESCALATION DETECTED ({currentVelocity > 0 ? "+" : ""}{currentVelocity.toFixed(2)} ev/s)</span>
                </div>
              ) : (
                <div 
                  id="threat-velocity-status" 
                  data-testid="rapid-escalation-status"
                  className="flex items-center space-x-1.5 px-2 py-0.5 bg-emerald-950/70 border border-emerald-700/60 rounded-full text-emerald-300 text-[10px] font-mono"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>VELOCITY STABLE ({currentVelocity > 0 ? "+" : ""}{currentVelocity.toFixed(2)} ev/s)</span>
                </div>
              )}
            </div>

            {/* Velocity Telemetry Stats & Action Triggers */}
            <div className="flex items-center space-x-3 text-[11px] font-mono shrink-0">
              <div className="flex items-center space-x-3 text-slate-300">
                <span>
                  <strong className="text-slate-500">Rate:</strong>{" "}
                  <span className={`font-bold ${isRapidEscalation ? "text-red-400" : "text-cyan-300"}`}>
                    {currentVelocity > 0 ? "+" : ""}{currentVelocity.toFixed(2)} ev/s
                  </span>
                </span>
                <span className="hidden sm:inline">
                  <strong className="text-slate-500">Acc:</strong>{" "}
                  <span className="text-amber-300 font-semibold">
                    {currentAcceleration > 0 ? "+" : ""}{currentAcceleration.toFixed(2)} ev/s²
                  </span>
                </span>
                <span className="hidden md:inline">
                  <strong className="text-slate-500">60s Peak:</strong>{" "}
                  <span className="text-slate-200">{peakVelocity60s.toFixed(2)} ev/s</span>
                </span>
              </div>

              {/* Inject Surge button to easily demonstrate escalation detection */}
              <button
                id="inject-velocity-surge-btn"
                onClick={triggerVelocitySurge}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-red-950 hover:bg-red-900 border border-red-700 text-red-300 transition-colors flex items-center space-x-1"
                title="Inject sudden frequency surge to trigger rapid escalation detection"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Inject Surge</span>
              </button>

              <button
                onClick={() => setOverlayStyle(prev => prev === "docked" ? "translucent" : "docked")}
                className="text-slate-400 hover:text-slate-200 text-[10px] font-mono"
                title="Toggle overlay styling mode"
              >
                {overlayStyle === "docked" ? "Translucent HUD" : "Docked View"}
              </button>
            </div>
          </div>

          {/* Recharts Threat Velocity Line Chart (Rate of change in threat frequency) */}
          <div className="h-[145px] w-full min-w-0" id="threat-velocity-chart-box">
            <ResponsiveContainer width="100%" height={145} minWidth={100} minHeight={145}>
              <AreaChart data={velocityHistory} margin={{ top: 12, right: 14, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="threatVelocityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isRapidEscalation ? "#ef4444" : "#0284c7"} 
                      stopOpacity={0.45}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isRapidEscalation ? "#ef4444" : "#0284c7"} 
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: "#64748b", fontSize: 9, fontFamily: "monospace" }}
                  interval={9}
                />
                <YAxis 
                  domain={[-1.5, 'auto']}
                  tick={{ fill: "#64748b", fontSize: 9, fontFamily: "monospace" }}
                  unit=" ev/s"
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as ThreatVelocityPoint;
                      return (
                        <div className="bg-slate-950/95 border border-slate-800 p-2.5 rounded-lg shadow-2xl text-[10px] font-mono space-y-1.5 backdrop-blur-md">
                          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
                            <span className="font-bold text-white text-[11px]">{d.label} ({d.time} UTC)</span>
                            <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                              d.isEscalating 
                                ? "bg-red-950 text-red-300 border border-red-800 animate-pulse" 
                                : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            }`}>
                              {d.isEscalating ? "RAPID ESCALATION" : "NOMINAL"}
                            </span>
                          </div>
                          <div className="space-y-0.5 text-slate-300">
                            <div>Rate of Change: <strong className={d.velocity >= ESCALATION_THRESHOLD_VELOCITY ? "text-red-400 font-bold" : "text-cyan-300 font-semibold"}>{d.velocity > 0 ? "+" : ""}{d.velocity.toFixed(2)} ev/s</strong></div>
                            <div>Threat Frequency: <strong className="text-white">{d.frequency.toFixed(2)} threats/sec</strong></div>
                            <div>Acceleration: <strong className="text-amber-300">{d.acceleration > 0 ? "+" : ""}{d.acceleration.toFixed(2)} ev/s²</strong></div>
                            <div className="text-slate-500 text-[9px] pt-1 border-t border-slate-800/80">
                              Escalation Threshold: +{ESCALATION_THRESHOLD_VELOCITY.toFixed(1)} ev/s
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine 
                  y={ESCALATION_THRESHOLD_VELOCITY} 
                  stroke="#ef4444" 
                  strokeDasharray="4 4" 
                  label={{ 
                    value: "Escalation Threshold (+2.5 ev/s)", 
                    fill: "#ef4444", 
                    fontSize: 9, 
                    position: "top",
                    offset: 4
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke={isRapidEscalation ? "#f87171" : "#38bdf8"} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#threatVelocityGradient)" 
                  dot={(props: any) => {
                    if (props.payload.isEscalating) {
                      return (
                        <circle
                          key={`dot-${props.cx}-${props.cy}`}
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill="#ef4444"
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                      );
                    }
                    return <React.Fragment key={`dot-${props.cx}-${props.cy}`} />;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-1.5">
            <span>T - 60s Window: First derivative of anomaly frequency showing rapid surge escalations</span>
            <span className="text-slate-400">Escalation Threshold: &ge; +2.50 ev/s</span>
          </div>
        </div>
      )}

      {/* Optional Secondary Category Filter Pills */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[10px] font-mono custom-scrollbar" id="heatmap-categories-bar">
        <Filter className="w-3 h-3 text-slate-500 shrink-0 mr-1" />
        <span className="text-slate-500 text-[10px] mr-1">Layer:</span>
        {[
          "All",
          "Quantum",
          "Neural & ML",
          "Active Defense & Deception",
          "Monitoring & Auditing",
          "Integrity & Compliance"
        ].map(cat => {
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              id={`heatmap-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2 py-0.5 rounded transition-all shrink-0 ${
                isActive 
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/50 font-semibold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              {cat === "Active Defense & Deception" ? "Active Defense" : cat}
            </button>
          );
        })}
      </div>

      {/* VIEW 1: MATRIX GRID VIEW (Interactive D3 Heatmap Grid) */}
      {viewMode === "matrix" && (
        <div className="space-y-3" id="heatmap-matrix-view">
          <div 
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-1.5"
            id="heatmap-cells-grid"
          >
            {filteredData.map(item => {
              const isSelected = activeModuleId === item.module.id;
              const cellColor = d3ColorScale(item.densityScore);
              const isHigh = item.riskZone === "high";
              const archetype = getModuleArchetype(item.module);

              return (
                <div
                  key={item.module.id}
                  id={`heatmap-cell-mod-${item.module.id}`}
                  data-module-id={item.module.id}
                  data-risk-score={item.exactRiskScore}
                  data-active-threats={item.activeThreats}
                  data-last-scanned={item.lastScannedTimestamp}
                  onClick={() => onSelectModule(item.module)}
                  onMouseEnter={(e) => {
                    setHoveredModule(item);
                    setMousePos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setMousePos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => {
                    setHoveredModule(null);
                    setMousePos(null);
                  }}
                  style={{
                    backgroundColor: cellColor,
                    borderColor: isSelected 
                      ? "#60a5fa" 
                      : isHigh 
                        ? "#f87171" 
                        : "rgba(30, 41, 59, 0.6)"
                  }}
                  className={`relative p-2 rounded cursor-pointer border transition-all duration-150 flex flex-col justify-between h-[68px] group hover:scale-[1.03] hover:z-20 hover:shadow-lg ${
                    isSelected ? "ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-950 z-10" : ""
                  }`}
                >
                  {/* Top row: ID + Archetype indicator + Risk Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-slate-200">
                      #{String(item.module.id).padStart(2, '0')}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className={`text-[7.5px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                        archetype === "Quantum" 
                          ? "bg-blue-950/80 text-blue-300 border border-blue-800/60" 
                          : archetype === "Neural" 
                            ? "bg-purple-950/80 text-purple-300 border border-purple-800/60" 
                            : archetype === "Blockchain" 
                              ? "bg-amber-950/80 text-amber-300 border border-amber-800/60" 
                              : "bg-slate-900/80 text-slate-300 border border-slate-700/60"
                      }`}>
                        {archetype[0]}
                      </span>
                      {isHigh ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                      ) : item.riskZone === "elevated" ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      ) : (
                        <span className="w-1 h-1 rounded-full bg-slate-400 opacity-40" />
                      )}
                    </div>
                  </div>

                  {/* Middle: Abbreviated Module Name */}
                  <div className="text-[10px] font-semibold text-white truncate drop-shadow-sm font-sans">
                    {item.module.name.replace(/^(Quantum|Defensive|Autonomous|Executive|Continuous)\s+/i, "")}
                  </div>

                  {/* Bottom: Event count + Exact Risk Score */}
                  <div className="flex items-center justify-between text-[8px] font-mono text-slate-200/90 pt-0.5">
                    <span>{item.activeThreats} threats</span>
                    <span className="font-bold">{item.exactRiskScore}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-xs font-mono text-slate-500 bg-slate-900/20 border border-slate-900 rounded-lg">
              No module risk nodes match current archetype or category filter criteria.
            </div>
          )}

          {/* Floating In-Situ Tooltip for Hovered Module Node */}
          {hoveredModule && mousePos && (
            <div
              id="heatmap-module-node-tooltip"
              data-testid="heatmap-module-node-tooltip"
              role="tooltip"
              className="fixed pointer-events-none z-50 w-72 bg-slate-950/95 backdrop-blur-md border border-slate-700/90 rounded-xl p-3.5 shadow-2xl shadow-black/90 space-y-2.5 text-xs font-mono transition-all duration-75 animate-in fade-in zoom-in-95"
              style={{
                left: `${Math.min(window.innerWidth - 305, Math.max(12, mousePos.x + 16))}px`,
                top: `${Math.min(window.innerHeight - 240, Math.max(12, mousePos.y - 45))}px`
              }}
            >
              {/* Tooltip Header: ID, Name, Category & Archetype */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-400 font-bold font-mono">
                      #{String(hoveredModule.module.id).padStart(2, "0")}
                    </span>
                    <span className="font-bold text-white text-[12px] leading-tight font-sans">
                      {hoveredModule.module.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span>{hoveredModule.module.category}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-cyan-400">{getModuleArchetype(hoveredModule.module)}</span>
                  </div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase shrink-0 border ${
                  hoveredModule.riskZone === "high"
                    ? "bg-red-950/90 text-red-300 border-red-800 animate-pulse"
                    : hoveredModule.riskZone === "elevated"
                      ? "bg-amber-950/90 text-amber-300 border-amber-800"
                      : "bg-emerald-950/90 text-emerald-300 border-emerald-800"
                }`}>
                  {hoveredModule.riskZone === "high" ? "High Risk" : hoveredModule.riskZone === "elevated" ? "Elevated" : "Nominal"}
                </span>
              </div>

              {/* Exact Risk Score */}
              <div className="space-y-1 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80" data-testid="exact-risk-score">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Exact Risk Score:</span>
                  </span>
                  <span className="font-bold font-mono text-[13px]">
                    <span className={
                      hoveredModule.exactRiskScore >= 65 
                        ? "text-red-400 font-extrabold" 
                        : hoveredModule.exactRiskScore >= 35 
                          ? "text-amber-400 font-bold" 
                          : "text-emerald-400 font-bold"
                    }>
                      {hoveredModule.exactRiskScore.toFixed(1)}
                    </span>
                    <span className="text-slate-500 text-[10px]"> / 100</span>
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${hoveredModule.exactRiskScore}%`,
                      backgroundColor: d3ColorScale(hoveredModule.exactRiskScore)
                    }}
                  />
                </div>
              </div>

              {/* Active Threats */}
              <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 text-[11px]" data-testid="active-threats">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  <span>Active Threats:</span>
                </span>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-red-400 text-[12px] font-mono">
                    {hoveredModule.activeThreats}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({hoveredModule.criticalEvents} crit, {hoveredModule.warningEvents} warn)
                  </span>
                </div>
              </div>

              {/* Last Scanned Timestamp */}
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 text-[11px] space-y-0.5" data-testid="last-scanned-timestamp">
                <div className="text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Last Scanned Timestamp:</span>
                </div>
                <div className="text-cyan-300 font-mono text-[10.5px] pl-5 truncate font-semibold">
                  {hoveredModule.lastScannedTimestamp}
                </div>
              </div>

              {/* Latest Telemetry Message */}
              {hoveredModule.lastEventMessage && (
                <div className="text-[9.5px] text-slate-400 border-t border-slate-800/80 pt-1.5 truncate">
                  <span className="text-slate-500 font-medium">Latest Vector:</span> {hoveredModule.lastEventMessage}
                </div>
              )}

              <div className="text-[9px] text-slate-500 text-center italic">
                Click module node to inspect full telemetry
              </div>
            </div>
          )}

          {/* Interactive Cell Inspector / Tooltip Bar */}
          <div 
            className="p-3 bg-slate-900/60 border border-slate-900 rounded-lg text-xs font-mono flex flex-col lg:flex-row lg:items-center justify-between gap-3 min-h-[58px]"
            id="heatmap-hover-inspector"
          >
            {hoveredModule ? (
              <>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-400 font-mono">
                      #{String(hoveredModule.module.id).padStart(2, "0")} {hoveredModule.module.name}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      ({hoveredModule.module.category} · {getModuleArchetype(hoveredModule.module)})
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      hoveredModule.riskZone === "high" 
                        ? "bg-red-950 text-red-400 border border-red-900" 
                        : hoveredModule.riskZone === "elevated" 
                          ? "bg-amber-950 text-amber-400 border border-amber-900" 
                          : "bg-blue-950 text-blue-400 border border-blue-900"
                    }`}>
                      {hoveredModule.riskZone === "high" ? "HIGH RISK ZONE" : hoveredModule.riskZone === "elevated" ? "ELEVATED" : "NOMINAL"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      <strong className="text-slate-400">Risk Score:</strong>{" "}
                      <span className="text-white font-bold">{hoveredModule.exactRiskScore.toFixed(1)}/100</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-red-400" />
                      <strong className="text-slate-400">Active Threats:</strong>{" "}
                      <span className="text-red-400 font-bold">{hoveredModule.activeThreats}</span>
                      <span className="text-slate-500 text-[10px]">({hoveredModule.criticalEvents} crit, {hoveredModule.warningEvents} warn)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <strong className="text-slate-400">Last Scanned:</strong>{" "}
                      <span className="text-cyan-300 font-mono">{hoveredModule.lastScannedTimestamp}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 text-[11px]">
                  <button
                    onClick={() => onSelectModule(hoveredModule.module)}
                    className="px-3 py-1 text-[10px] bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
                  >
                    Select Module
                  </button>
                </div>
              </>
            ) : (
              <div className="text-slate-500 text-[11px] flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                <span>Hover over any of the {filteredData.length} visible matrix cells to inspect event density, or toggle the archetype dropdown to focus on Quantum, Neural, Blockchain, or Classic modules.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: RANKED BAR DISTRIBUTION VIEW (Recharts with D3 Colors) */}
      {viewMode === "ranked" && (
        <div className="space-y-3" id="heatmap-ranked-view">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Modules Ranked by Threat Density Score (0 - 100) [{archetypeFilter} Nodes]</span>
            <span className="text-[10px] text-slate-500">Displaying {rankedData.length} modules</span>
          </div>

          <div className="h-[220px] min-w-0 min-h-[220px] w-full" id="ranked-barchart-container">
            <ResponsiveContainer width="100%" height={220} minWidth={100} minHeight={220}>
              <BarChart 
                data={rankedData.map(d => ({
                  name: `#${d.module.id} ${d.module.name.substring(0, 14)}...`,
                  fullName: d.module.name,
                  id: d.module.id,
                  score: d.densityScore,
                  exactRiskScore: d.exactRiskScore,
                  activeThreats: d.activeThreats,
                  events: d.totalEvents,
                  critical: d.criticalEvents,
                  warning: d.warningEvents,
                  lastScanned: d.lastScannedTimestamp,
                  raw: d
                }))}
                margin={{ top: 8, right: 10, left: -20, bottom: 25 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "#64748b", fontSize: 9, fontFamily: "monospace" }} 
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: 9, fontFamily: "monospace" }} 
                />
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded shadow-xl text-[10px] font-mono space-y-1">
                          <div className="font-bold text-white text-xs">{data.fullName} (#{data.id})</div>
                          <div className="text-slate-300">Exact Risk Score: <strong className="text-amber-300">{data.exactRiskScore.toFixed(1)} / 100</strong></div>
                          <div className="text-slate-300">Active Threats: <strong className="text-red-400">{data.activeThreats}</strong> ({data.critical} crit, {data.warning} warn)</div>
                          <div className="text-slate-300">Last Scanned Timestamp: <span className="text-cyan-300 font-semibold">{data.lastScanned}</span></div>
                          <div className="text-slate-400 pt-0.5">Total Events: {data.events}</div>
                          <div className="text-slate-500 pt-1 border-t border-slate-800">Click bar to select module</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="score" 
                  radius={[3, 3, 0, 0]}
                  onClick={(entry) => {
                    if (entry && (entry as any).raw) {
                      onSelectModule((entry as any).raw.module);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {rankedData.map((entry, index) => (
                    <Cell 
                      key={`bar-cell-${index}`} 
                      fill={d3ColorScale(entry.densityScore)} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* D3 Gradient Scale Legend */}
      <div className="pt-2 border-t border-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-slate-400" id="heatmap-legend-bar">
        <div className="flex items-center space-x-2">
          <span className="text-slate-500">Threat Gradient:</span>
          <span className="text-slate-400">Nominal (0%)</span>
          <div 
            className="w-32 sm:w-44 h-2 rounded overflow-hidden border border-slate-800"
            style={{
              background: "linear-gradient(to right, #0f1d32, #0369a1, #0284c7, #d97706, #f97316, #ef4444, #b91c1c)"
            }}
          />
          <span className="text-red-400 font-bold">Critical Zone (100%)</span>
        </div>

        <div className="flex items-center space-x-3 text-slate-500 text-[10px]">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
            <span>&ge; 65% High-Risk</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span>35-64% Elevated</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
            <span>&lt; 35% Nominal</span>
          </span>
        </div>
      </div>
    </div>
  );
};
