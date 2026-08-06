import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { AppEnv } from "../schemas/env.schema.js";
import { EnvValidator, type EnvValidationResult } from "./EnvValidator.js";

export interface AppConfigFile {
  app: string;
  version: string;
  logLevel?: string;
  database?: { mode?: string };
  mcp?: { servers?: string[] };
}

/**
 * Central configuration service — env (Zod) + JSON profile under `config/`.
 */
export class ConfigService {
  readonly env: AppEnv;
  readonly warnings: string[];
  readonly missingProviders: string[];
  readonly profile: AppConfigFile;
  readonly rootDir: string;

  private constructor(
    result: EnvValidationResult,
    profile: AppConfigFile,
    rootDir: string,
  ) {
    this.env = result.env;
    this.warnings = result.warnings;
    this.missingProviders = result.missingProviders;
    this.profile = profile;
    this.rootDir = rootDir;
  }

  static create(options?: { rootDir?: string; envPath?: string }): ConfigService {
    const rootDir = options?.rootDir ?? process.cwd();
    const validator = new EnvValidator(options?.envPath ?? ".env");
    const result = validator.loadAndValidate(rootDir);
    const profile = ConfigService.loadProfile(rootDir, result.env.NODE_ENV);
    return new ConfigService(result, profile, rootDir);
  }

  static loadProfile(rootDir: string, nodeEnv: string): AppConfigFile {
    const basePath = path.join(rootDir, "config", "default.json");
    const envPath = path.join(rootDir, "config", `${nodeEnv}.json`);

    const base = ConfigService.readJson(basePath) ?? {
      app: "marketing-brain",
      version: "1.1.0",
    };
    const overlay = ConfigService.readJson(envPath) ?? {};
    return { ...base, ...overlay } as unknown as AppConfigFile;
  }

  private static readJson(filePath: string): Record<string, unknown> | null {
    if (!existsSync(filePath)) {
      return null;
    }
    return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;
  }

  get port(): number {
    return this.env.PORT;
  }

  get host(): string {
    return this.env.HOST;
  }

  get logLevel(): AppEnv["LOG_LEVEL"] {
    return this.env.LOG_LEVEL;
  }

  get isProduction(): boolean {
    return this.env.NODE_ENV === "production";
  }

  hasGoogleAds(): boolean {
    return !this.missingProviders.includes("google-ads");
  }

  hasOpenAi(): boolean {
    return !this.missingProviders.includes("openai");
  }

  mcpServers(): string[] {
    return this.profile.mcp?.servers ?? [
      "google-ads",
      "meta-ads",
      "whatsapp",
      "insights",
      "ai-agent",
      "workflows",
    ];
  }
}
