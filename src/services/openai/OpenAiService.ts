import OpenAI from "openai";
import { ExternalApiError } from "@mcp-marketing/shared";
import type { ConfigService } from "../../config/ConfigService.js";
import type { Logger } from "../../logger/index.js";
import type { ServiceStatus } from "../../types/index.js";

export interface OpenAiServiceOptions {
  config: ConfigService;
  logger: Logger;
}

/**
 * OpenAI service shell — client is created only when OPENAI_API_KEY is present.
 */
export class OpenAiService {
  private readonly config: ConfigService;
  private readonly logger: Logger;
  private client: OpenAI | null = null;

  constructor(options: OpenAiServiceOptions) {
    this.config = options.config;
    this.logger = options.logger.child({ component: "openai-service" });
  }

  isConfigured(): boolean {
    return this.config.hasOpenAi() && Boolean(this.config.env.OPENAI_API_KEY);
  }

  getClient(): OpenAI {
    if (!this.config.env.OPENAI_API_KEY) {
      throw new ExternalApiError("openai", "OPENAI_API_KEY is not configured");
    }
    if (!this.client) {
      this.client = new OpenAI({ apiKey: this.config.env.OPENAI_API_KEY });
      this.logger.info({ model: this.config.env.OPENAI_MODEL }, "OpenAI client initialized");
    }
    return this.client;
  }

  status(): ServiceStatus {
    if (!this.isConfigured()) {
      return { name: "openai", status: "degraded", details: "OPENAI_API_KEY missing" };
    }
    return {
      name: "openai",
      status: "ok",
      details: `model=${this.config.env.OPENAI_MODEL}`,
    };
  }

  async ping(): Promise<{ ok: boolean }> {
    if (!this.isConfigured()) {
      this.logger.warn("OpenAI ping skipped — missing API key");
      return { ok: false };
    }
    // Avoid billed network calls on boot; configuration presence is enough for Sprint 1.
    this.getClient();
    return { ok: true };
  }
}

export function createOpenAiService(options: OpenAiServiceOptions): OpenAiService {
  return new OpenAiService(options);
}
