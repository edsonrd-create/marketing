# Marketing Brain v1.1.0 LTS — Release Notes

**Release date:** 2026-08-03  
**Codename:** LTS  
**Node:** >= 22

## Overview

Marketing Brain v1.1 LTS is an installable MCP platform for marketing operations: Google Ads, Meta Ads, WhatsApp messaging, analytics insights, an approval-aware AI agent, and workflow automation.

## Highlights

- **52 MCP tools** across 6 servers
- **CLI tooling** for doctor, validation, status, and release packaging
- **Monorepo workspaces** with shared TypeScript/ESM foundation
- **Memory database mode** by default; optional Firebase configuration documented

## Upgrade / Install

```bash
npm install
npm run build
npm run validate
marketing-brain doctor
```

## Validation

```bash
npm run validate      # structure and tool counts
npm run mcp:smoke     # source/dist smoke (no credentials)
npm run live:validate # writes report; blocked without .env (exit 0)
```

## Distribution

```bash
npm run build:info
npm run package:release
```

Artifacts: `BUILD_INFO.json`, `RELEASE_MANIFEST.json`, `dist-release/marketing-brain-1.1.0-lts.tar.gz`.

See `LTS_CERTIFICATION.md` for the Long Term Support sign-off.

Produces `dist-release/marketing-brain-1.1.0-lts/` and tarball.

## Support

See `docs/QUICKSTART.md` and `docs/CONFIGURATION.md` for setup.
