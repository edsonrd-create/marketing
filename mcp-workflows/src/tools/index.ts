import { registerTool } from "@mcp-marketing/shared";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { WorkflowsStore } from "../services/store.js";
import { loadWorkflowsStore, saveWorkflowsStore } from "../services/store.js";
import {
  createWorkflow,
  createWorkflowFromTemplate,
  deleteWorkflow,
  duplicateWorkflow,
  listWorkflowAuditLogs,
  listWorkflowExecutions,
  listWorkflowTemplates,
  listWorkflows,
  pauseWorkflow,
  recoverWorkflowExecution,
  runDueWorkflows,
  runWorkflow,
  updateWorkflow,
} from "../services/workflows.js";

export interface WorkflowsToolsContext {
  storePath?: string;
  getStore?: () => Promise<WorkflowsStore>;
  saveStore?: (store: WorkflowsStore) => Promise<void>;
}

const workflowStepSchema = z.object({
  type: z.string(),
  name: z.string(),
  config: z.record(z.unknown()).default({}),
  nextStepId: z.string().optional(),
});

const triggerSchema = z.object({
  type: z.enum(["schedule", "event", "manual"]),
  cron: z.string().optional(),
  nextRunAt: z.string().optional(),
  eventType: z.string().optional(),
});

function resolveStoreAccess(ctx: WorkflowsToolsContext) {
  const storePath = ctx.storePath;
  return {
    getStore: ctx.getStore ?? (() => loadWorkflowsStore(storePath)),
    saveStore: ctx.saveStore ?? ((store: WorkflowsStore) => saveWorkflowsStore(store, storePath)),
  };
}

export function registerWorkflowsTools(server: McpServer, ctx: WorkflowsToolsContext = {}): void {
  const { getStore, saveStore } = resolveStoreAccess(ctx);

  registerTool(
    server,
    "list_workflows",
    {
      description: "List all marketing workflows",
      inputSchema: {
        status: z.enum(["active", "paused", "draft", "archived"]).optional(),
      },
    },
    async ({ status }) => {
      const store = await getStore();
      const workflows = listWorkflows(store, status);
      return { tool: "list_workflows", workflows };
    },
  );

  registerTool(
    server,
    "create_workflow",
    {
      description: "Create a new marketing workflow",
      inputSchema: {
        name: z.string(),
        description: z.string().optional(),
        trigger: triggerSchema,
        steps: z.array(workflowStepSchema).min(1),
        status: z.enum(["active", "paused", "draft", "archived"]).optional(),
      },
    },
    async ({ name, description, trigger, steps, status }) => {
      const store = await getStore();
      const workflow = createWorkflow(store, {
        name,
        ...(description !== undefined ? { description } : {}),
        trigger: {
          type: trigger.type,
          ...(trigger.cron !== undefined ? { cron: trigger.cron } : {}),
          ...(trigger.nextRunAt !== undefined ? { nextRunAt: trigger.nextRunAt } : {}),
          ...(trigger.eventType !== undefined ? { eventType: trigger.eventType } : {}),
        },
        steps: steps.map((step) => ({
          type: step.type,
          name: step.name,
          config: step.config,
          ...(step.nextStepId !== undefined ? { nextStepId: step.nextStepId } : {}),
        })),
        ...(status !== undefined ? { status } : {}),
      });
      await saveStore(store);
      return { tool: "create_workflow", workflow };
    },
  );

  registerTool(
    server,
    "update_workflow",
    {
      description: "Update an existing workflow",
      inputSchema: {
        workflowId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["active", "paused", "draft", "archived"]).optional(),
        trigger: triggerSchema.optional(),
        steps: z.array(workflowStepSchema).optional(),
      },
    },
    async ({ workflowId, name, description, status, trigger, steps }) => {
      const store = await getStore();
      const updates: Parameters<typeof updateWorkflow>[2] = {};
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (status !== undefined) updates.status = status;
      if (trigger !== undefined) {
        updates.trigger = {
          type: trigger.type,
          ...(trigger.cron !== undefined ? { cron: trigger.cron } : {}),
          ...(trigger.nextRunAt !== undefined ? { nextRunAt: trigger.nextRunAt } : {}),
          ...(trigger.eventType !== undefined ? { eventType: trigger.eventType } : {}),
        };
      }
      if (steps !== undefined) {
        updates.steps = steps.map((step) => ({
          id: randomUUID(),
          type: step.type,
          name: step.name,
          config: step.config,
          ...(step.nextStepId !== undefined ? { nextStepId: step.nextStepId } : {}),
        }));
      }
      const workflow = updateWorkflow(store, workflowId, updates);
      await saveStore(store);
      return { tool: "update_workflow", workflow };
    },
  );

  registerTool(
    server,
    "duplicate_workflow",
    {
      description: "Duplicate an existing workflow",
      inputSchema: {
        workflowId: z.string(),
      },
    },
    async ({ workflowId }) => {
      const store = await getStore();
      const workflow = duplicateWorkflow(store, workflowId);
      await saveStore(store);
      return { tool: "duplicate_workflow", workflow };
    },
  );

  registerTool(
    server,
    "pause_workflow",
    {
      description: "Pause an active workflow",
      inputSchema: {
        workflowId: z.string(),
      },
    },
    async ({ workflowId }) => {
      const store = await getStore();
      const workflow = pauseWorkflow(store, workflowId);
      await saveStore(store);
      return { tool: "pause_workflow", workflow };
    },
  );

  registerTool(
    server,
    "delete_workflow",
    {
      description: "Delete a workflow",
      inputSchema: {
        workflowId: z.string(),
      },
    },
    async ({ workflowId }) => {
      const store = await getStore();
      const deleted = deleteWorkflow(store, workflowId);
      await saveStore(store);
      return { tool: "delete_workflow", deleted, workflowId };
    },
  );

  registerTool(
    server,
    "run_workflow",
    {
      description: "Execute a workflow immediately",
      inputSchema: {
        workflowId: z.string(),
      },
    },
    async ({ workflowId }) => {
      const store = await getStore();
      const execution = runWorkflow(store, workflowId);
      await saveStore(store);
      return { tool: "run_workflow", execution };
    },
  );

  registerTool(
    server,
    "run_due_workflows",
    {
      description: "Run all scheduled workflows that are due",
      inputSchema: {
        asOf: z.string().optional().describe("ISO datetime to evaluate due workflows"),
      },
    },
    async ({ asOf }) => {
      const store = await getStore();
      const executions = runDueWorkflows(store, asOf ? new Date(asOf) : new Date());
      await saveStore(store);
      return { tool: "run_due_workflows", count: executions.length, executions };
    },
  );

  registerTool(
    server,
    "recover_workflow_execution",
    {
      description: "Recover and re-run a failed workflow execution",
      inputSchema: {
        executionId: z.string(),
      },
    },
    async ({ executionId }) => {
      const store = await getStore();
      const execution = recoverWorkflowExecution(store, executionId);
      await saveStore(store);
      return { tool: "recover_workflow_execution", execution };
    },
  );

  registerTool(
    server,
    "list_workflow_templates",
    {
      description: "List available workflow templates (tpl-birthday, etc.)",
      inputSchema: {
        category: z.string().optional(),
      },
    },
    async ({ category }) => {
      const store = await getStore();
      let templates = listWorkflowTemplates(store);
      if (category) {
        templates = templates.filter((t) => t.category === category);
      }
      return { tool: "list_workflow_templates", templates };
    },
  );

  registerTool(
    server,
    "create_workflow_from_template",
    {
      description: "Create a workflow from a seed template",
      inputSchema: {
        templateId: z.string().describe("Template ID, e.g. tpl-birthday"),
        name: z.string().optional(),
        status: z.enum(["active", "paused", "draft", "archived"]).optional(),
      },
    },
    async ({ templateId, name, status }) => {
      const store = await getStore();
      const workflow = createWorkflowFromTemplate(store, templateId, {
        ...(name !== undefined ? { name } : {}),
        ...(status !== undefined ? { status } : {}),
      });
      await saveStore(store);
      return { tool: "create_workflow_from_template", workflow };
    },
  );

  registerTool(
    server,
    "list_workflow_executions",
    {
      description: "List workflow execution history",
      inputSchema: {
        workflowId: z.string().optional(),
        limit: z.number().int().positive().max(200).optional(),
      },
    },
    async ({ workflowId, limit }) => {
      const store = await getStore();
      const executions = listWorkflowExecutions(store, workflowId, limit);
      return { tool: "list_workflow_executions", executions };
    },
  );

  registerTool(
    server,
    "list_workflow_audit_logs",
    {
      description: "List workflow audit log entries",
      inputSchema: {
        workflowId: z.string().optional(),
        limit: z.number().int().positive().max(200).optional(),
      },
    },
    async ({ workflowId, limit }) => {
      const store = await getStore();
      const logs = listWorkflowAuditLogs(store, workflowId, limit);
      return { tool: "list_workflow_audit_logs", logs };
    },
  );
}
