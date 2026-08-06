export {
  analyzeCampaignSnapshot,
  analyzeInsights,
  generateReport,
  getExecutiveDashboard,
  getHealthCenter,
  getHealthScores,
  listRecommendations,
} from "./services/analytics.js";
export type { HealthScore, Insight, Recommendation } from "./services/analytics.js";
export {
  auditCampaignStructure,
  auditFromSnapshot,
} from "./services/audit.js";
export type {
  AuditFinding,
  CampaignAuditResult,
  CampaignStructureInput,
  OptimizationTask,
} from "./services/audit.js";
export {
  getDefaultStorePath,
  loadInsightsStore,
  saveInsightsStore,
} from "./services/store.js";
export type { CampaignSnapshot, InsightsStore, TimelineEvent } from "./services/store.js";
export { createInsightsMcpServer } from "./server.js";
export { registerInsightsTools, seedDemoSnapshots } from "./tools/index.js";
export type { InsightsToolsContext } from "./tools/index.js";
