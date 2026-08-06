import {
  ALL_WORKSPACES,
  EXPECTED_TOOLS,
  MCP_WORKSPACES,
  VERSION_FILE,
  checkNodeVersion,
  countToolsInSource,
  findToolSourceFile,
  getExpectedToolsCount,
  readVersion,
  workspaceExists,
} from "./lib/shared.mjs";

let failed = false;

function fail(message) {
  console.error(`FAIL: ${message}`);
  failed = true;
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

try {
  const version = readVersion();
  pass(`VERSION file present (${version})`);
} catch (error) {
  fail(error.message);
}

const nodeCheck = checkNodeVersion();
if (nodeCheck.ok) {
  pass(`Node ${nodeCheck.current} satisfies ${nodeCheck.required}`);
} else {
  fail(`Node ${nodeCheck.current} does not satisfy ${nodeCheck.required}`);
}

for (const ws of ALL_WORKSPACES) {
  if (workspaceExists(ws.dir)) {
    pass(`workspace package exists: ${ws.name}`);
  } else {
    fail(`missing workspace package: ${ws.name} (${ws.dir}/package.json)`);
  }
}

let totalTools = 0;
for (const ws of MCP_WORKSPACES) {
  const expected = EXPECTED_TOOLS[ws.name] ?? [];
  const sourceFile = findToolSourceFile(ws.dir);

  if (!sourceFile) {
    fail(`tool source not found for ${ws.name}`);
    continue;
  }

  const { count, names } = countToolsInSource(sourceFile);
  totalTools += count;

  if (count !== expected.length) {
    fail(`${ws.name}: expected ${expected.length} tools, found ${count} in source`);
    continue;
  }

  const missing = expected.filter((name) => !names.includes(name));
  if (missing.length > 0) {
    fail(`${ws.name}: missing documented tools: ${missing.join(", ")}`);
    continue;
  }

  pass(`${ws.name}: ${count} tools documented and present`);
}

const expectedTotal = getExpectedToolsCount();
if (totalTools === expectedTotal) {
  pass(`total MCP tools: ${totalTools}/${expectedTotal}`);
} else {
  fail(`total MCP tools: ${totalTools}/${expectedTotal}`);
}

if (failed) {
  process.exit(1);
}

console.log("System validation passed.");
