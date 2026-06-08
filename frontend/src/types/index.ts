// ─────────────────────────────────────────
// React Flow Types
// ─────────────────────────────────────────

export interface NodeMetrics {
  [key: string]: string | number | boolean | string[];
}

export interface NodeData {
  name: string;
  insights: string;
  service: string;
  region: string;
  account_id: string;
  resource_arn: string;
  metrics: NodeMetrics;
}

export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
  parentID?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  label?: string;
}

// ─────────────────────────────────────────
// Dashboard Types
// ─────────────────────────────────────────

export interface ServiceSummary {
  [service: string]: number;
}

export interface SnapshotResponse {
  status: string;
  snapshot_id: string;
  version_number: number;
  label: string;
  scanned_at: string;
  summary: ServiceSummary;
  total_resources: number;
  total_edges: number;
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}

// ─────────────────────────────────────────
// History Types
// ─────────────────────────────────────────

export interface TimelineEntry {
  snapshot_id: string;
  version_number: number;
  label: string;
  is_latest: boolean;
  created_at: string;
  total_resources: number;
  service_counts: ServiceSummary;
}

// ─────────────────────────────────────────
// Diff Types
// ─────────────────────────────────────────

export interface DiffItem {
  resource_arn: string;
  resource_type: string;
  details: {
    name: string;
    service: string;
    region: string;
    changes?: Array<{
      field: string;
      before: string;
      after: string;
    }>;
  };
}

export interface DiffResponse {
  status: string;
  from_version: { snapshot_id: string; version: number; label: string };
  to_version: { snapshot_id: string; version: number; label: string };
  summary: {
    added: number;
    removed: number;
    modified: number;
    total_changes: number;
  };
  changes: {
    added: DiffItem[];
    removed: DiffItem[];
    modified: DiffItem[];
  };
}

// ─────────────────────────────────────────
// Replay Types
// ─────────────────────────────────────────

export interface ReplayEvent {
  order: number;
  action: "add" | "remove" | "modify";
  resource_arn: string;
  resource_type: string;
  details: {
    name: string;
    service: string;
    region: string;
  };
}

// ─────────────────────────────────────────
// AWS Account Types
// ─────────────────────────────────────────

export interface AwsAccount {
  id: string;
  account_id: string;
  account_name: string;
  role_arn: string;
  status: string;
  created_at: string;
}