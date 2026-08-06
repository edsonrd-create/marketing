import { AppError, ErrorCode, createLogger } from "@mcp-marketing/shared";
import type { MetaAdsEnv } from "../config/env.js";

const logger = createLogger("meta-ads-auth");

export class MetaAdsAuthService {
  private initialized = false;

  constructor(private readonly env: MetaAdsEnv) {}

  isInitialized(): boolean {
    return this.initialized;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!this.env.META_ACCESS_TOKEN || this.env.META_ACCESS_TOKEN.trim() === "") {
      throw new AppError({
        code: ErrorCode.CONFIG,
        message: "META_ACCESS_TOKEN is required",
      });
    }

    if (!this.env.META_AD_ACCOUNT_ID || this.env.META_AD_ACCOUNT_ID.trim() === "") {
      throw new AppError({
        code: ErrorCode.CONFIG,
        message: "META_AD_ACCOUNT_ID is required",
      });
    }

    if (this.env.META_SKIP_AUTH_VALIDATE) {
      logger.warn("Skipping Meta Ads auth validation (META_SKIP_AUTH_VALIDATE=true)");
      this.initialized = true;
      return;
    }

    logger.warn(
      "LTS stub auth: validated Bearer token presence only (no Graph API call in this build)",
    );
    this.initialized = true;
  }

  getAuthorizationHeader(): string {
    return `Bearer ${this.env.META_ACCESS_TOKEN}`;
  }

  getAdAccountId(): string {
    return this.env.META_AD_ACCOUNT_ID;
  }
}
