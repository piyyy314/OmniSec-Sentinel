import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { ModuleDef, SimulationResult } from "./types";

export interface PostureDimensionPoint {
  dimension: string;
  current: number;
  baseline24h: number;
  baseline30d: number;
  fullMark: number;
}

interface ExecutiveSimulationSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: ModuleDef | null;
  simulationResult: SimulationResult | null;
  postureComparison: PostureDimensionPoint[];
  systemRiskScore: number;
  overallHealth: number;
  blockchainHeight: number;
  isMitigating: boolean;
  onExecuteMitigation: () => void;
  onAnchorReport: () => void;
}

export const ExecutiveSimulationSummaryModal: React.FC<ExecutiveSimulationSummaryModalProps> = ({
  isOpen,
  onClose,
  module,
  simulationResult,
  postureComparison,
  systemRiskScore,
  overallHealth,
  blockchainHeight,
  isMitigating,
  onExecuteMitigation,
  onAnchorReport,
}) => {
  const [baselineMode, setBaselineMode] = useState<"baseline24h" | "baseline30d">("baseline30d");

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !module || !simulationResult) return null;

  const avgCurrent =
    postureComparison.reduce((acc, p) => acc + p.current, 0) /
    Math.max(postureComparison.length, 1);
  const avgBaseline =
    postureComparison.reduce((acc, p) => acc + p[baselineMode], 0) /
    Math.max(postureComparison.length, 1);
  const netDelta = avgCurrent - avgBaseline;

  const isElevatedRisk =
    simulationResult.status === "Warning" ||
    simulationResult.status === "Critical" ||
    systemRiskScore > 20;

  const statusBadgeStyle =
    simulationResult.status === "Critical"
      ? "bg-red-950/80 text-red-300 border-red-700"
      : simulationResult.status === "Warning"
      ? "bg-amber-950/80 text-amber-300 border-amber-700"
      : simulationResult.status === "Active"
      ? "bg-blue-950/80 text-blue-300 border-blue-700"
      : "bg-emerald-950/80 text-emerald-300 border-emerald-700";

  const StatusIcon =
    simulationResult.status === "Critical"
      ? ShieldAlert
      : simulationResult.status === "Warning"
      ? AlertTriangle
      : simulationResult.status === "Active"
      ? Activity
      : CheckCircle2;

  const completedLabel = simulationResult.timestampIso
    ? new Date(simulationResult.timestampIso).toLocaleTimeString()
    : new Date().toLocaleTimeString();

  return (
    <div
      id="executive-simulation-summary-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exec-summary-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 px-6 py-4 border-b border-slate-800/90 bg-slate-900/50">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>Module #{String(module.id).padStart(2, "0")}</span>
              <span aria-hidden="true">·</span>
              <span>{module.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">Completed {completedLabel}</span>
            </div>
            <h2
              id="exec-summary-modal-title"
              className="text-lg font-bold text-slate-100 tracking-tight"
            >
              Executive Simulation Summary — {module.name}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md border flex items-center space-x-1.5 uppercase ${statusBadgeStyle}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{simulationResult.status}</span>
            </span>
            <button
              id="close-exec-summary-btn"
              type="button"
              onClick={onClose}
              aria-label="Close Executive Simulation Summary"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Top KPI Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3">
              <div className="text-[10px] text-slate-400 uppercase">Posture Composite</div>
              <div className="text-xl font-bold text-slate-100 tabular-nums mt-0.5">
                {avgCurrent.toFixed(1)}
                <span className="text-xs text-slate-500 font-normal"> / 100</span>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3">
              <div className="text-[10px] text-slate-400 uppercase">Delta vs Baseline</div>
              <div
                className={`text-xl font-bold tabular-nums mt-0.5 ${
                  netDelta >= 0 ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {netDelta >= 0 ? "+" : ""}
                {netDelta.toFixed(1)} pts
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3">
              <div className="text-[10px] text-slate-400 uppercase">System Health / Risk</div>
              <div className="text-xl font-bold text-cyan-300 tabular-nums mt-0.5">
                {overallHealth.toFixed(1)}%
                <span className="text-xs text-slate-400 font-normal"> · R:{systemRiskScore}</span>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3">
              <div className="text-[10px] text-slate-400 uppercase">Ledger Anchors</div>
              <div className="text-xl font-bold text-blue-400 tabular-nums mt-0.5">
                {blockchainHeight}
                <span className="text-xs text-slate-500 font-normal"> blocks</span>
              </div>
            </div>
          </div>

          {/* Radar Chart + Dimensional Breakdown Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Radar Chart Column */}
            <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-200">
                    Security Posture vs Historical Baseline
                  </h3>
                </div>

                {/* Segmented Baseline Selector */}
                <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                  <button
                    id="baseline-toggle-30d"
                    type="button"
                    onClick={() => setBaselineMode("baseline30d")}
                    className={`px-2.5 py-1 text-[10px] font-mono rounded transition-colors whitespace-nowrap shrink-0 ${
                      baselineMode === "baseline30d"
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Pre-Hardening (T-30d)
                  </button>
                  <button
                    id="baseline-toggle-24h"
                    type="button"
                    onClick={() => setBaselineMode("baseline24h")}
                    className={`px-2.5 py-1 text-[10px] font-mono rounded transition-colors whitespace-nowrap shrink-0 ${
                      baselineMode === "baseline24h"
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Rolling 24h Baseline
                  </button>
                </div>
              </div>

              <div className="h-[300px] w-full pt-2" id="exec-summary-radar-container">
                <ResponsiveContainer width="100%" height={300} minWidth={240} minHeight={280}>
                  <RadarChart cx="50%" cy="50%" outerRadius="74%" data={postureComparison}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={{ fill: "#cbd5e1", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#64748b", fontSize: 9 }}
                      stroke="#334155"
                    />
                    <Radar
                      name={
                        baselineMode === "baseline30d"
                          ? "Historical Baseline (T-30d)"
                          : "Historical Baseline (24h)"
                      }
                      dataKey={baselineMode}
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="4 3"
                      fill="#f59e0b"
                      fillOpacity={0.18}
                    />
                    <Radar
                      name="Current Security Posture"
                      dataKey="current"
                      stroke="#38bdf8"
                      strokeWidth={2.5}
                      fill="#38bdf8"
                      fillOpacity={0.3}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: "11px",
                        fontFamily: "JetBrains Mono, monospace",
                        paddingTop: "8px",
                      }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontFamily: "JetBrains Mono, monospace",
                        color: "#f1f5f9",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dimension Score Delta Breakdown Column */}
            <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-200 pb-2 border-b border-slate-800/80">
                  Domain Posture Delta
                </h3>
                <div className="divide-y divide-slate-800/60 mt-2">
                  {postureComparison.map((row) => {
                    const baseVal = row[baselineMode];
                    const delta = row.current - baseVal;
                    return (
                      <div
                        key={row.dimension}
                        className="py-2 flex items-center justify-between text-xs font-mono"
                      >
                        <span className="text-slate-300 truncate pr-2">{row.dimension}</span>
                        <div className="flex items-center space-x-3 shrink-0 tabular-nums">
                          <span className="text-slate-500 text-[11px]">{baseVal.toFixed(0)}</span>
                          <span aria-hidden="true" className="text-slate-600">
                            →
                          </span>
                          <span className="text-sky-300 font-bold w-8 text-right">
                            {row.current.toFixed(0)}
                          </span>
                          <span
                            className={`text-[11px] font-semibold w-14 text-right ${
                              delta >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {delta >= 0 ? "+" : ""}
                            {delta.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulation Run Metrics */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Run Telemetry Highlights
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {simulationResult.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px] font-mono"
                    >
                      <span className="text-slate-400 truncate pr-2">{m.label}</span>
                      <span className="text-slate-100 font-bold tabular-nums shrink-0">
                        {m.value}
                        {m.unit ? ` ${m.unit}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Recommendations */}
          {simulationResult.recommendations && simulationResult.recommendations.length > 0 && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Executive Action Guidance</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                {simulationResult.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800/90 bg-slate-900/40">
          <div className="text-[11px] font-mono text-slate-400">
            Comparing live telemetry against{" "}
            {baselineMode === "baseline30d" ? "T-30d pre-hardening audit" : "rolling 24h baseline"}.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isElevatedRisk && (
              <button
                id="exec-summary-mitigate-btn"
                type="button"
                onClick={onExecuteMitigation}
                disabled={isMitigating}
                className="px-3.5 py-2 text-xs font-mono font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors flex items-center space-x-1.5 disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                <Zap className={`w-3.5 h-3.5 ${isMitigating ? "animate-spin" : ""}`} />
                <span>{isMitigating ? "Mitigating..." : "Execute Auto-Mitigation"}</span>
              </button>
            )}
            <button
              id="exec-summary-anchor-btn"
              type="button"
              onClick={onAnchorReport}
              className="px-3.5 py-2 text-xs font-mono font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center space-x-1.5 whitespace-nowrap shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Anchor Summary to Ledger</span>
            </button>
            <button
              id="exec-summary-close-footer-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              Close Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
