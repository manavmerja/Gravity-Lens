import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─────────────────────────────────────────
// AWS Account APIs
// ─────────────────────────────────────────

export const connectAWS = async (roleArn: string, accountName?: string) => {
  const { data } = await api.post("/api/aws/connect", {
    role_arn: roleArn,
    account_name: accountName,
  });
  return data;
};

export const getAccounts = async () => {
  const { data } = await api.get("/api/aws/accounts");
  return data;
};

// ─────────────────────────────────────────
// Dashboard APIs
// ─────────────────────────────────────────

export const getLatestSnapshot = async (awsAccountId: string) => {
  const { data } = await api.get(
    `/api/dashboard/latest/${awsAccountId}`
  );
  return data;
};

export const getVersionHistory = async (awsAccountId: string) => {
  const { data } = await api.get(
    `/api/dashboard/history/${awsAccountId}`
  );
  return data;
};

export const getSnapshotGraph = async (snapshotId: string) => {
  const { data } = await api.get(
    `/api/dashboard/snapshot/${snapshotId}/graph`
  );
  return data;
};

export const getDiff = async (
  fromSnapshotId: string,
  toSnapshotId: string
) => {
  const { data } = await api.get(
    `/api/dashboard/diff/${fromSnapshotId}/${toSnapshotId}`
  );
  return data;
};

export const getReplayData = async (
  fromSnapshotId: string,
  toSnapshotId: string
) => {
  const { data } = await api.get(
    `/api/dashboard/replay/${fromSnapshotId}/${toSnapshotId}`
  );
  return data;
};

export const getScanStatus = async (awsAccountId: string) => {
  const { data } = await api.get(
    `/api/dashboard/scan-status/${awsAccountId}`
  );
  return data;
};

export const triggerManualScan = async (accountId: string) => {
  const { data } = await api.post(
    `/api/scan/trigger/${accountId}`
  );
  return data;
};