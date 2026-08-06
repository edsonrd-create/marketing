# Marketing Brain v1.1.0 LTS

Plataforma MCP instalável para marketing digital: **Google Ads**, **Meta Ads**, **WhatsApp**, **Insights**, **AI Agent** e **Workflows**.

Stack: Node.js · TypeScript · MCP SDK · Fastify · Google Ads API · OpenAI · Pino · Zod

## Instalação

```bash
npm install
cp .env.example .env   # preencha credenciais conforme necessário
npm run build
```

## Configuração

Variáveis em `.env` — validadas automaticamente por `EnvValidator` / `ConfigService`.

Detalhes: [docs/CONFIGURATION.md](docs/CONFIGURATION.md)

```bash
npm run doctor
```

## Desenvolvimento

Sobe o shell HTTP (Fastify) com logs estruturados (Pino):

```bash
npm run dev
```

Endpoints:

- `GET /` — info
- `GET /health` — status dos serviços
- `GET /ready` — readiness (MCP dist)

Produção / build local:

```bash
npm run build
npm start
```

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run build` | Shared + MCP packages + app (`src/`) |
| `npm run dev` | Fastify em watch (`tsx`) |
| `npm start` | App compilada (`dist-app/`) |
| `npm run typecheck` | TypeScript (workspaces + app) |
| `npm run lint` | ESLint |
| `npm test` | Testes dos workspaces |
| `npm run doctor` | Diagnóstico do ambiente |
| `npm run test:google` | Testes do provider Google Ads (10/10 tools) |
| `npm run validate:google` | Validação do provider Google Ads |
| `npm run mcp:smoke` | Smoke MCP stdio (52 tools) |
| `npm run mcp:tools` | Chamadas de teste + `MCP_TOOLS_REPORT.md` |

Scripts por servidor MCP mantidos: `dev:google`, `start:meta`, etc.

## Estrutura do projeto

```text
src/                         # Shell HTTP / base da aplicação
├── config/                  # ConfigService, EnvValidator
├── core/                    # bootstrap, Fastify app
├── logger/                  # LoggerFactory (Pino)
├── providers/
│   └── google-ads/          # Provider MCP completo (Sprint 2)
├── routes/                  # health, ready
├── services/
│   ├── google-ads/
│   ├── openai/
│   └── mcp/
├── tools/
├── schemas/
├── scripts/
├── utils/
├── types/
└── index.ts

shared/                      # libs compartilhadas (erros, logger, MCP helpers)
mcp-*/                       # servidores MCP (stdio) — 52 tools
packages/cli/                # CLI marketing-brain
docs/                        # documentação
```

Arquitetura MCP stdio **não muda**: os pacotes `mcp-*` continuam sendo os servidores de tools.

## Integração MCP (clientes)

| Cliente | Guia |
|---------|------|
| Cursor | [docs/cursor.md](docs/cursor.md) |
| Claude Desktop | [docs/claude.md](docs/claude.md) |
| ChatGPT Desktop | [docs/chatgpt.md](docs/chatgpt.md) |

Template: [docs/mcp-config.example.json](docs/mcp-config.example.json)

## MCP Servers (52 tools)

| Servidor | Pacote | Tools |
|----------|--------|------:|
| Google Ads | `@mcp-marketing/google-ads` | 10 |
| Meta Ads | `@mcp-marketing/meta-ads` | 8 |
| WhatsApp | `@mcp-marketing/whatsapp` | 6 |
| Insights | `@mcp-marketing/insights` | 8 |
| AI Agent | `@mcp-marketing/ai-agent` | 7 |
| Workflows | `@mcp-marketing/workflows` | 13 |

## Google Ads (provider completo)

Guia: [docs/GOOGLE_ADS.md](docs/GOOGLE_ADS.md)

```bash
# mock / CI
npm run test:google
npm run validate:google

# conta real (sem alterar código)
# preencha GOOGLE_ADS_* no .env e:
GOOGLE_ADS_LIVE_AUTH=1 npm run start:google
```

## Documentação

- [docs/QUICKSTART.md](docs/QUICKSTART.md)
- [docs/CLI.md](docs/CLI.md)
- [docs/CONFIGURATION.md](docs/CONFIGURATION.md)
- [docs/GOOGLE_ADS.md](docs/GOOGLE_ADS.md)
- [docs/DOCKER.md](docs/DOCKER.md)

## Licença

MIT — see [LICENSE](LICENSE)
