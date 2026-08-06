# ChatGPT Desktop — MCP Client Integration

Status for Marketing Brain v1.1 LTS: **document when supported**.

OpenAI’s ChatGPT Desktop MCP support varies by product surface and account. Until an official, stable local MCP stdio integration is available for your build, use Cursor or Claude Desktop.

## When ChatGPT Desktop supports local MCP

Use the same stdio pattern as other clients:

| Field | Value |
|-------|--------|
| Executable | `node` (absolute path recommended) |
| Args | path to `dist/index.js` or `dist/server.js` per package |
| cwd | monorepo root |
| env | credentials from `.env` (never commit secrets) |

Template: [`docs/mcp-config.example.json`](mcp-config.example.json).

### Example shape (illustrative)

```json
{
  "mcpServers": {
    "marketing-brain-insights": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-marketing/mcp-insights/dist/server.js"],
      "cwd": "/absolute/path/to/mcp-marketing",
      "env": {}
    }
  }
}
```

Repeat for Google Ads, Meta Ads, WhatsApp, AI Agent, and Workflows (see Cursor/Claude docs).

## Validate without ChatGPT

```bash
npm run build
npm run mcp:smoke
npm run mcp:tools
```

These scripts start all six MCP servers over stdio, confirm **52 tools**, and write `MCP_TOOLS_REPORT.md`.

## Recommendation

| Client | Guide |
|--------|--------|
| Cursor | [docs/cursor.md](cursor.md) |
| Claude Desktop | [docs/claude.md](claude.md) |
| ChatGPT Desktop | This page (enable when your build supports MCP) |
