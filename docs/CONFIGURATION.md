# Configuration

Marketing Brain validates environment variables on boot via **EnvValidator** (Zod)
and exposes them through **ConfigService**.

## Quick start

```bash
cp .env.example .env
# edit .env
npm run dev
```

## Environment (`.env`)

### App / HTTP shell

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | no | `development` | `development` \| `test` \| `production` |
| `LOG_LEVEL` | no | `info` | `info` \| `warn` \| `error` \| `debug` (+ fatal/trace/silent) |
| `HOST` | no | `0.0.0.0` | Fastify bind host |
| `PORT` | no | `3000` | Fastify bind port |
| `DATABASE_MODE` | no | `memory` | `memory` \| `sqlite` \| `postgres` |
| `MARKETING_BRAIN_STRICT_ENV` | no | `false` | When `true`, provider credentials are mandatory |

### OpenAI

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | for OpenAI service | API key |
| `OPENAI_MODEL` | no | Default `gpt-4o-mini` |

### Google Ads

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_ADS_CLIENT_ID` | for Google Ads MCP / service | OAuth client ID |
| `GOOGLE_ADS_CLIENT_SECRET` | for Google Ads | OAuth client secret |
| `GOOGLE_ADS_REFRESH_TOKEN` | for Google Ads | OAuth refresh token |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | for Google Ads | Ads API developer token |
| `GOOGLE_ADS_CUSTOMER_ID` | for Google Ads | Ads customer ID |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | no | MCC login customer id |
| `GOOGLE_ADS_SKIP_AUTH_VALIDATE` | no | `true` for smoke tests |
| `GOOGLE_ADS_LIVE_AUTH` | no | `1` for live OAuth + API |
| `GOOGLE_ADS_FORCE_MOCK` | no | `true` to force mock data layer |

See [GOOGLE_ADS.md](GOOGLE_ADS.md) for the full provider guide.

### Meta Ads

| Variable | Required | Description |
|----------|----------|-------------|
| `META_ACCESS_TOKEN` | for Meta Ads MCP | Graph API access token |
| `META_AD_ACCOUNT_ID` | for Meta Ads MCP | Ad account ID (`act_...`) |
| `META_SKIP_AUTH_VALIDATE` | no | `true` for smoke tests |

### WhatsApp

| Variable | Required | Description |
|----------|----------|-------------|
| `WHATSAPP_TOKEN` | for WhatsApp MCP | Cloud API token |
| `WHATSAPP_PHONE_NUMBER_ID` | for WhatsApp MCP | Phone number ID |
| `WHATSAPP_STUB` | no | `true` to skip Graph API (local MCP smoke/tools) |

### Optional Firebase

`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

## Validation behaviour

1. On `npm run dev` / `npm run start`, `ConfigService.create()` loads `.env`.
2. Missing `.env` throws `ValidationError` (copy from `.env.example`).
3. Invalid types fail boot with structured Zod details.
4. Incomplete provider credentials emit **warnings** (HTTP shell still starts).
5. Set `MARKETING_BRAIN_STRICT_ENV=true` to require all providers.

## JSON config

Profiles in `config/`:

- `default.json` — base settings
- `development.json` — debug logging
- `production.json` — production defaults

## Script flags

- `SKIP_DOTENV_FILE=true` — skip loading `.env` in scripts / MCP harness
- `GOOGLE_ADS_SKIP_AUTH_VALIDATE=true` — smoke without OAuth
- `META_SKIP_AUTH_VALIDATE=true` — smoke without Meta live validation
- `WHATSAPP_STUB=true` — WhatsApp tools without live Graph calls

## Classes

| Class | Path | Role |
|-------|------|------|
| `EnvValidator` | `src/config/EnvValidator.ts` | Zod validation |
| `ConfigService` | `src/config/ConfigService.ts` | Env + JSON profile |
| `LoggerFactory` | `src/logger/` + `@mcp-marketing/shared` | Pino factory |

MCP client guides: [cursor.md](cursor.md), [claude.md](claude.md), [chatgpt.md](chatgpt.md), [mcp-config.example.json](mcp-config.example.json).
