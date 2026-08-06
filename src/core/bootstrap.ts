import { ConfigService } from "../config/index.js";
import { LoggerFactory } from "../logger/index.js";
import { createGoogleAdsService } from "../services/google-ads/index.js";
import { createOpenAiService } from "../services/openai/index.js";
import { createMcpService } from "../services/mcp/index.js";
import { createHttpApp } from "./app.js";
import type { AppContext } from "./context.js";
import { VERSION } from "./version.js";

export interface BootstrapResult {
  ctx: AppContext;
  app: Awaited<ReturnType<typeof createHttpApp>>;
}

export async function bootstrap(): Promise<BootstrapResult> {
  const config = ConfigService.create();
  const logger = LoggerFactory.create({
    service: "marketing-brain",
    level: config.logLevel,
    pretty: !config.isProduction,
  });

  logger.info(
    {
      version: VERSION,
      nodeEnv: config.env.NODE_ENV,
      host: config.host,
      port: config.port,
    },
    "Bootstrapping Marketing Brain",
  );

  for (const warning of config.warnings) {
    logger.warn(warning);
  }

  const googleAds = createGoogleAdsService({ config, logger });
  const openAi = createOpenAiService({ config, logger });
  const mcp = createMcpService({ config, logger });

  const ctx: AppContext = { config, logger, googleAds, openAi, mcp };
  const app = await createHttpApp(ctx);

  logger.info(
    {
      googleAds: googleAds.status().status,
      openai: openAi.status().status,
      mcp: mcp.status().status,
    },
    "Services registered",
  );

  return { ctx, app };
}

export async function startServer(): Promise<void> {
  const { ctx, app } = await bootstrap();

  const shutdown = async (signal: string) => {
    ctx.logger.info({ signal }, "Shutting down");
    try {
      await app.close();
      ctx.logger.info("HTTP server closed");
      process.exit(0);
    } catch (error) {
      ctx.logger.error({ err: error }, "Error during shutdown");
      process.exit(1);
    }
  };

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));

  await app.listen({ host: ctx.config.host, port: ctx.config.port });
  ctx.logger.info(
    { url: `http://${ctx.config.host}:${ctx.config.port}` },
    "Marketing Brain HTTP shell listening",
  );
}
