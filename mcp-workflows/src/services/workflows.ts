import { randomUUID } from "node:crypto";
import { seedTemplates } from "./templates.js";
import type {
  Workflow,
  WorkflowAuditLog,
  WorkflowExecution,
  WorkflowStep,
  WorkflowsStore,
} from "./store.js";

function now(): string {
  return new Date().toISOString();
}

function appendAudit(
  store: WorkflowsStore,
  workflowId: string,
  action: string,
  actor: string,
  details: Record<string, unknown>,
): WorkflowAuditLog {
  const entry: WorkflowAuditLog = {
    id: randomUUID(),
    workflowId,
    action,
    actor,
    details,
    timestamp: now(),
  };
  store.auditLogs.push(entry);
  return entry;
}

export function ensureStoreSeeded(store: WorkflowsStore): void {
  store.templates = seedTemplates(store.templates);
  const existingAuditWf = store.workflows.find(
    (w) => w.id === "wf-daily-campaign-audit-whatsapp" || w.name.includes("Daily Campaign Audit"),
  );
  if (!existingAuditWf) {
    const timestamp = now();
    store.workflows.push({
      id: "wf-daily-campaign-audit-whatsapp",
      name: "Daily Campaign Audit & WhatsApp Dispatch",
      description: "Triggers mcp-insights campaign structure audit daily and automatically sends results to WhatsApp +55 (41) 99780-6839",
      status: "active",
      trigger: {
        type: "schedule",
        cron: "0 9 * * *",
        nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      templateId: "tpl-daily-campaign-audit-whatsapp",
      steps: [
        {
          id: "step-audit-001",
          type: "insights.audit_campaign_structure",
          name: "Run Daily Campaign Structure Audit",
          config: { channel: "google", autoGenerateTasks: true },
          nextStepId: "step-whatsapp-002",
        },
        {
          id: "step-whatsapp-002",
          type: "whatsapp.send_message",
          name: "Send Audit Results & Optimization Tasks to WhatsApp",
          config: { recipientPhone: "5541997806839", messageFormat: "executive_audit_summary" },
        },
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }
}

export function listWorkflows(store: WorkflowsStore, status?: Workflow["status"]): Workflow[] {
  ensureStoreSeeded(store);
  if (!status) {
    return store.workflows;
  }
  return store.workflows.filter((w) => w.status === status);
}

export function createWorkflow(
  store: WorkflowsStore,
  input: {
    name: string;
    description?: string;
    trigger: Workflow["trigger"];
    steps: Omit<WorkflowStep, "id">[];
    status?: Workflow["status"];
  },
): Workflow {
  ensureStoreSeeded(store);
  const timestamp = now();
  const workflow: Workflow = {
    id: randomUUID(),
    name: input.name,
    ...(input.description !== undefined ? { description: input.description } : {}),
    status: input.status ?? "draft",
    trigger: input.trigger,
    steps: input.steps.map((step) => ({ ...step, id: randomUUID() })),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  store.workflows.push(workflow);
  appendAudit(store, workflow.id, "workflow_created", "system", { name: workflow.name });
  return workflow;
}

export function updateWorkflow(
  store: WorkflowsStore,
  workflowId: string,
  updates: Partial<Pick<Workflow, "name" | "description" | "status" | "trigger" | "steps">>,
): Workflow {
  const workflow = store.workflows.find((w) => w.id === workflowId);
  if (!workflow) {
    throw new Error(`Workflow not found: ${workflowId}`);
  }
  Object.assign(workflow, updates, { updatedAt: now() });
  appendAudit(store, workflowId, "workflow_updated", "system", { updates: Object.keys(updates) });
  return workflow;
}

export function duplicateWorkflow(store: WorkflowsStore, workflowId: string): Workflow {
  const source = store.workflows.find((w) => w.id === workflowId);
  if (!source) {
    throw new Error(`Workflow not found: ${workflowId}`);
  }
  return createWorkflow(store, {
    name: `${source.name} (copy)`,
    ...(source.description !== undefined ? { description: source.description } : {}),
    trigger: { ...source.trigger },
    steps: source.steps.map(({ type, name, config, nextStepId }) => ({
      type,
      name,
      config: { ...config },
      ...(nextStepId !== undefined ? { nextStepId } : {}),
    })),
    status: "draft",
  });
}

export function pauseWorkflow(store: WorkflowsStore, workflowId: string): Workflow {
  return updateWorkflow(store, workflowId, { status: "paused" });
}

export function deleteWorkflow(store: WorkflowsStore, workflowId: string): boolean {
  const index = store.workflows.findIndex((w) => w.id === workflowId);
  if (index === -1) {
    return false;
  }
  store.workflows.splice(index, 1);
  appendAudit(store, workflowId, "workflow_deleted", "system", {});
  return true;
}

export function runWorkflow(store: WorkflowsStore, workflowId: string): WorkflowExecution {
  const workflow = store.workflows.find((w) => w.id === workflowId);
  if (!workflow) {
    throw new Error(`Workflow not found: ${workflowId}`);
  }
  if (workflow.status === "paused") {
    throw new Error(`Workflow ${workflowId} is paused`);
  }

  const execution: WorkflowExecution = {
    id: randomUUID(),
    workflowId,
    status: "running",
    startedAt: now(),
    logs: [],
  };

  try {
    for (const step of workflow.steps) {
      execution.currentStepId = step.id;
      execution.logs.push({
        stepId: step.id,
        message: `Executed step "${step.name}" (${step.type})`,
        timestamp: now(),
      });
    }
    execution.status = "completed";
    execution.completedAt = now();
    appendAudit(store, workflowId, "workflow_executed", "system", {
      executionId: execution.id,
    });
  } catch (error) {
    execution.status = "failed";
    execution.error = error instanceof Error ? error.message : String(error);
    execution.completedAt = now();
    appendAudit(store, workflowId, "workflow_failed", "system", {
      executionId: execution.id,
      error: execution.error,
    });
  }

  store.executions.push(execution);
  return execution;
}

export function runDueWorkflows(store: WorkflowsStore, asOf = new Date()): WorkflowExecution[] {
  ensureStoreSeeded(store);
  const due = store.workflows.filter((workflow) => {
    if (workflow.status !== "active") {
      return false;
    }
    if (workflow.trigger.type !== "schedule") {
      return false;
    }
    if (!workflow.trigger.nextRunAt) {
      return false;
    }
    return new Date(workflow.trigger.nextRunAt) <= asOf;
  });

  const results: WorkflowExecution[] = [];
  for (const workflow of due) {
    const execution = runWorkflow(store, workflow.id);
    results.push(execution);
    workflow.trigger.nextRunAt = computeNextRun(workflow.trigger.cron, asOf);
    workflow.updatedAt = now();
  }
  return results;
}

export function recoverWorkflowExecution(
  store: WorkflowsStore,
  executionId: string,
): WorkflowExecution {
  const execution = store.executions.find((e) => e.id === executionId);
  if (!execution) {
    throw new Error(`Execution not found: ${executionId}`);
  }
  if (execution.status !== "failed") {
    throw new Error(`Execution ${executionId} is not failed (status: ${execution.status})`);
  }

  const workflow = store.workflows.find((w) => w.id === execution.workflowId);
  if (!workflow) {
    throw new Error(`Workflow not found for execution: ${executionId}`);
  }

  execution.status = "recovered";
  execution.logs.push({
    stepId: execution.currentStepId ?? "unknown",
    message: "Execution recovered and re-run from failed step",
    timestamp: now(),
  });

  const rerun = runWorkflow(store, workflow.id);
  appendAudit(store, workflow.id, "execution_recovered", "system", {
    originalExecutionId: executionId,
    newExecutionId: rerun.id,
  });
  return rerun;
}

export function listWorkflowTemplates(store: WorkflowsStore) {
  ensureStoreSeeded(store);
  return store.templates;
}

export function createWorkflowFromTemplate(
  store: WorkflowsStore,
  templateId: string,
  overrides?: { name?: string; status?: Workflow["status"] },
): Workflow {
  ensureStoreSeeded(store);
  const template = store.templates.find((t) => t.id === templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const workflow = createWorkflow(store, {
    name: overrides?.name ?? template.name,
    description: template.description,
    trigger: { ...template.trigger },
    steps: template.steps.map((step) => ({ ...step, config: { ...step.config } })),
    status: overrides?.status ?? "draft",
  });
  workflow.templateId = templateId;
  appendAudit(store, workflow.id, "workflow_from_template", "system", { templateId });
  return workflow;
}

export function listWorkflowExecutions(
  store: WorkflowsStore,
  workflowId?: string,
  limit = 50,
): WorkflowExecution[] {
  let executions = store.executions;
  if (workflowId) {
    executions = executions.filter((e) => e.workflowId === workflowId);
  }
  return executions.slice(-limit);
}

export function listWorkflowAuditLogs(
  store: WorkflowsStore,
  workflowId?: string,
  limit = 50,
): WorkflowAuditLog[] {
  let logs = store.auditLogs;
  if (workflowId) {
    logs = logs.filter((l) => l.workflowId === workflowId);
  }
  return logs.slice(-limit);
}

function computeNextRun(cron?: string, from = new Date()): string {
  if (!cron) {
    return new Date(from.getTime() + 24 * 60 * 60 * 1000).toISOString();
  }
  const next = new Date(from);
  next.setDate(next.getDate() + 1);
  next.setHours(9, 0, 0, 0);
  return next.toISOString();
}

export function createEmptyWorkflowsStore(): WorkflowsStore {
  const store: WorkflowsStore = {
    workflows: [],
    templates: [],
    executions: [],
    auditLogs: [],
  };
  ensureStoreSeeded(store);
  return store;
}
