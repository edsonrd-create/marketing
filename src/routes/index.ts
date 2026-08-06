import type { FastifyInstance } from "fastify";
import type { AppContext } from "../core/context.js";
import { registerHealthRoutes } from "./health.js";
import { registerApiRoutes } from "./api.js";
import { getDashboardHtml } from "../views/dashboardHtml.js";

export async function registerRoutes(app: FastifyInstance, ctx: AppContext): Promise<void> {
  await registerHealthRoutes(app, ctx);
  await registerApiRoutes(app, ctx);

  app.get("/", async (_request, reply) => {
    return reply.type("text/html; charset=utf-8").send(getDashboardHtml());
  });

  app.get("/api/info", async () => ({
    name: "Marketing Brain",
    status: "active",
    docs: {
      health: "/health",
      api: "/api/chat",
      diagnostics: "/api/diagnostics",
    },
  }));
}

