import type { GoogleAdsProvider } from "../services/GoogleAdsProvider.js";

export class CustomerService {
  constructor(private readonly provider: GoogleAdsProvider) {}

  list() {
    return this.provider.listCustomers();
  }

  accountInfo() {
    return this.provider.accountInfo();
  }
}
