# Docker — Marketing Brain v1.1 LTS

Imagens e compose oficiais estão na raiz do repositório.

## Artefatos

| Arquivo | Função |
|---------|--------|
| `Dockerfile` | Build multi-stage (Node 22) + HEALTHCHECK |
| `docker-compose.yml` | Serviço com volumes e healthcheck |
| `docker/healthcheck.sh` | Script de saúde (VERSION + dist) |
| `docker/README.md` | Guia detalhado de uso |

## Comandos

```bash
docker build -t marketing-brain:1.1.0-lts .
docker run --rm marketing-brain:1.1.0-lts
docker compose up
```

Monte `.env` em runtime — nunca embuta segredos na imagem:

```bash
docker run --rm --env-file .env marketing-brain:1.1.0-lts
```

## Desenvolvimento local (sem Docker)

```bash
npm install
npm run build
npm run start:google
```

## Health checks (host)

```bash
npm run validate
npm run mcp:smoke
npm run marketing-brain -- doctor
```

## Pacote de release (sem container)

```bash
npm run package:release
```
