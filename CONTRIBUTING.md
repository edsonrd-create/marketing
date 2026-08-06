# Contributing to Marketing Brain

Obrigado pelo interesse em contribuir com o Marketing Brain v1.1 LTS.

## Código de conduta

Seja respeitoso e construtivo em issues, PRs e discussões.

## Como contribuir

1. **Fork** o repositório e crie um branch a partir de `main`.
2. Instale dependências: `npm ci`
3. Faça suas alterações seguindo os padrões existentes.
4. Execute a suíte local:
   ```bash
   npm run build
   npm run lint
   npm run typecheck
   npm run test
   npm run validate
   ```
5. Abra um Pull Request com descrição clara e checklist preenchido.

## Padrões de desenvolvimento

- **Node.js 22+** (ver `engines` no `package.json` raiz)
- **TypeScript** estrito nos pacotes MCP e `shared`
- **ESLint 9** (flat config) + **Prettier** para formatação
- Não altere APIs públicas dos servidores MCP sem discussão prévia
- Não adicione novas ferramentas MCP sem alinhamento com mantenedores

## Estrutura do monorepo

| Pacote | Descrição |
|--------|-----------|
| `shared` | Utilitários compartilhados |
| `mcp-google-ads` | Servidor MCP Google Ads |
| `mcp-meta-ads` | Servidor MCP Meta Ads |
| `mcp-whatsapp` | Servidor MCP WhatsApp |
| `mcp-insights` | Servidor MCP Insights |
| `mcp-ai-agent` | Servidor MCP AI Agent |
| `mcp-workflows` | Servidor MCP Workflows |
| `packages/cli` | CLI `marketing-brain` |

## Commits e PRs

- Use mensagens de commit descritivas em inglês ou português
- Mantenha PRs focados e de escopo limitado
- Referencie issues relacionadas quando aplicável
- Aguarde revisão de CODEOWNERS antes do merge

## Releases

Releases LTS seguem tags semver `v*`. O workflow `.github/workflows/release.yml` gera artefatos em `dist-release/`.

## Dúvidas

Consulte [SUPPORT.md](SUPPORT.md) ou abra uma issue com o template adequado.
