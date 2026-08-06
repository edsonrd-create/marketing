import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PACKAGE_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PACKAGE_ROOT, "..", "..");

const ENV_EXAMPLE = `# Marketing Brain v1.1 LTS — environment template
# Copy to .env and fill in credentials

# --- Google Ads ---
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_REFRESH_TOKEN=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CUSTOMER_ID=
# GOOGLE_ADS_SKIP_AUTH_VALIDATE=true

# --- Meta Ads ---
META_ACCESS_TOKEN=
META_AD_ACCOUNT_ID=
# META_APP_ID=
# META_APP_SECRET=
# META_SKIP_AUTH_VALIDATE=true

# --- WhatsApp Cloud API ---
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
# WHATSAPP_API_VERSION=v21.0

# --- Database ---
DATABASE_MODE=memory

# --- Optional Firebase (production persistence) ---
# FIREBASE_PROJECT_ID=
# FIREBASE_CLIENT_EMAIL=
# FIREBASE_PRIVATE_KEY=
`;

export function scaffoldProject(targetDir) {
  const dest = resolve(targetDir);
  mkdirSync(dest, { recursive: true });

  const envExampleSrc = join(REPO_ROOT, ".env.example");
  const envExampleDest = join(dest, ".env.example");
  if (existsSync(envExampleSrc)) {
    cpSync(envExampleSrc, envExampleDest);
  } else {
    writeFileSync(envExampleDest, ENV_EXAMPLE);
  }

  const quickstart = join(dest, "QUICKSTART.md");
  writeFileSync(
    quickstart,
    `# Marketing Brain — Quick Start

1. Copy environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Edit \`.env\` with your Google Ads, Meta, and WhatsApp credentials.

3. Install Marketing Brain (from npm or monorepo):
   \`\`\`bash
   npm install mcp-marketing
   \`\`\`

4. Build and validate:
   \`\`\`bash
   npm run build
   npm run validate
   marketing-brain doctor
   \`\`\`

5. Start MCP servers:
   \`\`\`bash
   marketing-brain start
   \`\`\`

See docs/QUICKSTART.md in the full distribution for details.
`,
  );

  return { dest, envExampleDest, quickstart };
}

export function printQuickstart(targetDir) {
  console.log("");
  console.log("Marketing Brain project scaffolded at:", targetDir);
  console.log("");
  console.log("QUICKSTART");
  console.log("==========");
  console.log(`  cd ${targetDir}`);
  console.log("  cp .env.example .env");
  console.log("  # edit .env with API credentials");
  console.log("  npm run build");
  console.log("  marketing-brain doctor");
  console.log("  marketing-brain start");
  console.log("");
}
