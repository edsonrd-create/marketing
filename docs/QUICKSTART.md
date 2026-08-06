# Quick Start — Marketing Brain v1.1 LTS

## 1. Instalar dependências

```bash
npm install
```

## 2. Configurar ambiente

```bash
cp .env.example .env
```

Preencha as variáveis de Google Ads, Meta e WhatsApp conforme `docs/CONFIGURATION.md`.

## 3. Build e validação

```bash
npm run build
npm run validate
marketing-brain doctor
```

## 4. Iniciar servidores MCP

```bash
marketing-brain start
```

Exemplos:

```bash
npm run start:google
npm run start:meta
npm run start:whatsapp
npm run start:insights
npm run start:ai-agent
npm run start:workflows
```

## 5. Smoke test (sem credenciais)

```bash
npm run mcp:smoke
npm run mcp:tools
```

## Novo projeto

```bash
create-marketing-brain ./meu-projeto
```
