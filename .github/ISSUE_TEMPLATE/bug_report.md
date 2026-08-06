---
name: Bug report
description: Reportar um problema no Marketing Brain
title: "[Bug]: "
labels: ["bug", "triage"]
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        Obrigado por reportar um bug. Preencha o formulário abaixo para nos ajudar a reproduzir e corrigir o problema.

  - type: textarea
    id: description
    attributes:
      label: Descrição
      description: Descreva o bug de forma clara e concisa.
      placeholder: O que aconteceu?
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Passos para reproduzir
      description: Liste os passos para reproduzir o comportamento.
      placeholder: |
        1. Execute '...'
        2. Configure '...'
        3. Observe o erro
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Comportamento esperado
      description: O que deveria acontecer?
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: Comportamento atual
      description: O que acontece de fato?
    validations:
      required: true

  - type: dropdown
    id: component
    attributes:
      label: Componente afetado
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
        - Outro
    validations:
      required: true

  - type: input
    id: version
    attributes:
      label: Versão
      description: Versão do Marketing Brain (ex. 1.1.0)
      placeholder: "1.1.0"
    validations:
      required: true

  - type: dropdown
    id: os
    attributes:
      label: Sistema operacional
      options:
        - Linux
        - macOS
        - Windows
        - Docker
        - Outro
    validations:
      required: true

  - type: input
    id: node
    attributes:
      label: Versão do Node.js
      placeholder: "22.x"
    validations:
      required: true

  - type: textarea
    id: logs
    attributes:
      label: Logs / stack trace
      description: Cole logs relevantes (sem credenciais).
      render: shell

  - type: checkboxes
    id: terms
    attributes:
      label: Confirmação
      options:
        - label: Removi tokens, senhas e dados sensíveis deste reporte.
          required: true
