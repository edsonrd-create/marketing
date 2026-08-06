import { existsSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, WORKSPACES } from "./paths.js";
import { readVersion } from "./doctor.js";

export function runStatus() {
  const version = readVersion();
  console.log(`Marketing Brain v${version} LTS`);
  console.log("Packages:\n");

  for (const ws of WORKSPACES) {
    const pkgPath = join(REPO_ROOT, ws.dir, "package.json");
    const distPath = join(REPO_ROOT, ws.dir, "dist");
    const exists = existsSync(pkgPath);
    const built = existsSync(distPath);
    const tools = ws.tools ? ` (${ws.tools} tools)` : "";
    const state = !exists ? "missing" : built ? "built" : "source only";
    console.log(`  ${ws.name.padEnd(36)} [${state}]${tools}`);
  }

  return 0;
}
