export function runUpdate() {
  console.log("Marketing Brain — update guidance");
  console.log("");
  console.log("From the monorepo root:");
  console.log("  npm update");
  console.log("  npm install");
  console.log("");
  console.log("Rebuild after dependency updates:");
  console.log("  npm run build");
  console.log("  npm run validate");
  console.log("");
  console.log("Check release notes:");
  console.log("  cat CHANGELOG.md");
  console.log("  cat RELEASE_NOTES.md");
  return 0;
}
