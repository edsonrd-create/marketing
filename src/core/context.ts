import type { ConfigService } from "../config/ConfigService.js";
import type { Logger } from "../logger/index.js";
import type { GoogleAdsService } from "../services/google-ads/index.js";
import type { OpenAiService } from "../services/openai/index.js";
import type { McpService } from "../services/mcp/index.js";

export interface AppContext {
  config: ConfigService;
  logger: Logger;
  googleAds: GoogleAdsService;
  openAi: OpenAiService;
  mcp: McpService;
}
