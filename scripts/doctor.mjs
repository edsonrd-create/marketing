import { existsSync } from "node:fs";
import {
  ALL_WORKSPACES,
  ROOT,
  VERSION_FILE,
  buildWorkspaceStatus,
  checkNodeVersion,
  formatPlatform,
  readVersion,
} from "./lib/shared.mjs";

let issues = 0;

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function warn(msg) {
  console.warn(`! ${msg}`);
  issues += 1;
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  issues += 1;
}

console.log("Marketing Brain Doctor");
console.log("======================");

const nodeCheck = checkNodeVersion();
if (nodeCheck.ok) {
  ok(`Node ${nodeCheck.current} (${nodeCheck.required})`);
} else {
  fail(`Node ${nodeCheck.current} — requires ${nodeCheck.required}`);
}

console.log(`Platform: ${formatPlatform()}`);
console.log(`Root: ${ROOT}`);

if (existsSync(VERSION_FILE)) {
  try {
    ok(`VERSION: ${readVersion()}`);
  } catch (error) {
    fail(error.message);
  }
} else {
  fail(`VERSION file missing at ${VERSION_FILE}`);
}

const envExample = `${ROOT}/.env.example`;
if (existsSync(envExample)) {
  ok(".env.example present");
} else {
  warn(".env.example missing — copy before live validation");
}

const envFile = `${ROOT}/.env`;
if (existsSync(envFile)) {
  ok(".env present");
} else {
  console.log("i .env missing — required for live API validation (optional for LTS smoke)");
}

console.log("\nWorkspaces:");
for (const ws of buildWorkspaceStatus()) {
  if (!ws.exists) {
    fail(`${ws.name} — package.json missing`);
    continue;
  }
  const dist = ws.dist ? "dist ok" : "dist missing (run npm run build)";
  ok(`${ws.name} v${ws.version} — ${dist}`);
}

for (const ws of ALL_WORKSPACES) {
  if (!existsSync(`${ROOT}/${ws.dir}`)) {
    fail(`directory missing: ${ws.dir}`);
  }
}

console.log(`\nDoctor finished with ${issues} issue(s).`);
process.exit(issues > 0 ? 1 : 0);
