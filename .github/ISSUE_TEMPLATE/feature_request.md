---
name: Feature request
description: Sugerir uma melhoria ou nova funcionalidade
title: "[Feature]: "
labels: ["enhancement", "triage"]
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        Obrigado por sugerir uma melhoria. Descreva o problema que você quer resolver e a solução proposta.

  - type: textarea
    id: problem
    attributes:
      label: Problema / necessidade
      description: Qual problema ou limitação você está enfrentando?
      placeholder: Ex. Preciso integrar relatórios semanais com um webhook externo.
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Solução proposta
      description: Como você imagina que isso deveria funcionar?
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternativas consideradas
      description: Outras abordagens que você avaliou.

  - type: dropdown
    id: component
    attributes:
      label: Componente relacionado
      options:
        - CLI / packaging
        - MCP Google Ads
        - MCP Meta Ads
        - MCP WhatsApp
        - MCP Insights
        - MCP AI Agent
        - MCP Workflows
        - Shared / core
        - Docker / CI
        - Documentação
        - Outro
    validations:
      required: true

  - type: dropdown
    id: priority
    attributes:
      label: Prioridade (sua avaliação)
      options:
        - Baixa
        - Média
        - Alta
        - Crítica

  - type: checkboxes
    id: contribution
    attributes:
      label: Contribuição
      options:
        - label: Estou disposto(a) a abrir um PR para esta funcionalidade.
