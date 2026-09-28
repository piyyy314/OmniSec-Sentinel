export interface ModuleDef {
  id: number;
  name: string;
  category: "Quantum" | "Neural & ML" | "Active Defense & Deception" | "Monitoring & Auditing" | "Integrity & Compliance" | "Autonomous & Bio-Digital";
  description: string;
  technicalDetails: string;
  defaultStatus: "Idle" | "Active" | "Warning" | "Critical";
}

export interface SimulationResult {
  moduleId: number;
  status: "Active" | "Warning" | "Critical" | "Success";
  metrics: { label: string; value: number | string; unit?: string }[];
  logs: string[];
  recommendations: string[];
  visualizationData?: any; // D3/Recharts data generated dynamically
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  moduleId: number;
  moduleName: string;
  severity: "info" | "warning" | "critical";
  message: string;
}

export interface BlockchainBlock {
  index: number;
  timestamp: string;
  reportHash: string;
  previousHash: string;
  nonce: number;
  signature: string;
}
