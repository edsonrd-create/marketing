import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  ALL_WORKSPACES,
  ROOT,
  countTestFiles,
  formatPlatform,
  getExpectedToolsCount,
  getGitCommit,
  getNpmVersion,
  getWorkspacePackageNames,
  readVersion,
} from "./lib/shared.mjs";

const version = readVersion();
const packages = getWorkspacePackageNames();
const toolsCount = getExpectedToolsCount();
const testsCount = countTestFiles();

const buildInfo = {
  version,
  commit: getGitCommit(),
  date: new Date().toISOString(),
  node: process.version,
  npm: getNpmVersion(),
  platform: formatPlatform(),
  packages,
  toolsCount,
  testsCount,
};

const releaseManifest = {
  name: "marketing-brain",
  version,
  release: `${version}-lts`,
  generatedAt: buildInfo.date,
  commit: buildInfo.commit,
  node: buildInfo.node,
  npm: buildInfo.npm,
  platform: buildInfo.platform,
  workspaces: ALL_WORKSPACES.map((ws) => ws.name),
  toolsCount,
  testsCount,
  artifacts: ["BUILD_INFO.json", "RELEASE_MANIFEST.json"],
};

writeFileSync(join(ROOT, "BUILD_INFO.json"), `${JSON.stringify(buildInfo, null, 2)}\n`);
writeFileSync(join(ROOT, "RELEASE_MANIFEST.json"), `${JSON.stringify(releaseManifest, null, 2)}\n`);

console.log("BUILD_INFO.json written");
console.log("RELEASE_MANIFEST.json written");
console.log(`version=${version} tools=${toolsCount} tests=${testsCount}`);
