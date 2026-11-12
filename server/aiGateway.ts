import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

export const PRIMARY_GEMINI_MODEL = "gemini-4-hydrogen";
export const FALLBACK_GEMINI_MODEL = "gemini-3.1-flash-lite";

let aiClient: GoogleGenAI | null = null;
let cachedApiKey: string | undefined;

export function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  if (!aiClient || cachedApiKey !== apiKey) {
    cachedApiKey = apiKey;
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

async function withExponentialBackoff<T>(
  operation: () => Promise<T>,
  retries = 2,
  baseDelayMs = 350
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code;
      const isRetryable = status === 429 || status === 503 || status === 500 || err?.message?.includes("fetch");
      if (!isRetryable || attempt === retries) {
        throw err;
      }
      const jitter = Math.floor(Math.random() * 120);
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * Math.pow(2, attempt) + jitter));
    }
  }
  throw lastError;
}

export interface GatewayTextResult {
  text: string;
  modelUsed: string;
  mode: "live-gemini" | "local-heuristic";
  warning?: string;
}

export async function generateGatewayText(options: {
  prompt: string;
  systemInstruction?: string;
  thinkingLevel?: "LOW" | "MEDIUM" | "HIGH";
}): Promise<GatewayTextResult> {
  const ai = getGenAIClient();
  if (!ai) {
    return {
      text: "",
      modelUsed: "local-heuristic",
      mode: "local-heuristic",
    };
  }

  const thinkingMap: Record<"LOW" | "MEDIUM" | "HIGH", ThinkingLevel> = {
    LOW: ThinkingLevel.LOW,
    MEDIUM: ThinkingLevel.MEDIUM,
    HIGH: ThinkingLevel.HIGH,
  };

  const config: Record<string, any> = {};
  if (options.systemInstruction) {
    config.systemInstruction = options.systemInstruction;
  }
  if (options.thinkingLevel) {
    config.thinkingConfig = {
      thinkingLevel: thinkingMap[options.thinkingLevel],
    };
  }

  try {
    const response = await withExponentialBackoff(() =>
      ai.models.generateContent({
        model: PRIMARY_GEMINI_MODEL,
        contents: options.prompt,
        config,
      })
    );
    return {
      text: response.text ?? "",
      modelUsed: PRIMARY_GEMINI_MODEL,
      mode: "live-gemini",
    };
  } catch (primaryErr: any) {
    console.warn(
      `[AI Gateway]: Primary model ${PRIMARY_GEMINI_MODEL} failed (${primaryErr?.message || "unknown"}). Falling back to ${FALLBACK_GEMINI_MODEL}.`
    );

    try {
      const fallbackConfig: Record<string, any> = {};
      if (options.systemInstruction) {
        fallbackConfig.systemInstruction = options.systemInstruction;
      }
      const fallbackResp = await withExponentialBackoff(() =>
        ai.models.generateContent({
          model: FALLBACK_GEMINI_MODEL,
          contents: options.prompt,
          config: fallbackConfig,
        })
      );
      return {
        text: fallbackResp.text ?? "",
        modelUsed: FALLBACK_GEMINI_MODEL,
        mode: "live-gemini",
      };
    } catch (fallbackErr: any) {
      console.warn(
        `[AI Gateway]: Fallback model ${FALLBACK_GEMINI_MODEL} unavailable (${fallbackErr?.message || "unknown"}). Routing to local heuristic engine.`
      );
      return {
        text: "",
        modelUsed: "local-heuristic",
        mode: "local-heuristic",
        warning: fallbackErr?.message || "Upstream Gemini gateway unavailable",
      };
    }
  }
}

export interface NodeHealthDiagnostic {
  summary: string;
  severity: "NOMINAL" | "ELEVATED" | "CRITICAL";
  bottleneck: string;
  recommendations: string[];
  recommendedCli: string;
  modelUsed: string;
  mode: "live-gemini" | "local-heuristic";
}

export async function diagnoseNodeHealthWithAI(input: {
  nodeId: string;
  nodeName: string;
  role: string;
  cpuPercent: number;
  memoryPercent: number;
  memoryUsedGb: number;
  memoryTotalGb: number;
  diskReadMbps: number;
  diskWriteMbps: number;
  diskIops: number;
  diskAwaitMs: number;
  trafficPps: number;
  trafficLimitPps: number;
  latencyMs: number;
  isSurging: boolean;
  isIsolated: boolean;
}): Promise<NodeHealthDiagnostic> {
  const ai = getGenAIClient();

  if (ai) {
    const prompt = `Analyze this live Attack Path Matrix node hardware and network telemetry:
Node: ${input.nodeName} (${input.nodeId}) - ${input.role}
CPU Usage: ${input.cpuPercent.toFixed(1)}%
Memory Consumption: ${input.memoryUsedGb.toFixed(1)} GB / ${input.memoryTotalGb.toFixed(1)} GB (${input.memoryPercent.toFixed(1)}%)
Disk I/O: Read ${input.diskReadMbps.toFixed(1)} MB/s, Write ${input.diskWriteMbps.toFixed(1)} MB/s, ${input.diskIops} IOPS, Avg Await ${input.diskAwaitMs.toFixed(2)} ms
Network Ingress: ${input.trafficPps} pkt/s (Threshold Limit: ${input.trafficLimitPps} pkt/s)
Packet Inspection Latency: ${input.latencyMs.toFixed(2)} ms
Active Traffic Surge: ${input.isSurging ? "YES" : "NO"}
Host Isolated: ${input.isIsolated ? "YES" : "NO"}

Return a concise, technical infrastructure and cyber-defense health assessment.`;

    try {
      const response = await withExponentialBackoff(() =>
        ai.models.generateContent({
          model: PRIMARY_GEMINI_MODEL,
          contents: prompt,
          config: {
            systemInstruction:
              "You are the Chronos Kernel & Cyber Telemetry AI Auditor. Provide terse, technically accurate systems engineering diagnostics.",
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING, description: "Two-sentence technical assessment of node health." },
                severity: { type: Type.STRING, description: "One of NOMINAL, ELEVATED, or CRITICAL." },
                bottleneck: { type: Type.STRING, description: "Primary subsystem bottleneck or 'None detected'." },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "2-3 concise remediation steps.",
                },
                recommendedCli: {
                  type: Type.STRING,
                  description: "A safe Linux/eBPF diagnostic or mitigation command.",
                },
              },
              required: ["summary", "severity", "bottleneck", "recommendations", "recommendedCli"],
            },
          },
        })
      );

      const parsed = JSON.parse((response.text ?? "{}").trim());
      const normSeverity =
        parsed.severity === "CRITICAL" || parsed.severity === "ELEVATED" ? parsed.severity : "NOMINAL";
      return {
        summary: parsed.summary || "Telemetry diagnostic completed.",
        severity: normSeverity,
        bottleneck: parsed.bottleneck || "None detected",
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        recommendedCli: parsed.recommendedCli || "bpftool prog show && iostat -xz 1 3",
        modelUsed: PRIMARY_GEMINI_MODEL,
        mode: "live-gemini",
      };
    } catch (err: any) {
      console.warn(`[AI Gateway]: Node diagnostic live call failed (${err?.message || "error"}), using local analyzer.`);
    }
  }

  // Deterministic high-precision local telemetry diagnostic
  const isTrafficHigh = input.isSurging || input.trafficPps > input.trafficLimitPps;
  const isCpuHigh = input.cpuPercent >= 80;
  const isMemHigh = input.memoryPercent >= 80;
  const isDiskBusy = input.diskAwaitMs >= 8 || input.diskIops >= 14000;

  let severity: "NOMINAL" | "ELEVATED" | "CRITICAL" = "NOMINAL";
  if (input.isIsolated || isTrafficHigh || input.cpuPercent >= 88 || input.memoryPercent >= 90) {
    severity = "CRITICAL";
  } else if (isCpuHigh || isMemHigh || isDiskBusy || input.latencyMs >= 12) {
    severity = "ELEVATED";
  }

  const bottlenecks: string[] = [];
  if (input.isIsolated) bottlenecks.push("Host Network Interface Quarantined");
  if (isTrafficHigh) bottlenecks.push(`Ingress Saturation (${input.trafficPps.toLocaleString()} vs ${input.trafficLimitPps.toLocaleString()} pkt/s limit)`);
  if (isCpuHigh) bottlenecks.push(`CPU Compute Pressure (${input.cpuPercent.toFixed(1)}%)`);
  if (isMemHigh) bottlenecks.push(`Memory Page Pressure (${input.memoryPercent.toFixed(1)}%)`);
  if (isDiskBusy) bottlenecks.push(`NVMe Disk Queue Contention (${input.diskAwaitMs.toFixed(1)}ms await)`);

  const bottleneck = bottlenecks.length > 0 ? bottlenecks.join(" · ") : "None detected — all subsystems within SLA";

  const recommendations: string[] = [];
  if (isTrafficHigh) {
    recommendations.push("Engage Auto-Throttle (-50%) to clamp ingress token-bucket rate and relieve softirq CPU contention.");
  }
  if (isCpuHigh) {
    recommendations.push("Pin eBPF XDP inspection threads to isolated NUMA cores with irqbalance disabled on RX queues.");
  }
  if (isMemHigh) {
    recommendations.push("Flush page-cache slab buffers and enforce cgroup v2 memory.high ceiling on worker sandboxes.");
  }
  if (isDiskBusy) {
    recommendations.push("Batch immutable audit log flushes via io_uring async ring buffers to reduce write amplification.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Maintain continuous Prometheus 15s scraping and verify ML-KEM-768 key rotation cadence.");
    recommendations.push("Monitor softirq/ksoftirqd queue depth during next scheduled PQC handshake batch.");
  }

  const summary = input.isIsolated
    ? `${input.nodeName} is currently isolated from the mesh fabric; compute and ingress queues are quiesced pending forensic verification.`
    : severity === "CRITICAL"
      ? `${input.nodeName} is experiencing critical subsystem strain (${bottleneck}). Immediate rate shaping or kernel-level XDP filtering is advised.`
      : severity === "ELEVATED"
        ? `${input.nodeName} shows elevated resource utilization (${bottleneck}) while maintaining packet inspection SLA.`
        : `${input.nodeName} is operating cleanly within nominal hardware envelopes (${input.cpuPercent.toFixed(1)}% CPU, ${input.memoryPercent.toFixed(1)}% RAM, ${input.diskAwaitMs.toFixed(2)}ms disk await).`;

  const recommendedCli = isTrafficHigh
    ? `tc qdisc replace dev eth0 root tbf rate ${Math.max(100, Math.round(input.trafficLimitPps / 20))}mbit burst 64kb latency 10ms`
    : isDiskBusy
      ? "iostat -xz 1 3 && iotop -oPa"
      : "mpstat -P ALL 1 1 && free -h && ss -s";

  return {
    summary,
    severity,
    bottleneck,
    recommendations,
    recommendedCli,
    modelUsed: "local-heuristic",
    mode: "local-heuristic",
  };
}
