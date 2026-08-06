# CLI Reference

Marketing Brain ships two binaries:

- `marketing-brain` — operations CLI
- `create-marketing-brain` — scaffold a new project directory

## marketing-brain

```bash
marketing-brain <command>
```

| Command | Description |
|---------|-------------|
| `doctor` | Node version, VERSION file, workspace packages |
| `start` | Print `npm run start:*` for each MCP server |
| `validate` | Run `scripts/system-validation.mjs` |
| `live` | Remind about `npm run live:validate` and `.env` |
| `status` | Version + package build status |
| `update` | npm update guidance |
| `version` | Print `Marketing Brain v1.1.0 LTS` |
| `help` | Show help |

Root npm aliases:

```bash
npm run marketing-brain -- doctor
npm run doctor
npm run status
```

## create-marketing-brain

```bash
create-marketing-brain [target-dir]
```

Default target: `marketing-brain-project`

Creates `.env.example`, `QUICKSTART.md`, and prints setup steps.
