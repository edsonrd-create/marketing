# Marketing Brain v1.1 LTS — production image (stdio MCP)
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json VERSION tsconfig.base.json tsconfig.json ./
COPY shared/package.json ./shared/
COPY mcp-google-ads/package.json ./mcp-google-ads/
COPY mcp-meta-ads/package.json ./mcp-meta-ads/
COPY mcp-whatsapp/package.json ./mcp-whatsapp/
COPY mcp-insights/package.json ./mcp-insights/
COPY mcp-ai-agent/package.json ./mcp-ai-agent/
COPY mcp-workflows/package.json ./mcp-workflows/
COPY packages/cli/package.json ./packages/cli/
COPY packages/create-marketing-brain/package.json ./packages/create-marketing-brain/

RUN npm ci

COPY shared ./shared
COPY mcp-google-ads ./mcp-google-ads
COPY mcp-meta-ads ./mcp-meta-ads
COPY mcp-whatsapp ./mcp-whatsapp
COPY mcp-insights ./mcp-insights
COPY mcp-ai-agent ./mcp-ai-agent
COPY mcp-workflows ./mcp-workflows
COPY packages ./packages
COPY scripts ./scripts
COPY config ./config

RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json VERSION ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/mcp-google-ads ./mcp-google-ads
COPY --from=builder /app/mcp-meta-ads ./mcp-meta-ads
COPY --from=builder /app/mcp-whatsapp ./mcp-whatsapp
COPY --from=builder /app/mcp-insights ./mcp-insights
COPY --from=builder /app/mcp-ai-agent ./mcp-ai-agent
COPY --from=builder /app/mcp-workflows ./mcp-workflows
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/scripts ./scripts
COPY docker/healthcheck.sh ./docker/healthcheck.sh

RUN chmod +x docker/healthcheck.sh

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('fs').accessSync('VERSION')" || exit 1

CMD ["node", "packages/cli/bin/marketing-brain.js", "version"]
