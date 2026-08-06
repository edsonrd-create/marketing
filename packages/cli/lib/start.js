import { START_COMMANDS } from "./paths.js";

export function runStart() {
  console.log("Marketing Brain — MCP server start commands");
  console.log("Run from the monorepo root:\n");
  for (const cmd of START_COMMANDS) {
    console.log(`  ${cmd.label}`);
    console.log(`    npm run ${cmd.script}\n`);
  }
  console.log("Dev mode (watch):");
  console.log("  npm run dev:google | dev:meta | dev:whatsapp | dev:insights | dev:ai-agent | dev:workflows");
  return 0;
}
