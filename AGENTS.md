# AGENTS.md

## Cursor Cloud specific instructions

This repository (`mcp-marketing`) is currently a **greenfield / empty** Git tree: only an initial empty commit exists on `master`. There is no application source, package manifest, Dockerfile, compose stack, or documented product surface.

Until product code and dependency manifests are added:

- There is nothing to lint, test, build, or run.
- The VM update script is intentionally a no-op (`true`).
- Do not invent a full product just to “complete setup”; wait for application code (or an explicit request to scaffold a specific stack).

Common runtimes already available in the Cloud Agent image include Node.js (nvm), npm/pnpm, Python 3, Go, and Rust. Prefer adding real manifests (`package.json`, `pyproject.toml`, etc.) before extending the update script.
