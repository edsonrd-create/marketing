# Google Ads MCP Provider (Sprint 2)

Connect a Google Ads account and run all provider tools **without code changes**.

## Setup

1. Copy env and fill OAuth credentials:

```bash
cp .env.example .env
```

Required:

- `GOOGLE_ADS_CLIENT_ID`
- `GOOGLE_ADS_CLIENT_SECRET`
- `GOOGLE_ADS_REFRESH_TOKEN`
- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `GOOGLE_ADS_CUSTOMER_ID`

Optional:

- `GOOGLE_ADS_LOGIN_CUSTOMER_ID` — MCC / manager account
- `GOOGLE_ADS_LIVE_AUTH=1` — live OAuth refresh + Google Ads API
- `GOOGLE_ADS_SKIP_AUTH_VALIDATE=true` — skip live refresh (mock/smoke)
- `GOOGLE_ADS_FORCE_MOCK=true` — force in-memory mock data layer

2. Build and start the MCP server:

```bash
npm run build
npm run start:google
```

3. Point Cursor / Claude at `mcp-google-ads/dist/index.js` (see [cursor.md](cursor.md)).

## Tools (10)

| Tool | Description |
|------|-------------|
| `list_campaigns` | List campaigns |
| `get_campaign` | Get campaign by id |
| `create_campaign` | Create campaign |
| `pause_campaign` | Pause campaign |
| `enable_campaign` | Enable campaign |
| `update_budget` | Update daily budget (micros) |
| `campaign_report` | Performance report |
| `search_keywords` | Keyword ideas |
| `list_customers` | Accessible customers |
| `account_info` | Account metadata |

## Validation

```bash
npm run test:google
npm run validate:google
```

Live mode:

```bash
GOOGLE_ADS_LIVE_AUTH=1 npm run start:google
```

## Layout

```text
src/providers/google-ads/
├── auth/           # GoogleAdsAuthManager (OAuth2, refresh, cache)
├── campaigns/
├── keywords/
├── reports/
├── budgets/
├── customers/
├── conversions/
├── services/       # Provider facade + live/mock clients
├── schemas/        # Zod
└── tools/          # MCP registration
```
