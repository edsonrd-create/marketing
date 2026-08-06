import {
  MCP_WORKSPACES,
  buildWorkspaceStatus,
  getExpectedToolsCount,
  readVersion,
} from "./lib/shared.mjs";

const version = readVersion();
const workspaces = buildWorkspaceStatus();
const mcpServers = workspaces.filter((ws) => MCP_WORKSPACES.some((m) => m.name === ws.name));

console.log(`Marketing Brain v${version} LTS`);
console.log("================================");
console.log(`MCP servers: ${mcpServers.length}`);
console.log(`MCP tools (documented): ${getExpectedToolsCount()}`);
console.log("");

for (const ws of workspaces) {
  const toolInfo = ws.expectedTools ? ` — ${ws.expectedTools} tools` : "";
  const dist = ws.dist ? "built" : "not built";
  const state = ws.exists ? dist : "missing";
  console.log(`- ${ws.name} (${ws.dir}) [${state}]${toolInfo}`);
}

console.log("\nNext steps:");
console.log("  npm run build");
console.log("  npm run validate");
console.log("  npm run mcp:smoke");
console.log("  marketing-brain start");
