import os from "os";

export interface NodeHardwareProfile {
  id: string;
  name: string;
  role: string;
  ip: string;
  protocol: string;
  hardware: string;
  cpuModel: string;
  cpuCores: number;
  memoryTotalGb: number;
  diskDevice: string;
  diskCapacityTb: number;
  diskUsedPercent: number;
  baseCpuPercent: number;
  baseMemPercent: number;
  baseDiskReadMbps: number;
  baseDiskWriteMbps: number;
  baseDiskIops: number;
  baseTrafficPps: number;
  defaultTrafficLimitPps: number;
  baseLatencyMs: number;
  processes: Array<{ pid: number; name: string; cpuBase: number; memGbBase: number; ioBase: number; state: string }>;
}

export const NODE_PROFILES: Record<string, NodeHardwareProfile> = {
  "node-1": {
    id: "node-1",
    name: "Ingress Edge Gateway (GW1)",
    role: "Perimeter Decryption & Zero-Trust Mesh Router",
    ip: "10.0.1.1",
    protocol: "TLS 1.3 / ML-KEM-768",
    hardware: "FPGA Wire-Speed NIC",
    cpuModel: "AMD EPYC 9354P · 16 vCPU",
    cpuCores: 8,
    memoryTotalGb: 64,
    diskDevice: "/dev/nvme0n1 (PCIe 5.0)",
    diskCapacityTb: 2.0,
    diskUsedPercent: 34.2,
    baseCpuPercent: 31.5,
    baseMemPercent: 42.0,
    baseDiskReadMbps: 84.2,
    baseDiskWriteMbps: 112.6,
    baseDiskIops: 4820,
    baseTrafficPps: 4250,
    defaultTrafficLimitPps: 8000,
    baseLatencyMs: 1.25,
    processes: [
      { pid: 1104, name: "xdp-ingress-filter", cpuBase: 14.2, memGbBase: 6.8, ioBase: 48.2, state: "R (running)" },
      { pid: 1288, name: "mlkem-tls-terminator", cpuBase: 9.8, memGbBase: 11.4, ioBase: 22.1, state: "S (sleeping)" },
      { pid: 1410, name: "envoy-mesh-proxy", cpuBase: 4.9, memGbBase: 5.2, ioBase: 31.4, state: "S (sleeping)" },
      { pid: 1622, name: "chronos-ebpf-exporter", cpuBase: 2.6, memGbBase: 3.4, ioBase: 18.9, state: "S (sleeping)" },
    ],
  },
  "node-2": {
    id: "node-2",
    name: "Variational Quantum Circuit (VQC Core)",
    role: "Quantum Anomaly Classifier & State Vector Inference",
    ip: "10.0.2.14",
    protocol: "Q-gRPC / DisCoCat Bus",
    hardware: "QPU Simulator Co-Processor",
    cpuModel: "Intel Xeon Emerald Rapids · 16 vCPU",
    cpuCores: 8,
    memoryTotalGb: 128,
    diskDevice: "/dev/nvme1n1 (RAID-10)",
    diskCapacityTb: 4.0,
    diskUsedPercent: 48.6,
    baseCpuPercent: 58.4,
    baseMemPercent: 64.5,
    baseDiskReadMbps: 210.5,
    baseDiskWriteMbps: 94.3,
    baseDiskIops: 7640,
    baseTrafficPps: 5820,
    defaultTrafficLimitPps: 7500,
    baseLatencyMs: 4.62,
    processes: [
      { pid: 2102, name: "vqc-hilbert-engine", cpuBase: 34.6, memGbBase: 48.2, ioBase: 142.0, state: "R (running)" },
      { pid: 2245, name: "param-shift-grad", cpuBase: 16.2, memGbBase: 21.8, ioBase: 68.4, state: "R (running)" },
      { pid: 2390, name: "qgrpc-telemetry-bus", cpuBase: 5.1, memGbBase: 8.6, ioBase: 41.2, state: "S (sleeping)" },
      { pid: 2514, name: "statevec-checkpointd", cpuBase: 2.5, memGbBase: 4.0, ioBase: 53.2, state: "S (sleeping)" },
    ],
  },
  "node-3": {
    id: "node-3",
    name: "Cloud AWS S3 Bucket Log Store",
    role: "Decentralized Immutable Audit Lake",
    ip: "10.0.3.50",
    protocol: "HTTPS / S3 Object Lock",
    hardware: "Distributed NVMe Mesh",
    cpuModel: "AWS Graviton4 · 8 vCPU",
    cpuCores: 8,
    memoryTotalGb: 32,
    diskDevice: "/dev/nvme2n1 (ZFS Pool)",
    diskCapacityTb: 16.0,
    diskUsedPercent: 67.8,
    baseCpuPercent: 24.8,
    baseMemPercent: 54.0,
    baseDiskReadMbps: 420.8,
    baseDiskWriteMbps: 385.4,
    baseDiskIops: 14200,
    baseTrafficPps: 2410,
    defaultTrafficLimitPps: 6000,
    baseLatencyMs: 14.85,
    processes: [
      { pid: 3041, name: "minio-object-lockd", cpuBase: 11.4, memGbBase: 9.8, ioBase: 490.2, state: "D (disk-io)" },
      { pid: 3180, name: "sha256-merkle-sealer", cpuBase: 7.8, memGbBase: 4.1, ioBase: 184.6, state: "R (running)" },
      { pid: 3294, name: "zstd-log-compactor", cpuBase: 4.2, memGbBase: 2.4, ioBase: 98.4, state: "S (sleeping)" },
      { pid: 3412, name: "s3-audit-replicator", cpuBase: 1.4, memGbBase: 1.0, ioBase: 33.0, state: "S (sleeping)" },
    ],
  },
  "node-4": {
    id: "node-4",
    name: "GNN Criticality Pivot Node 04",
    role: "Graph Neural Network Message Passing Correlator",
    ip: "10.0.4.92",
    protocol: "ZeroMQ / WireGuard Mesh",
    hardware: "Tensor Core Neural Accel",
    cpuModel: "AMD EPYC 9654 · 16 vCPU",
    cpuCores: 8,
    memoryTotalGb: 96,
    diskDevice: "/dev/nvme0n1 (PCIe 4.0)",
    diskCapacityTb: 4.0,
    diskUsedPercent: 52.1,
    baseCpuPercent: 63.2,
    baseMemPercent: 71.8,
    baseDiskReadMbps: 178.4,
    baseDiskWriteMbps: 146.9,
    baseDiskIops: 9120,
    baseTrafficPps: 7120,
    defaultTrafficLimitPps: 7800,
    baseLatencyMs: 6.22,
    processes: [
      { pid: 4018, name: "gnn-message-passer", cpuBase: 38.4, memGbBase: 44.6, ioBase: 162.4, state: "R (running)" },
      { pid: 4192, name: "centrality-solver", cpuBase: 15.2, memGbBase: 15.2, ioBase: 88.2, state: "R (running)" },
      { pid: 4280, name: "wireguard-kthread", cpuBase: 6.4, memGbBase: 5.8, ioBase: 46.7, state: "S (sleeping)" },
      { pid: 4399, name: "zmq-topology-sync", cpuBase: 3.2, memGbBase: 3.3, ioBase: 28.0, state: "S (sleeping)" },
    ],
  },
  "node-5": {
    id: "node-5",
    name: "Deception Honeytoken Trap",
    role: "Synthetic Adversary Decoy & Sinkhole Mesh",
    ip: "10.0.9.99",
    protocol: "Emulated SSH / RDP Decoy",
    hardware: "Isolated MicroVM Sandbox",
    cpuModel: "Intel Xeon Gold 6430 · 8 vCPU",
    cpuCores: 8,
    memoryTotalGb: 32,
    diskDevice: "/dev/vda1 (Firecracker Snap)",
    diskCapacityTb: 1.0,
    diskUsedPercent: 28.4,
    baseCpuPercent: 74.5,
    baseMemPercent: 61.2,
    baseDiskReadMbps: 92.6,
    baseDiskWriteMbps: 264.8,
    baseDiskIops: 11850,
    baseTrafficPps: 11450,
    defaultTrafficLimitPps: 8000,
    baseLatencyMs: 2.38,
    processes: [
      { pid: 5012, name: "sinkhole-pcap-tap", cpuBase: 34.8, memGbBase: 9.4, ioBase: 198.2, state: "R (running)" },
      { pid: 5119, name: "ssh-honeypot-vm", cpuBase: 22.1, memGbBase: 5.8, ioBase: 86.4, state: "R (running)" },
      { pid: 5240, name: "qkd-bell-trap", cpuBase: 11.4, memGbBase: 3.1, ioBase: 42.8, state: "S (sleeping)" },
      { pid: 5388, name: "forensic-key-vault", cpuBase: 6.2, memGbBase: 1.3, ioBase: 30.0, state: "S (sleeping)" },
    ],
  },
};

export interface NodeGranularTelemetry {
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

const serverTrafficLimits: Record<string, number> = {
  "node-1": NODE_PROFILES["node-1"].defaultTrafficLimitPps,
  "node-2": NODE_PROFILES["node-2"].defaultTrafficLimitPps,
  "node-3": NODE_PROFILES["node-3"].defaultTrafficLimitPps,
  "node-4": NODE_PROFILES["node-4"].defaultTrafficLimitPps,
  "node-5": NODE_PROFILES["node-5"].defaultTrafficLimitPps,
};

const serverThrottleCounts: Record<string, number> = {};

export function applyServerThrottle(nodeId: string): {
  nodeId: string;
  previousLimit: number;
  newLimit: number;
  throttleCount: number;
} | null {
  const profile = NODE_PROFILES[nodeId];
  if (!profile) return null;
  const prev = serverTrafficLimits[nodeId] ?? profile.defaultTrafficLimitPps;
  const next = Math.max(500, Math.round(prev * 0.5));
  serverTrafficLimits[nodeId] = next;
  serverThrottleCounts[nodeId] = (serverThrottleCounts[nodeId] || 0) + 1;
  return {
    nodeId,
    previousLimit: prev,
    newLimit: next,
    throttleCount: serverThrottleCounts[nodeId],
  };
}

export function resetServerThrottle(nodeId: string): {
  nodeId: string;
  restoredLimit: number;
} | null {
  const profile = NODE_PROFILES[nodeId];
  if (!profile) return null;
  serverTrafficLimits[nodeId] = profile.defaultTrafficLimitPps;
  serverThrottleCounts[nodeId] = 0;
  return {
    nodeId,
    restoredLimit: profile.defaultTrafficLimitPps,
  };
}

export function getNodeGranularTelemetry(
  nodeId: string,
  options?: { isSurging?: boolean; isIsolated?: boolean }
): NodeGranularTelemetry | null {
  const profile = NODE_PROFILES[nodeId];
  if (!profile) return null;

  const isSurging = options?.isSurging ?? nodeId === "node-5";
  const isIsolated = options?.isIsolated ?? false;

  const totalHostMem = os.totalmem();
  const freeHostMem = os.freemem();
  const hostMemUsagePercent = +(((totalHostMem - freeHostMem) / totalHostMem) * 100).toFixed(1);
  const rawLoad = os.loadavg();
  const hostLoadAvg: [number, number, number] = [
    +(rawLoad[0] || 0).toFixed(2),
    +(rawLoad[1] || 0).toFixed(2),
    +(rawLoad[2] || 0).toFixed(2),
  ];

  const surgeCpuBoost = isSurging ? 22.5 : 0;
  const surgeMemBoost = isSurging ? 12.0 : 0;
  const surgeIoMultiplier = isSurging ? 1.65 : 1.0;

  const cpuRaw = isIsolated
    ? 2.4 + Math.random() * 1.1
    : Math.min(98.4, Math.max(4.0, profile.baseCpuPercent + surgeCpuBoost + (Math.random() - 0.5) * 6.5));
  const totalPercent = +cpuRaw.toFixed(1);
  const userPercent = +(totalPercent * 0.64).toFixed(1);
  const systemPercent = +(totalPercent * (isSurging ? 0.27 : 0.22)).toFixed(1);
  const iowaitPercent = +(Math.max(0.2, totalPercent - userPercent - systemPercent)).toFixed(1);
  const idlePercent = +(Math.max(0, 100 - totalPercent)).toFixed(1);

  const cores = Array.from({ length: profile.cpuCores }, (_, i) => {
    const wave = Math.sin(Date.now() / 1300 + i * 0.9) * 7.5;
    const val = isIsolated
      ? 1.5 + Math.random() * 2.5
      : Math.min(99.5, Math.max(3.0, totalPercent + wave + (Math.random() - 0.5) * 6));
    return +val.toFixed(1);
  });

  const memUsagePercent = isIsolated
    ? 14.2
    : +Math.min(96.8, Math.max(12.0, profile.baseMemPercent + surgeMemBoost + (Math.random() - 0.5) * 3.0)).toFixed(1);
  const usedGb = +((memUsagePercent / 100) * profile.memoryTotalGb).toFixed(2);
  const activeHeapGb = +(usedGb * 0.58).toFixed(2);
  const pageCacheGb = +(usedGb * 0.27).toFixed(2);
  const kernelSlabGb = +(Math.max(0.1, usedGb - activeHeapGb - pageCacheGb)).toFixed(2);
  const freeGb = +(Math.max(0, profile.memoryTotalGb - usedGb)).toFixed(2);
  const swapTotalGb = 8.0;
  const swapUsedGb = memUsagePercent > 80 ? +((memUsagePercent - 75) * 0.12).toFixed(2) : 0.14;

  const readMbps = isIsolated
    ? +(2.1 + Math.random() * 1.4).toFixed(1)
    : +(profile.baseDiskReadMbps * surgeIoMultiplier + (Math.random() - 0.5) * 18).toFixed(1);
  const writeMbps = isIsolated
    ? +(1.4 + Math.random() * 0.9).toFixed(1)
    : +(profile.baseDiskWriteMbps * surgeIoMultiplier + (Math.random() - 0.5) * 22).toFixed(1);
  const totalIops = isIsolated
    ? Math.round(140 + Math.random() * 60)
    : Math.round(profile.baseDiskIops * surgeIoMultiplier + (Math.random() - 0.5) * 650);
  const readIops = Math.round(totalIops * (readMbps / Math.max(readMbps + writeMbps, 1)));
  const writeIops = Math.max(0, totalIops - readIops);
  const queueDepth = isIsolated ? 1 : Math.max(1, Math.round((totalIops / 2400) * (isSurging ? 2.1 : 1)));
  const avgAwaitMs = isIsolated
    ? 0.18
    : +(0.45 + queueDepth * 0.42 + (isSurging ? 2.4 : 0) + Math.random() * 0.4).toFixed(2);

  const history = Array.from({ length: 30 }, (_, idx) => {
    const secsAgo = (29 - idx) * 2;
    const timeLabel = secsAgo === 0 ? "Now" : `-${secsAgo}s`;
    const trend = Math.sin((idx + Date.now() / 2000) * 0.35);
    const histCpu = isIsolated
      ? +(2.4 + Math.random() * 0.8).toFixed(1)
      : +Math.min(98, Math.max(5, totalPercent + trend * 5.5 + (Math.random() - 0.5) * 3)).toFixed(1);
    const histMem = isIsolated
      ? 14.2
      : +Math.min(96, Math.max(10, memUsagePercent + trend * 1.8)).toFixed(1);
    const histRead = isIsolated
      ? 2.2
      : +Math.max(5, readMbps + trend * 24 + (Math.random() - 0.5) * 10).toFixed(1);
    const histWrite = isIsolated
      ? 1.5
      : +Math.max(4, writeMbps - trend * 16 + (Math.random() - 0.5) * 12).toFixed(1);
    return {
      timeLabel,
      cpuPercent: histCpu,
      memoryPercent: histMem,
      diskReadMbps: histRead,
      diskWriteMbps: histWrite,
    };
  });

  const scaleFactor = isIsolated ? 0.08 : isSurging ? 1.35 : 1.0;

  return {
    nodeId,
    timestamp: new Date().toISOString(),
    hostKernel: {
      platform: `${os.platform()} ${os.release()}`,
      arch: os.arch(),
      hostCpuCount: os.cpus().length || 1,
      hostLoadAvg,
      hostMemUsagePercent,
    },
    cpu: {
      totalPercent,
      userPercent,
      systemPercent,
      iowaitPercent,
      idlePercent,
      cores,
      loadAvg1m: +(Math.max(0.08, (totalPercent / 100) * profile.cpuCores * 0.92)).toFixed(2),
      loadAvg5m: +(Math.max(0.08, (totalPercent / 100) * profile.cpuCores * 0.84)).toFixed(2),
      loadAvg15m: +(Math.max(0.08, (profile.baseCpuPercent / 100) * profile.cpuCores * 0.78)).toFixed(2),
      contextSwitchesPerSec: isIsolated
        ? 420
        : Math.round(18500 + totalPercent * 420 + (isSurging ? 24000 : 0)),
    },
    memory: {
      usedGb,
      totalGb: profile.memoryTotalGb,
      usagePercent: memUsagePercent,
      activeHeapGb,
      pageCacheGb,
      kernelSlabGb,
      freeGb,
      swapUsedGb,
      swapTotalGb,
      pageFaultsPerSec: isIsolated ? 12 : Math.round(140 + memUsagePercent * 8.5 + (isSurging ? 950 : 0)),
    },
    diskIo: {
      device: profile.diskDevice,
      readMbps: Math.max(0.5, readMbps),
      writeMbps: Math.max(0.5, writeMbps),
      totalIops,
      readIops,
      writeIops,
      queueDepth,
      avgAwaitMs,
      capacityUsedPercent: profile.diskUsedPercent,
      capacityTb: profile.diskCapacityTb,
    },
    network: {
      trafficLimitPps: serverTrafficLimits[nodeId] ?? profile.defaultTrafficLimitPps,
      throttledCount: serverThrottleCounts[nodeId] ?? 0,
    },
    processes: profile.processes.map((proc) => ({
      pid: proc.pid,
      name: proc.name,
      cpuPercent: +Math.min(99, proc.cpuBase * scaleFactor + (Math.random() - 0.5) * 0.8).toFixed(1),
      memGb: +Math.max(0.1, proc.memGbBase * (isIsolated ? 0.2 : isSurging ? 1.15 : 1.0)).toFixed(2),
      ioMbps: +Math.max(0.1, proc.ioBase * scaleFactor).toFixed(1),
      state: isIsolated ? "T (stopped)" : proc.state,
    })),
    history,
  };
}
