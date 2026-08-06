import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { readVersion, ROOT } from "./lib/shared.mjs";

const version = readVersion();
const releaseName = `marketing-brain-${version}-lts`;
const distRoot = join(ROOT, "dist-release");
const releaseDir = join(distRoot, releaseName);

const rootFiles = [
  "VERSION",
  "BUILD_INFO.json",
  "RELEASE_MANIFEST.json",
  "CHANGELOG.md",
  "RELEASE_NOTES.md",
  "LICENSE",
  "NOTICE",
  "THIRD_PARTY_LICENSES.md",
  "LTS_CERTIFICATION.md",
  "README.md",
  "SECURITY.md",
  "SUPPORT.md",
];

const rootDirs = ["config", "docs", "docker"];

function ensureBuildInfo() {
  if (!existsSync(join(ROOT, "BUILD_INFO.json")) || !existsSync(join(ROOT, "RELEASE_MANIFEST.json"))) {
    execSync("node scripts/build-info.mjs", { cwd: ROOT, stdio: "inherit" });
  }
}

function copyIfExists(src, dest) {
  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true });
    return true;
  }
  return false;
}

ensureBuildInfo();

mkdirSync(distRoot, { recursive: true });
mkdirSync(releaseDir, { recursive: true });

for (const file of rootFiles) {
  const copied = copyIfExists(join(ROOT, file), join(releaseDir, file));
  if (!copied && ["VERSION", "BUILD_INFO.json", "RELEASE_MANIFEST.json"].includes(file)) {
    throw new Error(`Required release file missing: ${file}`);
  }
}

for (const dir of rootDirs) {
  copyIfExists(join(ROOT, dir), join(releaseDir, dir));
}

// CLI "binaries" (Node entrypoints) + installer
mkdirSync(join(releaseDir, "bin"), { recursive: true });
copyIfExists(
  join(ROOT, "packages/cli/bin/marketing-brain.js"),
  join(releaseDir, "bin/marketing-brain.js"),
);
copyIfExists(
  join(ROOT, "packages/create-marketing-brain/bin/create-marketing-brain.js"),
  join(releaseDir, "bin/create-marketing-brain.js"),
);
copyIfExists(join(ROOT, "packages/cli"), join(releaseDir, "packages/cli"));
copyIfExists(
  join(ROOT, "packages/create-marketing-brain"),
  join(releaseDir, "packages/create-marketing-brain"),
);

const manifestPath = join(releaseDir, "RELEASE_MANIFEST.json");
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifest.packagedAt = new Date().toISOString();
  manifest.bundle = `${releaseName}.tar.gz`;
  const files = [];
  function walk(current, prefix = "") {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full, rel);
      } else {
        files.push({ path: rel, bytes: statSync(full).size });
      }
    }
  }
  walk(releaseDir);
  manifest.files = files;
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

const tarballPath = join(distRoot, `${releaseName}.tar.gz`);
execSync(`tar -czf "${tarballPath}" -C "${distRoot}" "${releaseName}"`, { cwd: ROOT, stdio: "inherit" });

console.log(`Release folder: ${releaseDir}`);
console.log(`Created ${tarballPath}`);
