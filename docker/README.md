# Docker — Marketing Brain v1.1 LTS

Este diretório contém os artefatos de containerização da plataforma Marketing Brain (stdio MCP).

## Pré-requisitos

- Docker 24+
- Docker Compose v2 (opcional)

## Build da imagem

Na raiz do repositório:

```bash
docker build -t marketing-brain:1.1.0-lts .
```

## Executar com Docker

```bash
docker run --rm -it \
  -v "$(pwd)/logs:/app/logs" \
  -v "$(pwd)/config:/app/config" \
  marketing-brain:1.1.0-lts
```

Para verificar a saúde do container:

```bash
docker inspect --format='{{.State.Health.Status}}' <container_id>
```

## Executar com Docker Compose

```bash
docker compose up --build -d
```

Ver logs:

```bash
docker compose logs -f marketing-brain
```

Parar os serviços:

```bash
docker compose down
```

## Healthcheck

O healthcheck valida:

1. Presença do arquivo `VERSION` na raiz da aplicação
2. Disponibilidade do runtime Node.js

O script `docker/healthcheck.sh` é usado pelo Compose; a imagem também define um `HEALTHCHECK` nativo via Docker.

## Volumes

| Caminho no host | Caminho no container | Uso |
|-----------------|----------------------|-----|
| `./logs`        | `/app/logs`          | Logs da aplicação |
| `./config`      | `/app/config`        | Configuração local |

## Notas

- Os servidores MCP usam **stdio**; não há porta HTTP exposta por padrão.
- Configure variáveis de ambiente e arquivos em `config/` conforme a documentação do projeto.
