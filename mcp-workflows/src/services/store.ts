import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { readJsonFile, writeJsonFile } from "@mcp-marketing/shared";

export type WorkflowStatus = "active" | "paused" | "draft" | "archived";
export type ExecutionStatus = "pending" | "running" | "completed" | "failed" | "recovered";

export interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  config: Record<string, unknown>;
  nextStepId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  trigger: {
    type: "schedule" | "event" | "manual";
    cron?: string;
    nextRunAt?: string;
    eventType?: string;
  };
  steps: WorkflowStep[];
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  trigger: Workflow["trigger"];
  steps: Omit<WorkflowStep, "id">[];
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  currentStepId?: string;
  logs: Array<{ stepId: string; message: string; timestamp: string }>;
  error?: string;
}

export interface WorkflowAuditLog {
  id: string;
  workflowId: string;
  action: string;
  actor: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface WorkflowsStore {
  workflows: Workflow[];
  templates: WorkflowTemplate[];
  executions: WorkflowExecution[];
  auditLogs: WorkflowAuditLog[];
}

const DEFAULT_STORE: WorkflowsStore = {
  workflows: [],
  templates: [],
  executions: [],
  auditLogs: [],
};

export function getDefaultWorkflowsStorePath(): string {
  return (
    process.env.WORKFLOWS_STORE_PATH ??
    path.join(os.homedir(), ".marketing-brain", "workflows-store.json")
  );
}

export async function loadWorkflowsStore(
  storePath = getDefaultWorkflowsStorePath(),
): Promise<WorkflowsStore> {
  if (!existsSync(storePath)) {
    return structuredClone(DEFAULT_STORE);
  }
  return readJsonFile<WorkflowsStore>(storePath);
}

export async function saveWorkflowsStore(
  store: WorkflowsStore,
  storePath = getDefaultWorkflowsStorePath(),
): Promise<void> {
  await writeJsonFile(storePath, store);
}
