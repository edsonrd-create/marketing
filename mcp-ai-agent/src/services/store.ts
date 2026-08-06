import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { readJsonFile, writeJsonFile } from "@mcp-marketing/shared";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  sessionId: string;
}

export interface PendingAction {
  id: string;
  type: string;
  description: string;
  payload: Record<string, unknown>;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface AgentStore {
  history: ChatMessage[];
  pendingActions: PendingAction[];
  auditLogs: AuditLogEntry[];
}

const DEFAULT_STORE: AgentStore = {
  history: [],
  pendingActions: [],
  auditLogs: [],
};

export function getDefaultAgentStorePath(): string {
  return (
    process.env.AI_AGENT_STORE_PATH ??
    path.join(os.homedir(), ".marketing-brain", "ai-agent-store.json")
  );
}

export async function loadAgentStore(storePath = getDefaultAgentStorePath()): Promise<AgentStore> {
  if (!existsSync(storePath)) {
    return structuredClone(DEFAULT_STORE);
  }
  return readJsonFile<AgentStore>(storePath);
}

export async function saveAgentStore(
  store: AgentStore,
  storePath = getDefaultAgentStorePath(),
): Promise<void> {
  await writeJsonFile(storePath, store);
}
