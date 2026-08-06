import type { GoogleAdsProvider } from "../services/GoogleAdsProvider.js";

export class BudgetService {
  constructor(private readonly provider: GoogleAdsProvider) {}

  update(campaignId: string, budgetMicros: number) {
    return this.provider.updateBudget(campaignId, budgetMicros);
  }
}
