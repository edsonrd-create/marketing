import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CLI_ROOT, MIN_NODE_MAJOR, REPO_ROOT, WORKSPACES } from "./paths.js";

export function readVersion() {
  const versionFile = join(REPO_ROOT, "VERSION");
  if (!existsSync(versionFile)) {
    throw new Error(`VERSION file not found at ${versionFile}`);
  }
  return readFileSync(versionFile, "utf8").trim();
}

export function runDoctor() {
  console.log("Marketing Brain CLI — doctor");
  const major = Number.parseInt(process.versions.node.split(".")[0], 10);
  if (major >= MIN_NODE_MAJOR) {
    console.log(`✓ Node ${process.version} (>=${MIN_NODE_MAJOR})`);
  } else {
    console.error(`✗ Node ${process.version} — requires >=${MIN_NODE_MAJOR}`);
    return 1;
  }

  const versionFile = join(REPO_ROOT, "VERSION");
  if (existsSync(versionFile)) {
    console.log(`✓ VERSION: ${readVersion()}`);
  } else {
    console.error(`✗ VERSION file missing`);
    return 1;
  }

  let issues = 0;
  for (const ws of WORKSPACES) {
    const pkgPath = join(REPO_ROOT, ws.dir, "package.json");
    if (existsSync(pkgPath)) {
      console.log(`✓ ${ws.name}`);
    } else {
      console.error(`✗ missing ${ws.name} (${ws.dir}/package.json)`);
      issues += 1;
    }
  }

  if (!existsSync(join(REPO_ROOT, ".env.example"))) {
    console.warn("! .env.example missing");
  }

  return issues > 0 ? 1 : 0;
}
