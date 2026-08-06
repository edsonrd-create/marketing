export function runLive() {
  console.log("Marketing Brain — live validation");
  console.log("");
  console.log("Live API checks require credentials in `.env`.");
  console.log("");
  console.log("Steps:");
  console.log("  1. cp .env.example .env");
  console.log("  2. Fill GOOGLE_ADS_*, META_*, WHATSAPP_* variables");
  console.log("  3. npm run live:validate");
  console.log("");
  console.log("Without credentials, live validation writes LIVE_VALIDATION_REPORT.md and exits 0 (LTS behavior).");
  return 0;
}
