# Claude Desktop — MCP Client Integration

Connect Marketing Brain to [Claude Desktop](https://claude.ai/download).

## Prerequisites

```bash
npm install
npm run build
cp .env.example .env
```

## Config file location

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` (if supported by your build) |

## Example

Replace `ROOT` with the absolute monorepo path:

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

See also [`docs/mcp-config.example.json`](mcp-config.example.json).

## Verify

1. Fully quit and reopen Claude Desktop.
2. Open a chat and check the MCP / tools panel for Marketing Brain servers.
3. Run the local harness:

```bash
npm run mcp:smoke
npm run mcp:tools
```

## Notes

- `command` must resolve to Node.js on Claude’s PATH (use full path to `node` if needed).
- Do not put real secrets in git — use local config only.
