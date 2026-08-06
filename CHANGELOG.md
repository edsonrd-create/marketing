# Changelog

## [1.1.0] - 2026-08-03 — LTS

### Added
- Marketing Brain CLI (`marketing-brain`) with doctor, start, validate, live, status, update, version
- `create-marketing-brain` project scaffolder
- Operational scripts: build-info, package-release, system-validation, mcp-smoke, mcp-tools, live-validation, compat-init
- Release engineering: `VERSION`, `BUILD_INFO.json`, `RELEASE_MANIFEST.json`
- Docker: `Dockerfile`, `docker-compose.yml`, healthcheck, Docker README
- GitHub: issue templates, PR template, CODEOWNERS, SECURITY, CONTRIBUTING, SUPPORT
- Licensing: LICENSE, NOTICE, THIRD_PARTY_LICENSES.md
- CI/CD: GitHub Actions for build, lint, typecheck, test, validate, and release packaging
- Config profiles (`config/default.json`, `development.json`, `production.json`)
- `.env.example` with Google Ads, Meta, WhatsApp, and database variables
- Docs: QUICKSTART, CLI, CONFIGURATION, DOCKER, `LTS_CERTIFICATION.md`

### MCP Servers (52 tools)
- Google Ads (10), Meta Ads (8), WhatsApp (6), Insights (8), AI Agent (7), Workflows (13)

### Requirements
- Node.js >= 22
- TypeScript ESM monorepo
- Cross-platform: Windows, Linux, macOS
