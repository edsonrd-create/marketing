# Cursor — MCP Client Integration

Connect Marketing Brain MCP servers to [Cursor](https://cursor.com).

## Prerequisites

```bash
npm install
npm run build
cp .env.example .env   # fill credentials for live use
```

## Cursor MCP config

Add servers under **Cursor Settings → MCP**, or edit `~/.cursor/mcp.json` (user) / `.cursor/mcp.json` (project).

Example (absolute paths — adjust `ROOT`):

```json
{
  "mcpServers": {
    "marketing-brain-google-ads": {
      "command": "node",
      "args": ["ROOT/mcp-google-ads/dist/index.js"],
      "cwd": "ROOT",
      "env": {
        "GOOGLE_ADS_CLIENT_ID": "your-client-id",
        "GOOGLE_ADS_CLIENT_SECRET": "your-client-secret",
        "GOOGLE_ADS_REFRESH_TOKEN": "your-refresh-token",
        "GOOGLE_ADS_DEVELOPER_TOKEN": "your-developer-token",
        "GOOGLE_ADS_CUSTOMER_ID": "your-customer-id"
      }
    },
    "marketing-brain-meta-ads": {
      "command": "node",
      "args": ["ROOT/mcp-meta-ads/dist/index.js"],
      "cwd": "ROOT",
      "env": {
        "META_ACCESS_TOKEN": "your-access-token",
        "META_AD_ACCOUNT_ID": "act_XXXXXXXX"
      }
    },
    "marketing-brain-whatsapp": {
      "command": "node",
      "args": ["ROOT/mcp-whatsapp/dist/server.js"],
      "cwd": "ROOT",
      "env": {
        "WHATSAPP_TOKEN": "your-token",
        "WHATSAPP_PHONE_NUMBER_ID": "your-phone-number-id"
      }
    },
    "marketing-brain-insights": {
      "command": "node",
      "args": ["ROOT/mcp-insights/dist/server.js"],
      "cwd": "ROOT"
    },
    "marketing-brain-ai-agent": {
      "command": "node",
      "args": ["ROOT/mcp-ai-agent/dist/server.js"],
      "cwd": "ROOT"
    },
    "marketing-brain-workflows": {
      "command": "node",
      "args": ["ROOT/mcp-workflows/dist/server.js"],
      "cwd": "ROOT"
    }
  }
}
```

Full template without secrets: [`docs/mcp-config.example.json`](mcp-config.example.json).

## Verify

1. Restart Cursor / reload MCP servers.
2. Confirm **52 tools** across the six servers.
3. Local harness (no live credentials required for structure + stub):

```bash
npm run mcp:smoke
npm run mcp:tools
```

## Notes

- Transport is **stdio** (no HTTP port).
- Prefer `env` in MCP config over baking secrets into images or commits.
- For offline WhatsApp smoke: `WHATSAPP_STUB=true`.
