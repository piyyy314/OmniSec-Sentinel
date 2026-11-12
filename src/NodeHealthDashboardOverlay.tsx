import React, { useEffect, useState, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Cpu,
  Database,
  Flame,
  Gauge,
  HardDrive,
  MemoryStick,
  Network,
  RefreshCw,
  RotateCcw,
  Server,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";

export interface OverlayHostNodeInfo {
  id: string;
  name: string;
  role: string;
  ip: string;
  baseUptimePercent: number;
  trafficThresholdPps: number;
  protocol: string;
  hardware: string;
}

export interface NodeGranularTelemetryData {
  nodeId: string;
  timestamp: string;
  hostKernel: {
    platform: string;
    arch: string;
    hostCpuCount: number;
    hostLoadAvg: [number, number, number];
    hostMemUsagePercent: number;
  };
  cpu: {
    totalPercent: number;
    userPercent: number;
    systemPercent: number;
    iowaitPercent: number;
    idlePercent: number;
    cores: number[];
    loadAvg1m: number;
    loadAvg5m: number;
    loadAvg15m: number;
    contextSwitchesPerSec: number;
  };
  memory: {
    usedGb: number;
    totalGb: number;
    usagePercent: number;
    activeHeapGb: number;
    pageCacheGb: number;
    kernelSlabGb: number;
    freeGb: number;
    swapUsedGb: number;
    swapTotalGb: number;
    pageFaultsPerSec: number;
  };
  diskIo: {
    device: string;
    readMbps: number;
    writeMbps: number;
    totalIops: number;
    readIops: number;
    writeIops: number;
    queueDepth: number;
    avgAwaitMs: number;
    capacityUsedPercent: number;
    capacityTb: number;
  };
  network: {
    trafficLimitPps: number;
    throttledCount: number;
  };
  processes: Array<{
    pid: number;
    name: string;
    cpuPercent: number;
    memGb: number;
    ioMbps: number;
    state: string;
  }>;
  history: Array<{
    timeLabel: string;
    cpuPercent: number;
    memoryPercent: number;
    diskReadMbps: number;
    diskWriteMbps: number;
  }>;
}

interface NodeHealthDiagnosticResult {
  summary: string;
  severity: "NOMINAL" | "ELEVATED" | "CRITICAL";
  bottleneck: string;
  recommendations: string[];
  recommendedCli: string;
  modelUsed: string;
  mode: "live-gemini" | "local-heuristic";
}

interface NodeHealthDashboardOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  hostNodes: Record<string, OverlayHostNodeInfo>;
  nodeUptimes: Record<string, number>;
  nodeLatencies: Record<string, number>;
  nodeTrafficRates: Record<string, number>;
  nodeTrafficLimits: Record<string, number>;
  simulatedSurgeNodes: Record<string, boolean>;
  isolatedNodes: string[];
  throttledNodes: Record<string, { count: number; originalLimit: number }>;
  onAutoThrottle: (nodeId: string) => void;
  onResetThrottle: (nodeId: string) => void;
  onToggleSurge: (nodeId: string) => void;
  onToggleIsolate: (nodeId: string) => void;
  onLogAction: (msg: string) => void;
}

const NODE_SHORT_LABELS: Record<string, string> = {
  "node-1": "GW1 · Edge Gateway",
  "node-2": "VQC · Quantum Core",
  "node-3": "S3 · Audit Lake",
  "node-4": "GNN · Pivot 04",
  "node-5": "HONEY · Trap Mesh",
};

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${d}d ${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

export const NodeHealthDashboardOverlay: React.FC<NodeHealthDashboardOverlayProps> = ({
  isOpen,
  onClose,
  selectedNodeId,
  onSelectNode,
  hostNodes,
  nodeUptimes,
  nodeLatencies,
  nodeTrafficRates,
  nodeTrafficLimits,
  simulatedSurgeNodes,
  isolatedNodes,
  throttledNodes,
  onAutoThrottle,
  onResetThrottle,
  onToggleSurge,
  onToggleIsolate,
  onLogAction,
}) => {
  const [telemetry, setTelemetry] = useState<NodeGranularTelemetryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [diagnostic, setDiagnostic] = useState<NodeHealthDiagnosticResult | null>(null);
  const [diagnosing, setDiagnosing] = useState<boolean>(false);

  const activeHost = hostNodes[selectedNodeId] || hostNodes["node-1"];
  const isIsolated = isolatedNodes.includes(selectedNodeId);
  const isSurging = !!simulatedSurgeNodes[selectedNodeId];
  const isThrottled = !!throttledNodes[selectedNodeId];
  const activeLimit = nodeTrafficLimits[selectedNodeId] ?? activeHost.trafficThresholdPps;
  const baseTraffic = nodeTrafficRates[selectedNodeId] ?? 4250;
  const effectiveTraffic = isSurging
    ? Math.max(baseTraffic, Math.round(activeLimit * 1.52 + 1850))
    : baseTraffic;
  const isTrafficAlert = effectiveTraffic > activeLimit;
  const liveLatency = nodeLatencies[selectedNodeId] ?? 1.5;
  const liveUptime = nodeUptimes[selectedNodeId] ?? 0;

  const fetchNodeTelemetry = useCallback(async () => {
    if (!isOpen) return;
    try {
      const res = await fetch(
        `/api/nodes/${encodeURIComponent(selectedNodeId)}/telemetry?surging=${isSurging}&isolated=${isIsolated}`
      );
      if (!res.ok) {
        throw new Error(`Telemetry HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.telemetry) {
        setTelemetry(data.telemetry);
        setFetchError(null);
      } else {
        throw new Error(data.error || "Invalid telemetry response");
      }
    } catch (err: any) {
      setFetchError(err?.message || "Failed to fetch node telemetry");
    } finally {
      setLoading(false);
    }
  }, [isOpen, selectedNodeId, isSurging, isIsolated]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setDiagnostic(null);
    fetchNodeTelemetry();
    const interval = setInterval(fetchNodeTelemetry, 1500);
    return () => clearInterval(interval);
  }, [isOpen, fetchNodeTelemetry]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleRunAiDiagnostic = async () => {
    if (!telemetry) return;
    setDiagnosing(true);
    try {
      const res = await fetch("/api/ai/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "diagnose-node",
          nodeId: selectedNodeId,
          telemetry: {
            cpuPercent: telemetry.cpu.totalPercent,
            memoryPercent: telemetry.memory.usagePercent,
            memoryUsedGb: telemetry.memory.usedGb,
            memoryTotalGb: telemetry.memory.totalGb,
            diskReadMbps: telemetry.diskIo.readMbps,
            diskWriteMbps: telemetry.diskIo.writeMbps,
            diskIops: telemetry.diskIo.totalIops,
            diskAwaitMs: telemetry.diskIo.avgAwaitMs,
            trafficPps: effectiveTraffic,
            trafficLimitPps: activeLimit,
            latencyMs: liveLatency,
            isSurging: isSurging || isTrafficAlert,
            isIsolated,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.diagnostic) {
        setDiagnostic(data.diagnostic);
        onLogAction(
          `[${new Date().toLocaleTimeString()}] AI NODE HEALTH AUDIT (${selectedNodeId.toUpperCase()}): ${data.diagnostic.severity} · ${data.diagnostic.bottleneck} [Model: ${data.diagnostic.modelUsed}]`
        );
      } else {
        setFetchError(data.error || "AI diagnostic failed");
      }
    } catch (err: any) {
      setFetchError(err?.message || "Failed to contact AI Gateway");
    } finally {
      setDiagnosing(false);
    }
  };

  if (!isOpen) return null;

  const cpuPct = telemetry?.cpu.totalPercent ?? 0;
  const memPct = telemetry?.memory.usagePercent ?? 0;
  const diskAwait = telemetry?.diskIo.avgAwaitMs ?? 0;

  const nodeStatusLabel = isIsolated
    ? "ISOLATED"
    : isTrafficAlert || cpuPct >= 88
      ? "CRITICAL"
      : cpuPct >= 70 || memPct >= 75 || diskAwait >= 6
        ? "ELEVATED"
        : "NOMINAL";

  const statusTone =
    nodeStatusLabel === "CRITICAL" || nodeStatusLabel === "ISOLATED"
      ? "text-rose-300 bg-rose-950/70 border-rose-700/80"
      : nodeStatusLabel === "ELEVATED"
        ? "text-amber-300 bg-amber-950/70 border-amber-700/80"
        : "text-emerald-300 bg-emerald-950/70 border-emerald-700/80";

  return (
    <div
      id="node-health-dashboard-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="node-health-overlay-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-6xl max-h-[92vh] bg-slate-950 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Overlay Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/50 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <Server className="w-4 h-4 text-blue-400 shrink-0" />
              <h2
                id="node-health-overlay-title"
                className="text-base font-semibold text-slate-100 tracking-tight truncate"
              >
                Node Health Dashboard — {activeHost.name}
              </h2>
              <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${statusTone}`}>
                {nodeStatusLabel}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 font-mono">
              <span>{activeHost.id.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span>{activeHost.ip}</span>
              <span aria-hidden="true">·</span>
              <span>{activeHost.hardware}</span>
              <span aria-hidden="true">·</span>
              <span>{activeHost.protocol}</span>
              {telemetry && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">
                    Kernel {telemetry.hostKernel.platform} ({telemetry.hostKernel.arch})
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="overlay-auto-throttle-btn"
              onClick={() => onAutoThrottle(selectedNodeId)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isTrafficAlert || isSurging
                  ? "bg-amber-950/90 text-amber-200 border-amber-500 hover:bg-amber-900"
                  : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Throttle (-50%)</span>
            </button>

            {isThrottled && (
              <button
                id="overlay-reset-throttle-btn"
                onClick={() => onResetThrottle(selectedNodeId)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Limit</span>
              </button>
            )}

            <button
              id="overlay-toggle-surge-btn"
              onClick={() => onToggleSurge(selectedNodeId)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isSurging
                  ? "bg-rose-950/80 text-rose-200 border-rose-700 hover:bg-rose-900"
                  : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>{isSurging ? "Stop Surge" : "Simulate Surge"}</span>
            </button>

            <button
              id="overlay-toggle-isolate-btn"
              onClick={() => onToggleIsolate(selectedNodeId)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isIsolated
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900"
                  : "bg-red-950/80 text-red-300 border-red-800 hover:bg-red-900"
              }`}
            >
              {isIsolated ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              <span>{isIsolated ? "Reconnect Host" : "Isolate Host"}</span>
            </button>

            <button
              id="run-ai-node-diagnostic-btn"
              onClick={handleRunAiDiagnostic}
              disabled={diagnosing || !telemetry}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 disabled:opacity-50"
            >
              {diagnosing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
              <span>{diagnosing ? "Diagnosing..." : "AI Health Audit"}</span>
            </button>

            <button
              id="close-node-health-overlay-btn"
              onClick={onClose}
              aria-label="Close Node Health Dashboard"
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Attack Path Matrix Node Switcher Tabs */}
        <div className="px-5 py-2.5 border-b border-slate-900 bg-slate-950 flex items-center gap-2 overflow-x-auto custom-scrollbar-horizontal shrink-0">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1">Attack Path Nodes:</span>
          {Object.keys(hostNodes).map((id) => {
            const active = id === selectedNodeId;
            const nodeSurging = !!simulatedSurgeNodes[id];
            const nodeIsolated = isolatedNodes.includes(id);
            return (
              <button
                key={id}
                id={`overlay-node-tab-${id}`}
                onClick={() => onSelectNode(id)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  active
                    ? "bg-blue-600/15 border-blue-500/60 text-blue-300 font-semibold"
                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span>{NODE_SHORT_LABELS[id] || id.toUpperCase()}</span>
                {nodeIsolated && <span className="text-[10px] text-rose-400">[ISOLATED]</span>}
                {!nodeIsolated && nodeSurging && <span className="text-[10px] text-amber-400">[SURGE]</span>}
              </button>
            );
          })}
        </div>

        {/* Scrollable Telemetry Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {fetchError && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-xs font-mono text-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{fetchError}</span>
              </div>
              <button onClick={fetchNodeTelemetry} className="text-rose-300 hover:text-white underline">
                Retry
              </button>
            </div>
          )}

          {loading && !telemetry ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-slate-900/70 border border-slate-800 rounded-xl" />
              ))}
            </div>
          ) : telemetry ? (
            <>
              {/* Top 4 KPI Summary Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Cpu className="w-3.5 h-3.5 text-blue-400" />
                      <span>CPU Utilization</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {telemetry.cpu.cores.length} vCPU
                    </span>
                  </div>
                  <div
                    className={`text-2xl font-bold font-mono tabular-nums ${
                      cpuPct >= 85 ? "text-rose-400" : cpuPct >= 70 ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    {telemetry.cpu.totalPercent.toFixed(1)}%
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span>Load: {telemetry.cpu.loadAvg1m.toFixed(2)}</span>
                    <span>·</span>
                    <span>{telemetry.cpu.contextSwitchesPerSec.toLocaleString()} ctx/s</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MemoryStick className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Memory Consumption</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {telemetry.memory.totalGb} GB ECC
                    </span>
                  </div>
                  <div
                    className={`text-2xl font-bold font-mono tabular-nums ${
                      memPct >= 85 ? "text-rose-400" : memPct >= 75 ? "text-amber-400" : "text-cyan-300"
                    }`}
                  >
                    {telemetry.memory.usedGb.toFixed(1)} GB{" "}
                    <span className="text-sm font-semibold text-slate-400">
                      ({telemetry.memory.usagePercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span>Heap: {telemetry.memory.activeHeapGb.toFixed(1)}G</span>
                    <span>·</span>
                    <span>Swap: {telemetry.memory.swapUsedGb.toFixed(2)}G</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Disk I/O Throughput</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      QD {telemetry.diskIo.queueDepth}
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-100">
                    {(telemetry.diskIo.readMbps + telemetry.diskIo.writeMbps).toFixed(1)}{" "}
                    <span className="text-sm font-medium text-slate-400">MB/s</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span>{telemetry.diskIo.totalIops.toLocaleString()} IOPS</span>
                    <span>·</span>
                    <span>Await: {telemetry.diskIo.avgAwaitMs.toFixed(2)} ms</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Network className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ingress &amp; Inspection</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {liveLatency.toFixed(2)} ms
                    </span>
                  </div>
                  <div
                    className={`text-2xl font-bold font-mono tabular-nums ${
                      isTrafficAlert ? "text-rose-400" : "text-slate-100"
                    }`}
                  >
                    {effectiveTraffic.toLocaleString()}{" "}
                    <span className="text-sm font-medium text-slate-400">pkt/s</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span>Limit: {activeLimit.toLocaleString()}</span>
                    <span>·</span>
                    <span>Up: {isIsolated ? "0s" : formatUptime(liveUptime)}</span>
                  </div>
                </div>
              </div>

              {/* Granular Subsystem Telemetry Grid: CPU + Memory + Disk I/O */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* 1. CPU Usage Panel */}
                <div
                  id="overlay-cpu-panel"
                  className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <span>CPU Usage Telemetry</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Idle {telemetry.cpu.idlePercent.toFixed(1)}%
                    </span>
                  </div>

                  {/* Segmented CPU Usage Bar */}
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                      <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${telemetry.cpu.userPercent}%` }}
                        title={`User: ${telemetry.cpu.userPercent}%`}
                      />
                      <div
                        className="bg-amber-500 h-full transition-all duration-300"
                        style={{ width: `${telemetry.cpu.systemPercent}%` }}
                        title={`System: ${telemetry.cpu.systemPercent}%`}
                      />
                      <div
                        className="bg-rose-500 h-full transition-all duration-300"
                        style={{ width: `${telemetry.cpu.iowaitPercent}%` }}
                        title={`IO Wait: ${telemetry.cpu.iowaitPercent}%`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="text-blue-400">User {telemetry.cpu.userPercent.toFixed(1)}%</span>
                      <span className="text-amber-400">Sys {telemetry.cpu.systemPercent.toFixed(1)}%</span>
                      <span className="text-rose-400">IOWait {telemetry.cpu.iowaitPercent.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Per-Core Grid */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                      <span>Per-Core Execution Load</span>
                      <span>
                        Load Avg: {telemetry.cpu.loadAvg1m} / {telemetry.cpu.loadAvg5m} / {telemetry.cpu.loadAvg15m}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {telemetry.cpu.cores.map((coreVal, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-1.5 space-y-1"
                        >
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-slate-500">C{idx}</span>
                            <span className="text-slate-200 font-semibold">{coreVal.toFixed(0)}%</span>
                          </div>
                          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                coreVal >= 85 ? "bg-rose-500" : coreVal >= 70 ? "bg-amber-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${Math.min(100, coreVal)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 60s CPU Trend Chart */}
                  <div className="h-28 w-full min-w-0">
                    <ResponsiveContainer width="100%" height={112}>
                      <AreaChart data={telemetry.history}>
                        <defs>
                          <linearGradient id="overlayCpuGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="timeLabel" tick={{ fill: "#64748b", fontSize: 10 }} interval={7} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} width={28} axisLine={false} tickLine={false} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#020617",
                            border: "1px solid #1e293b",
                            fontSize: "11px",
                            color: "#f1f5f9",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="cpuPercent"
                          name="CPU %"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          fill="url(#overlayCpuGrad)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Memory Consumption Panel */}
                <div
                  id="overlay-memory-panel"
                  className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <MemoryStick className="w-4 h-4 text-cyan-400" />
                      <span>Memory Consumption</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Free {telemetry.memory.freeGb.toFixed(1)} GB
                    </span>
                  </div>

                  {/* Segmented RAM Allocation Bar */}
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                      <div
                        className="bg-cyan-400 h-full transition-all duration-300"
                        style={{ width: `${(telemetry.memory.activeHeapGb / telemetry.memory.totalGb) * 100}%` }}
                      />
                      <div
                        className="bg-indigo-500 h-full transition-all duration-300"
                        style={{ width: `${(telemetry.memory.pageCacheGb / telemetry.memory.totalGb) * 100}%` }}
                      />
                      <div
                        className="bg-amber-500 h-full transition-all duration-300"
                        style={{ width: `${(telemetry.memory.kernelSlabGb / telemetry.memory.totalGb) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="text-cyan-300">Heap {telemetry.memory.activeHeapGb.toFixed(1)}G</span>
                      <span className="text-indigo-300">Cache {telemetry.memory.pageCacheGb.toFixed(1)}G</span>
                      <span className="text-amber-300">Slab {telemetry.memory.kernelSlabGb.toFixed(1)}G</span>
                    </div>
                  </div>

                  {/* Memory Counters Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-500">Resident Memory</div>
                      <div className="text-sm font-bold text-slate-100 mt-0.5">
                        {telemetry.memory.usedGb.toFixed(2)} / {telemetry.memory.totalGb} GB
                      </div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-500">Swap Allocated</div>
                      <div className="text-sm font-bold text-slate-100 mt-0.5">
                        {telemetry.memory.swapUsedGb.toFixed(2)} / {telemetry.memory.swapTotalGb} GB
                      </div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 col-span-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Minor/Major Page Faults</span>
                      <span className="text-xs font-bold text-cyan-300">
                        {telemetry.memory.pageFaultsPerSec.toLocaleString()} faults/s
                      </span>
                    </div>
                  </div>

                  {/* 60s Memory Trend Chart */}
                  <div className="h-28 w-full min-w-0">
                    <ResponsiveContainer width="100%" height={112}>
                      <AreaChart data={telemetry.history}>
                        <defs>
                          <linearGradient id="overlayMemGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="timeLabel" tick={{ fill: "#64748b", fontSize: 10 }} interval={7} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} width={28} axisLine={false} tickLine={false} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#020617",
                            border: "1px solid #1e293b",
                            fontSize: "11px",
                            color: "#f1f5f9",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="memoryPercent"
                          name="Memory %"
                          stroke="#06B6D4"
                          strokeWidth={2}
                          fill="url(#overlayMemGrad)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Disk I/O Panel */}
                <div
                  id="overlay-disk-panel"
                  className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <HardDrive className="w-4 h-4 text-emerald-400" />
                      <span>Disk I/O Telemetry</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {telemetry.diskIo.capacityUsedPercent}% of {telemetry.diskIo.capacityTb} TB
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between bg-slate-950/70 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                    <span>Device: {telemetry.diskIo.device}</span>
                    <span
                      className={
                        telemetry.diskIo.avgAwaitMs >= 8 ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"
                      }
                    >
                      {telemetry.diskIo.avgAwaitMs.toFixed(2)} ms await
                    </span>
                  </div>

                  {/* Read / Write / IOPS Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                      <div className="text-[10px] text-emerald-400">Read Throughput</div>
                      <div className="text-sm font-bold text-slate-100 mt-0.5">
                        {telemetry.diskIo.readMbps.toFixed(1)} MB/s
                      </div>
                      <div className="text-[10px] text-slate-500">{telemetry.diskIo.readIops.toLocaleString()} IOPS</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                      <div className="text-[10px] text-amber-400">Write Throughput</div>
                      <div className="text-sm font-bold text-slate-100 mt-0.5">
                        {telemetry.diskIo.writeMbps.toFixed(1)} MB/s
                      </div>
                      <div className="text-[10px] text-slate-500">{telemetry.diskIo.writeIops.toLocaleString()} IOPS</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 col-span-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">NVMe Queue Depth</span>
                      <span className="text-xs font-bold text-slate-200">
                        {telemetry.diskIo.queueDepth} active requests
                      </span>
                    </div>
                  </div>

                  {/* 60s Dual Read/Write Disk I/O Chart */}
                  <div className="h-28 w-full min-w-0">
                    <ResponsiveContainer width="100%" height={112}>
                      <AreaChart data={telemetry.history}>
                        <defs>
                          <linearGradient id="overlayDiskRead" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="overlayDiskWrite" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="timeLabel" tick={{ fill: "#64748b", fontSize: 10 }} interval={7} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} width={32} axisLine={false} tickLine={false} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#020617",
                            border: "1px solid #1e293b",
                            fontSize: "11px",
                            color: "#f1f5f9",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="diskReadMbps"
                          name="Read MB/s"
                          stroke="#10B981"
                          strokeWidth={2}
                          fill="url(#overlayDiskRead)"
                          isAnimationActive={false}
                        />
                        <Area
                          type="monotone"
                          dataKey="diskWriteMbps"
                          name="Write MB/s"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          fill="url(#overlayDiskWrite)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Grid: Active Kernel Processes + AI Node Health Diagnostic */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Active Processes Table */}
                <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <span>Active Host Processes</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">Live eBPF Kernel Tap</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono tabular-nums">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                          <th className="pb-2 pr-3">PID</th>
                          <th className="pb-2 pr-3">Process</th>
                          <th className="pb-2 pr-3 text-right">CPU %</th>
                          <th className="pb-2 pr-3 text-right">Memory</th>
                          <th className="pb-2 pr-3 text-right">Disk I/O</th>
                          <th className="pb-2 text-right">State</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {telemetry.processes.map((proc) => (
                          <tr key={proc.pid} className="hover:bg-slate-900/60 transition-colors">
                            <td className="py-2 pr-3 text-slate-500">{proc.pid}</td>
                            <td className="py-2 pr-3 font-semibold text-slate-100">{proc.name}</td>
                            <td className="py-2 pr-3 text-right text-blue-300">{proc.cpuPercent.toFixed(1)}%</td>
                            <td className="py-2 pr-3 text-right text-cyan-300">{proc.memGb.toFixed(2)} GB</td>
                            <td className="py-2 pr-3 text-right text-emerald-300">{proc.ioMbps.toFixed(1)} MB/s</td>
                            <td className="py-2 text-right text-slate-400">{proc.state}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI Node Health Diagnostic Card */}
                <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <Bot className="w-4 h-4 text-blue-400" />
                      <span>AI Subsystem Health Diagnostic</span>
                    </div>
                    {diagnostic && (
                      <span className="text-[11px] font-mono text-slate-400">
                        {diagnostic.modelUsed}
                      </span>
                    )}
                  </div>

                  {diagnostic ? (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-mono">Primary Bottleneck:</span>
                        <span
                          className={`font-mono font-semibold ${
                            diagnostic.severity === "CRITICAL"
                              ? "text-rose-400"
                              : diagnostic.severity === "ELEVATED"
                                ? "text-amber-400"
                                : "text-emerald-400"
                          }`}
                        >
                          {diagnostic.severity}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-200 bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
                        {diagnostic.bottleneck}
                      </div>
                      <p className="text-slate-300 leading-relaxed">{diagnostic.summary}</p>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {diagnostic.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-cyan-300 flex items-center gap-2 overflow-x-auto">
                        <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <code>{diagnostic.recommendedCli}</code>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center space-y-3">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Run an automated AI Gateway audit against {activeHost.name}&apos;s live CPU, memory, disk I/O, and packet latency telemetry.
                      </p>
                      <button
                        onClick={handleRunAiDiagnostic}
                        disabled={diagnosing}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        {diagnosing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{diagnosing ? "Analyzing Telemetry..." : "Run AI Health Audit"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
