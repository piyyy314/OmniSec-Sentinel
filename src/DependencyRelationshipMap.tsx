import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { GitBranch, RotateCcw, ShieldCheck, AlertTriangle, Lock, Network } from "lucide-react";

export type DependencyCategory = "all" | "crypto" | "telemetry" | "containment";

export interface MapHostNodeInput {
  id: string;
  name: string;
  role: string;
  ip: string;
  protocol: string;
  hardware: string;
}

interface DependencyNodeDatum extends d3.SimulationNodeDatum {
  id: string;
  shortLabel: string;
  name: string;
  kind: "host" | "dependency";
  subtitle: string;
  standard: string;
  baseColor: string;
}

interface DependencyLinkDatum extends d3.SimulationLinkDatum<DependencyNodeDatum> {
  id: string;
  source: string | DependencyNodeDatum;
  target: string | DependencyNodeDatum;
  category: Exclude<DependencyCategory, "all">;
  protocol: string;
  criticality: "Critical" | "High" | "Medium";
  description: string;
}

interface DependencyRelationshipMapProps {
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  isolatedNodes: string[];
  simulatedSurgeNodes: Record<string, boolean>;
  throttledNodes: Record<string, { count: number; originalLimit: number }>;
  hostNodes: Record<string, MapHostNodeInput>;
}

const DEPENDENCY_NODES: DependencyNodeDatum[] = [
  {
    id: "node-1",
    shortLabel: "GW1",
    name: "Ingress Edge Gateway",
    kind: "host",
    subtitle: "10.0.1.1 · Perimeter Router",
    standard: "TLS 1.3 / ML-KEM-768",
    baseColor: "#38bdf8",
  },
  {
    id: "node-2",
    shortLabel: "VQC",
    name: "VQC Quantum Core",
    kind: "host",
    subtitle: "10.0.2.14 · 8-Qubit Classifier",
    standard: "Q-gRPC / DisCoCat",
    baseColor: "#60a5fa",
  },
  {
    id: "node-3",
    shortLabel: "S3",
    name: "AWS S3 Log Store",
    kind: "host",
    subtitle: "10.0.3.50 · Audit Lake",
    standard: "HTTPS / S3 Object Lock",
    baseColor: "#fbbf24",
  },
  {
    id: "node-4",
    shortLabel: "GNN",
    name: "GNN Criticality Pivot 04",
    kind: "host",
    subtitle: "10.0.4.92 · Message Passing",
    standard: "ZeroMQ / WireGuard Mesh",
    baseColor: "#34d399",
  },
  {
    id: "node-5",
    shortLabel: "HONEY",
    name: "Deception Honeytoken",
    kind: "host",
    subtitle: "10.0.9.99 · Sinkhole Mesh",
    standard: "Isolated MicroVM Decoy",
    baseColor: "#c084fc",
  },
  {
    id: "dep-pqc",
    shortLabel: "PQC-KMS",
    name: "Post-Quantum KMS",
    kind: "dependency",
    subtitle: "Security Dependency",
    standard: "FIPS 203/204 · ML-KEM-768 & Dilithium-3",
    baseColor: "#2dd4bf",
  },
  {
    id: "dep-ebpf",
    shortLabel: "eBPF-XDP",
    name: "eBPF Ingress Filter",
    kind: "dependency",
    subtitle: "Security Dependency",
    standard: "Kernel Token-Bucket & Port 4220 Drop",
    baseColor: "#818cf8",
  },
  {
    id: "dep-iam",
    shortLabel: "IAM-ACL",
    name: "Zero-Trust IAM Policy",
    kind: "dependency",
    subtitle: "Security Dependency",
    standard: "Least-Privilege + Public Access Block",
    baseColor: "#f59e0b",
  },
  {
    id: "dep-ledger",
    shortLabel: "LEDGER",
    name: "SHA-256 Audit Ledger",
    kind: "dependency",
    subtitle: "Security Dependency",
    standard: "Immutable Peer Block Anchoring",
    baseColor: "#10b981",
  },
  {
    id: "dep-sandbox",
    shortLabel: "ENCLAVE",
    name: "MicroVM Quarantine",
    kind: "dependency",
    subtitle: "Security Dependency",
    standard: "Zero-Entropy Containment Lattice",
    baseColor: "#f472b6",
  },
];

const DEPENDENCY_LINKS: DependencyLinkDatum[] = [
  {
    id: "edge-gw1-pqc",
    source: "node-1",
    target: "dep-pqc",
    category: "crypto",
    protocol: "ML-KEM-768",
    criticality: "Critical",
    description: "Ingress Gateway enforces NIST post-quantum key encapsulation via PQC KMS.",
  },
  {
    id: "edge-gw1-ebpf",
    source: "node-1",
    target: "dep-ebpf",
    category: "containment",
    protocol: "XDP Hook",
    criticality: "Critical",
    description: "Kernel eBPF driver drops unauthorized port 4220 beacons and enforces 50% auto-throttle limits.",
  },
  {
    id: "edge-gw1-vqc",
    source: "node-1",
    target: "node-2",
    category: "telemetry",
    protocol: "Q-gRPC",
    criticality: "High",
    description: "Streams normalized packet features from perimeter router to 8-qubit VQC classifier.",
  },
  {
    id: "edge-gw1-s3",
    source: "node-1",
    target: "node-3",
    category: "telemetry",
    protocol: "TLS Audit",
    criticality: "High",
    description: "Ships ingress flow audit trails to immutable S3 backup storage.",
  },
  {
    id: "edge-vqc-pqc",
    source: "node-2",
    target: "dep-pqc",
    category: "crypto",
    protocol: "Dilithium-3",
    criticality: "High",
    description: "Verifies variational quantum circuit parameter signatures before inference.",
  },
  {
    id: "edge-vqc-gnn",
    source: "node-2",
    target: "node-4",
    category: "telemetry",
    protocol: "DisCoCat Bus",
    criticality: "Critical",
    description: "Publishes anomaly scores into GNN message-passing centrality topology.",
  },
  {
    id: "edge-s3-ledger",
    source: "node-3",
    target: "dep-ledger",
    category: "crypto",
    protocol: "SHA-256",
    criticality: "Critical",
    description: "Anchors S3 Object Lock snapshots onto Chronos peer blockchain blocks.",
  },
  {
    id: "edge-s3-iam",
    source: "node-3",
    target: "dep-iam",
    category: "crypto",
    protocol: "AES-256 KMS",
    criticality: "Critical",
    description: "Enforces S3 Public Access Block and strict least-privilege sandbox IAM boundaries.",
  },
  {
    id: "edge-gnn-iam",
    source: "node-4",
    target: "dep-iam",
    category: "containment",
    protocol: "Zero-Trust ACL",
    criticality: "High",
    description: "Applies micro-segmentation ACLs across routing backbone #4 to prevent lateral pivot.",
  },
  {
    id: "edge-gnn-honey",
    source: "node-4",
    target: "node-5",
    category: "containment",
    protocol: "Sinkhole Route",
    criticality: "High",
    description: "Redirects anomalous traversal probes from GNN Pivot Node into Honeytoken Trap.",
  },
  {
    id: "edge-honey-sandbox",
    source: "node-5",
    target: "dep-sandbox",
    category: "containment",
    protocol: "Bell Collapse",
    criticality: "Critical",
    description: "Captures adversary session probes inside air-gapped MicroVM quarantine.",
  },
  {
    id: "edge-s3-gnn",
    source: "node-3",
    target: "node-4",
    category: "telemetry",
    protocol: "SCM Feed",
    criticality: "Medium",
    description: "Feeds historical access records for structural causal counterfactual verification.",
  },
];

const CATEGORY_COLORS: Record<Exclude<DependencyCategory, "all">, string> = {
  crypto: "#2dd4bf",
  telemetry: "#60a5fa",
  containment: "#f59e0b",
};

const CATEGORY_LABELS: Record<DependencyCategory, string> = {
  all: "All Dependencies",
  crypto: "Crypto & Trust",
  telemetry: "Telemetry Flow",
  containment: "Containment",
};

export const DependencyRelationshipMap: React.FC<DependencyRelationshipMapProps> = ({
  selectedNodeId,
  onSelectNode,
  isolatedNodes,
  simulatedSurgeNodes,
  throttledNodes,
  hostNodes,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<DependencyCategory>("all");
  const [selectedEntity, setSelectedEntity] = useState<{
    type: "node" | "link";
    id: string;
  }>({ type: "node", id: selectedNodeId });
  const [layoutSeed, setLayoutSeed] = useState<number>(0);

  // Sync external node selection into inspector
  useEffect(() => {
    setSelectedEntity({ type: "node", id: selectedNodeId });
  }, [selectedNodeId]);

  const visibleLinks = useMemo(() => {
    if (categoryFilter === "all") return DEPENDENCY_LINKS;
    return DEPENDENCY_LINKS.filter((l) => l.category === categoryFilter);
  }, [categoryFilter]);

  const inspectorDetail = useMemo(() => {
    if (selectedEntity.type === "link") {
      const link = DEPENDENCY_LINKS.find((l) => l.id === selectedEntity.id);
      if (link) {
        const srcId = typeof link.source === "string" ? link.source : link.source.id;
        const tgtId = typeof link.target === "string" ? link.target : link.target.id;
        const srcNode = DEPENDENCY_NODES.find((n) => n.id === srcId);
        const tgtNode = DEPENDENCY_NODES.find((n) => n.id === tgtId);
        const srcIsolated = isolatedNodes.includes(srcId);
        const tgtIsolated = isolatedNodes.includes(tgtId);
        return {
          kind: "link" as const,
          title: `${srcNode?.shortLabel || srcId} → ${tgtNode?.shortLabel || tgtId}`,
          badge: `${link.protocol} · ${link.criticality}`,
          description: link.description,
          statusLabel:
            srcIsolated || tgtIsolated ? "SEVERED (HOST ISOLATED)" : "VERIFIED ACTIVE",
          isAlert: srcIsolated || tgtIsolated,
        };
      }
    }

    const targetId = selectedEntity.id || selectedNodeId;
    const depNode = DEPENDENCY_NODES.find((n) => n.id === targetId);
    const host = hostNodes[targetId];
    const connected = DEPENDENCY_LINKS.filter((l) => {
      const s = typeof l.source === "string" ? l.source : l.source.id;
      const t = typeof l.target === "string" ? l.target : l.target.id;
      return s === targetId || t === targetId;
    });

    const isIsolated = isolatedNodes.includes(targetId);
    const isSurging = !!simulatedSurgeNodes[targetId];
    const isThrottled = !!throttledNodes[targetId];

    return {
      kind: "node" as const,
      title: host ? `${host.name} (${host.id.toUpperCase()})` : depNode?.name || targetId,
      badge: host ? `${host.ip} · ${host.protocol}` : depNode?.standard || "Security Dependency",
      description: host
        ? `${host.role}. Connected to ${connected.length} logical dependency edges across the zero-trust fabric.`
        : `${depNode?.standard}. Enforces cryptographic/containment guarantees across ${connected.length} linked infrastructure hosts.`,
      statusLabel: isIsolated
        ? "ISOLATED"
        : isSurging
        ? "INGRESS SURGE"
        : isThrottled
        ? "THROTTLED -50%"
        : "NOMINAL",
      isAlert: isIsolated || isSurging,
      connectedCount: connected.length,
    };
  }, [
    selectedEntity,
    selectedNodeId,
    hostNodes,
    isolatedNodes,
    simulatedSurgeNodes,
    throttledNodes,
  ]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const width = 620;
    const height = 340;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const nodes: DependencyNodeDatum[] = DEPENDENCY_NODES.map((d, i) => ({
      ...d,
      x: width / 2 + Math.cos((i / DEPENDENCY_NODES.length) * Math.PI * 2) * 120,
      y: height / 2 + Math.sin((i / DEPENDENCY_NODES.length) * Math.PI * 2) * 90,
    }));

    const links: DependencyLinkDatum[] = visibleLinks.map((l) => ({ ...l }));

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    (["crypto", "telemetry", "containment", "severed"] as const).forEach((cat) => {
      const color = cat === "severed" ? "#ef4444" : CATEGORY_COLORS[cat];
      defs
        .append("marker")
        .attr("id", `dep-arrow-${cat}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 24)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L10,0L0,4")
        .attr("fill", color)
        .attr("fill-opacity", 0.85);
    });

    // Subtle radial backdrop grid
    const gridGroup = svg.append("g").attr("class", "dep-grid");
    [70, 130, 190].forEach((r) => {
      gridGroup
        .append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "#1e293b")
        .attr("stroke-dasharray", "3 4")
        .attr("stroke-opacity", 0.55);
    });

    const linkGroup = svg.append("g").attr("class", "dep-links");
    const labelGroup = svg.append("g").attr("class", "dep-link-labels");
    const nodeGroup = svg.append("g").attr("class", "dep-nodes");

    const linkSelection = linkGroup
      .selectAll<SVGLineElement, DependencyLinkDatum>("line")
      .data(links, (d) => d.id)
      .join("line")
      .attr("stroke", (d) => {
        const sId = typeof d.source === "string" ? d.source : d.source.id;
        const tId = typeof d.target === "string" ? d.target : d.target.id;
        if (isolatedNodes.includes(sId) || isolatedNodes.includes(tId)) return "#ef4444";
        return CATEGORY_COLORS[d.category];
      })
      .attr("stroke-width", (d) =>
        selectedEntity.type === "link" && selectedEntity.id === d.id
          ? 2.8
          : d.criticality === "Critical"
          ? 2
          : 1.4
      )
      .attr("stroke-opacity", (d) => {
        const sId = typeof d.source === "string" ? d.source : d.source.id;
        const tId = typeof d.target === "string" ? d.target : d.target.id;
        const activeTarget = selectedEntity.id || selectedNodeId;
        if (selectedEntity.type === "link") {
          return selectedEntity.id === d.id ? 0.95 : 0.28;
        }
        return sId === activeTarget || tId === activeTarget ? 0.95 : 0.42;
      })
      .attr("stroke-dasharray", (d) => {
        const sId = typeof d.source === "string" ? d.source : d.source.id;
        const tId = typeof d.target === "string" ? d.target : d.target.id;
        if (isolatedNodes.includes(sId) || isolatedNodes.includes(tId)) return "4 4";
        return d.category === "crypto" ? "none" : "5 3";
      })
      .attr("marker-end", (d) => {
        const sId = typeof d.source === "string" ? d.source : d.source.id;
        const tId = typeof d.target === "string" ? d.target : d.target.id;
        if (isolatedNodes.includes(sId) || isolatedNodes.includes(tId)) {
          return "url(#dep-arrow-severed)";
        }
        return `url(#dep-arrow-${d.category})`;
      })
      .style("cursor", "pointer")
      .on("click", (_event, d) => {
        setSelectedEntity({ type: "link", id: d.id });
      });

    const linkLabelSelection = labelGroup
      .selectAll<SVGTextElement, DependencyLinkDatum>("text")
      .data(links, (d) => d.id)
      .join("text")
      .text((d) => d.protocol)
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("fill", (d) =>
        selectedEntity.type === "link" && selectedEntity.id === d.id ? "#f8fafc" : "#94a3b8"
      )
      .attr("pointer-events", "none");

    const simulation = d3
      .forceSimulation<DependencyNodeDatum>(nodes)
      .force(
        "link",
        d3
          .forceLink<DependencyNodeDatum, DependencyLinkDatum>(links)
          .id((d) => d.id)
          .distance((d) => (d.criticality === "Critical" ? 96 : 120))
          .strength(0.65)
      )
      .force("charge", d3.forceManyBody().strength(-320))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide<DependencyNodeDatum>().radius(32))
      .force("x", d3.forceX(width / 2).strength(0.06))
      .force("y", d3.forceY(height / 2).strength(0.08));

    const dragBehavior = d3
      .drag<SVGGElement, DependencyNodeDatum>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.28).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = Math.max(30, Math.min(width - 30, event.x));
        d.fy = Math.max(30, Math.min(height - 30, event.y));
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const nodeSelection = nodeGroup
      .selectAll<SVGGElement, DependencyNodeDatum>("g")
      .data(nodes, (d) => d.id)
      .join("g")
      .style("cursor", "grab")
      .call(dragBehavior)
      .on("click", (_event, d) => {
        setSelectedEntity({ type: "node", id: d.id });
        if (d.kind === "host") {
          onSelectNode(d.id);
        }
      });

    // Outer highlight ring for selected / alert nodes
    nodeSelection
      .append("circle")
      .attr("r", (d) => (d.kind === "host" ? 23 : 20))
      .attr("fill", "none")
      .attr("stroke", (d) => {
        const isSel = selectedEntity.type === "node" && selectedEntity.id === d.id;
        const isHostSel = d.kind === "host" && selectedNodeId === d.id;
        if (isolatedNodes.includes(d.id)) return "#ef4444";
        if (simulatedSurgeNodes[d.id]) return "#f43f5e";
        if (isSel || isHostSel) return "#38bdf8";
        return "transparent";
      })
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) => (isolatedNodes.includes(d.id) ? "3 2" : "none"))
      .attr("stroke-opacity", 0.85);

    // Host circles vs Security Dependency diamonds/hex-feel rounded rects
    nodeSelection.each(function (d) {
      const g = d3.select(this);
      const isIsolated = isolatedNodes.includes(d.id);
      const isSurging = !!simulatedSurgeNodes[d.id];
      const strokeColor = isIsolated ? "#ef4444" : isSurging ? "#f43f5e" : d.baseColor;

      if (d.kind === "host") {
        g.append("circle")
          .attr("r", 18)
          .attr("fill", "#0f172a")
          .attr("stroke", strokeColor)
          .attr("stroke-width", selectedNodeId === d.id ? 2.5 : 1.75);
      } else {
        g.append("rect")
          .attr("x", -17)
          .attr("y", -14)
          .attr("width", 34)
          .attr("height", 28)
          .attr("rx", 6)
          .attr("fill", "#0b1220")
          .attr("stroke", strokeColor)
          .attr("stroke-width", selectedEntity.id === d.id ? 2.4 : 1.5);
      }

      g.append("text")
        .text(d.shortLabel)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-size", d.kind === "host" ? "9px" : "7.5px")
        .attr("font-weight", "700")
        .attr("font-family", "JetBrains Mono, monospace")
        .attr("fill", isIsolated ? "#fca5a5" : "#e2e8f0")
        .attr("pointer-events", "none");

      g.append("text")
        .text(d.kind === "host" ? d.id.toUpperCase() : "DEP")
        .attr("text-anchor", "middle")
        .attr("y", 29)
        .attr("font-size", "7.5px")
        .attr("font-family", "JetBrains Mono, monospace")
        .attr("fill", "#64748b")
        .attr("pointer-events", "none");
    });

    const updatePositions = () => {
      nodes.forEach((n) => {
        n.x = Math.max(32, Math.min(width - 32, n.x ?? width / 2));
        n.y = Math.max(32, Math.min(height - 36, n.y ?? height / 2));
      });

      linkSelection
        .attr("x1", (d) => (d.source as DependencyNodeDatum).x ?? 0)
        .attr("y1", (d) => (d.source as DependencyNodeDatum).y ?? 0)
        .attr("x2", (d) => (d.target as DependencyNodeDatum).x ?? 0)
        .attr("y2", (d) => (d.target as DependencyNodeDatum).y ?? 0);

      linkLabelSelection
        .attr("x", (d) => {
          const sx = (d.source as DependencyNodeDatum).x ?? 0;
          const tx = (d.target as DependencyNodeDatum).x ?? 0;
          return (sx + tx) / 2;
        })
        .attr("y", (d) => {
          const sy = (d.source as DependencyNodeDatum).y ?? 0;
          const ty = (d.target as DependencyNodeDatum).y ?? 0;
          return (sy + ty) / 2 - 4;
        });

      nodeSelection.attr("transform", (d) => `translate(${d.x ?? width / 2}, ${d.y ?? height / 2})`);
    };

    if (prefersReducedMotion) {
      simulation.stop();
      for (let i = 0; i < 140; i++) simulation.tick();
      updatePositions();
    } else {
      simulation.on("tick", updatePositions);
      simulation.alpha(0.9).restart();
    }

    return () => {
      simulation.stop();
    };
  }, [
    visibleLinks,
    isolatedNodes,
    simulatedSurgeNodes,
    selectedNodeId,
    selectedEntity,
    layoutSeed,
    onSelectNode,
  ]);

  return (
    <div
      id="dependency-relationship-map"
      className="bg-slate-900/50 border border-slate-800/90 rounded-xl p-4 space-y-3"
    >
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-200">
              Dependency Relationship Map
            </h4>
            <p className="text-[10px] font-mono text-slate-400">
              d3-force topological links between hosts &amp; security dependencies · Drag nodes to inspect
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "crypto", "telemetry", "containment"] as DependencyCategory[]).map((cat) => (
            <button
              key={cat}
              id={`dep-filter-${cat}`}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2 py-1 text-[10px] font-mono rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? "bg-blue-600/20 border-blue-500/70 text-blue-300 font-semibold"
                  : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
          <button
            id="dep-reset-layout-btn"
            type="button"
            onClick={() => setLayoutSeed((s) => s + 1)}
            className="px-2 py-1 text-[10px] font-mono rounded-md bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center space-x-1 whitespace-nowrap shrink-0"
            title="Re-run force simulation layout"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Re-center</span>
          </button>
        </div>
      </div>

      {/* Legend Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-sky-400 bg-slate-900 inline-block" />
            <span>Host Node</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm border-2 border-teal-400 bg-slate-950 inline-block" />
            <span>Security Dependency</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-0.5 bg-teal-400 inline-block" />
            <span>Crypto</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-0.5 bg-blue-400 inline-block" />
            <span>Telemetry</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-0.5 bg-amber-400 inline-block" />
            <span>Containment</span>
          </span>
        </div>
        <span className="tabular-nums text-slate-500">
          {DEPENDENCY_NODES.length} Nodes · {visibleLinks.length} Active Links
        </span>
      </div>

      {/* d3-force SVG Viewport */}
      <div className="relative bg-slate-950/90 border border-slate-800/80 rounded-lg overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 620 340"
          className="w-full h-[300px] sm:h-[330px] select-none"
          aria-label="Interactive D3 Force Dependency Relationship Map"
        />
      </div>

      {/* Selected Node or Link Dependency Inspector */}
      <div
        id="dependency-inspector-bar"
        className={`rounded-lg border p-3 text-xs font-mono space-y-1.5 ${
          inspectorDetail.isAlert
            ? "bg-red-950/35 border-red-800/70 text-red-100"
            : "bg-slate-950/80 border-slate-800 text-slate-200"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            {inspectorDetail.kind === "link" ? (
              <Network className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            ) : inspectorDetail.isAlert ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span className="font-bold text-slate-100">{inspectorDetail.title}</span>
            <span className="text-[10px] text-slate-400">{inspectorDetail.badge}</span>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center space-x-1 ${
              inspectorDetail.isAlert
                ? "bg-red-950/80 text-red-300 border-red-700"
                : "bg-emerald-950/70 text-emerald-300 border-emerald-800/70"
            }`}
          >
            <Lock className="w-2.5 h-2.5" />
            <span>{inspectorDetail.statusLabel}</span>
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">{inspectorDetail.description}</p>
      </div>
    </div>
  );
};
