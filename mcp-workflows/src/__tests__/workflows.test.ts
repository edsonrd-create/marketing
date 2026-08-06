import { describe, expect, it } from "vitest";
import { SEED_TEMPLATES } from "../services/templates.js";
import {
  createEmptyWorkflowsStore,
  createWorkflowFromTemplate,
  listWorkflowTemplates,
  runDueWorkflows,
  runWorkflow,
} from "../services/workflows.js";

describe("workflows", () => {
  it("seeds templates including tpl-birthday", () => {
    const store = createEmptyWorkflowsStore();
    const templates = listWorkflowTemplates(store);
    expect(templates.some((t) => t.id === "tpl-birthday")).toBe(true);
    expect(SEED_TEMPLATES.length).toBeGreaterThanOrEqual(4);
  });

  it("creates workflow from template", () => {
    const store = createEmptyWorkflowsStore();
    const workflow = createWorkflowFromTemplate(store, "tpl-birthday", {
      name: "My Birthday Flow",
      status: "active",
    });
    expect(workflow.templateId).toBe("tpl-birthday");
    expect(workflow.name).toBe("My Birthday Flow");
    expect(workflow.steps.length).toBeGreaterThan(0);
  });

  it("runs workflow and records execution", () => {
    const store = createEmptyWorkflowsStore();
    const workflow = createWorkflowFromTemplate(store, "tpl-welcome", { status: "active" });
    const execution = runWorkflow(store, workflow.id);
    expect(execution.status).toBe("completed");
    expect(execution.logs.length).toBe(workflow.steps.length);
  });

  it("runDue executes scheduled workflows past nextRunAt", () => {
    const store = createEmptyWorkflowsStore();
    const workflow = createWorkflowFromTemplate(store, "tpl-birthday", { status: "active" });
    workflow.trigger.nextRunAt = "2020-01-01T09:00:00.000Z";

    const executions = runDueWorkflows(store, new Date("2026-01-01T00:00:00.000Z"));
    expect(executions.length).toBeGreaterThanOrEqual(1);
    expect(executions[0]?.status).toBe("completed");
  });

  it("seeds daily campaign audit workflow and template", () => {
    const store = createEmptyWorkflowsStore();
    const templates = listWorkflowTemplates(store);
    expect(templates.some((t) => t.id === "tpl-daily-campaign-audit-whatsapp")).toBe(true);

    const auditWf = store.workflows.find((w) => w.id === "wf-daily-campaign-audit-whatsapp");
    expect(auditWf).toBeDefined();
    expect(auditWf?.status).toBe("active");
    expect(auditWf?.steps.length).toBe(2);

    const execution = runWorkflow(store, auditWf!.id);
    expect(execution.status).toBe("completed");
    expect(execution.logs.length).toBe(2);
  });
});
