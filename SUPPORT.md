# Support

## Marketing Brain v1.1 LTS

Este documento descreve como obter ajuda com a plataforma Marketing Brain.

## Documentação

- [CONTRIBUTING.md](CONTRIBUTING.md) — como contribuir
- [docker/README.md](docker/README.md) — build e execução via Docker
- [SECURITY.md](SECURITY.md) — reporte responsável de vulnerabilidades

## Problemas e bugs

1. Verifique se está na versão LTS suportada (`VERSION` na raiz do repositório).
2. Execute diagnósticos locais:
   ```bash
   npm run doctor
   npm run status
   npm run validate
   ```
3. Abra uma [issue de bug](.github/ISSUE_TEMPLATE/bug_report.md) com passos de reprodução, versão e logs (sem credenciais).

## Pedidos de funcionalidade

Use o template [feature request](.github/ISSUE_TEMPLATE/feature_request.md) e descreva o problema que a feature resolve.

## Docker

Para problemas de container:

```bash
docker compose logs marketing-brain
docker inspect --format='{{.State.Health.Status}}' marketing-brain
```

## Escopo de suporte da comunidade

- Instalação, build e uso dos servidores MCP
- Integração com clientes MCP compatíveis (stdio)
- CI/CD, packaging e releases LTS

## Fora de escopo

- Suporte comercial ou SLA garantido (use canais contratuais, se houver)
- Credenciais de APIs de terceiros (Google Ads, Meta, WhatsApp)
- Customizações não documentadas em forks privados

## Contato

Mantenedor principal: [@edsonrd-create](https://github.com/edsonrd-create)

Para segurança, siga [SECURITY.md](SECURITY.md) — **não** abra issue pública.
