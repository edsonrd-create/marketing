import type { GoogleAdsProvider } from "../services/GoogleAdsProvider.js";

export class KeywordService {
  constructor(private readonly provider: GoogleAdsProvider) {}

  search(query: string, limit: number) {
    return this.provider.searchKeywords(query, limit);
  }
}
