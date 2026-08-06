export function getDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Guto Express — Painel APK & Marketing Brain AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace']
          },
          colors: {
            gutoRed: {
              50: '#fef2f2',
              100: '#ffe1e1',
              500: '#ef4444',
              600: '#dc2626',
              700: '#b91c1c',
            },
            gutoGreen: {
              500: '#10b981',
              600: '#059669',
            },
            gutoYellow: {
              400: '#fbbf24',
              500: '#f59e0b',
            },
            slateDark: {
              canvas: '#090d14',
              card: '#101625',
              hover: '#182033',
              border: '#1e293b',
              subtle: '#334155'
            }
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #090d14;
      color: #f1f5f9;
      -webkit-tap-highlight-color: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #090d14;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #1e293b;
      border-radius: 4px;
    }

    .glass-nav {
      background: rgba(16, 22, 37, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .glass-card {
      background: rgba(16, 22, 37, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(30, 41, 59, 0.8);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }

    .apk-container {
      max-width: 100%;
      margin: 0 auto;
    }
    @media (min-width: 640px) {
      .apk-container {
        max-width: 640px;
      }
    }
    @media (min-width: 1024px) {
      .apk-container {
        max-width: 1280px;
      }
    }

    /* Active Tab Highlight Effect */
    .tab-btn.active-tab {
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.12);
    }
    .bottom-tab.active-tab {
      color: #ef4444;
    }
    .bottom-tab.active-tab .tab-icon {
      transform: translateY(-2px);
      color: #ef4444;
    }
  </style>
</head>
<body class="bg-slateDark-canvas text-slate-100 min-h-screen flex flex-col custom-scrollbar selection:bg-red-500/30 selection:text-red-200 pb-24">

  <!-- Mobile APK Header Banner -->
  <header class="border-b border-slate-800/80 glass-nav sticky top-0 z-50 shadow-md">
    <div class="apk-container px-4 h-16 flex items-center justify-between">
      <!-- Logo & Guto Express Title -->
      <div class="flex items-center space-x-3">
        <!-- Brand Logo Badge with Guto Express Colors (Red, Green, Yellow) -->
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-amber-500 to-emerald-500 p-0.5 shadow-lg shadow-red-600/20">
          <div class="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-lg">
            🍕
          </div>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <span class="font-extrabold text-base tracking-tight text-white">
              GUTO <span class="text-red-500">EXPRESS</span>
            </span>
            <span class="text-[9px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              APK v3.0
            </span>
          </div>
          <p class="text-[11px] text-slate-400 flex items-center gap-1">
            <span class="text-amber-400"><i class="fa-solid fa-bolt text-[9px]"></i></span>
            Marketing Brain AI
          </p>
        </div>
      </div>

      <!-- Quick Action Badges -->
      <div class="flex items-center space-x-2">
        <button onclick="openCreateCampaignModal()" class="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 active:scale-95 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-red-600/25 transition-all">
          <i class="fa-solid fa-plus text-xs"></i>
          <span class="hidden sm:inline">Nova Campanha</span>
        </button>

        <button onclick="switchTab('brain-os')" class="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold active:scale-95 transition-all">
          <i class="fa-solid fa-server text-indigo-400 text-xs"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Desktop Horizontal Navigation Tab Bar -->
  <nav class="hidden md:block bg-slateDark-card border-b border-slate-800 sticky top-16 z-40">
    <div class="apk-container px-4">
      <div class="flex space-x-1 overflow-x-auto py-2 custom-scrollbar">
        <button onclick="switchTab('overview')" id="tab-overview" class="tab-btn active-tab px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600/20 text-red-400 border border-red-500/30 flex items-center space-x-2 whitespace-nowrap transition-all">
          <i class="fa-solid fa-chart-pie text-red-500"></i>
          <span>Visão Geral</span>
        </button>
        <button onclick="switchTab('campaigns')" id="tab-campaigns" class="tab-btn px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slateDark-hover flex items-center space-x-2 whitespace-nowrap transition-all">
          <i class="fa-solid fa-rectangle-ad text-emerald-400"></i>
          <span>Campanhas</span>
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>
        <button onclick="switchTab('recommendations')" id="tab-recommendations" class="tab-btn px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slateDark-hover flex items-center space-x-2 whitespace-nowrap transition-all">
          <i class="fa-solid fa-lightbulb text-amber-400"></i>
          <span>Dicas IA</span>
        </button>
        <button onclick="switchTab('chat')" id="tab-chat" class="tab-btn px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slateDark-hover flex items-center space-x-2 whitespace-nowrap transition-all">
          <i class="fa-solid fa-robot text-purple-400"></i>
          <span>Assistente IA</span>
        </button>
        <button onclick="switchTab('whatsapp')" id="tab-whatsapp" class="tab-btn px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slateDark-hover flex items-center space-x-2 whitespace-nowrap transition-all">
          <i class="fa-brands fa-whatsapp text-emerald-400"></i>
          <span>WhatsApp CRM</span>
        </button>
        <button onclick="switchTab('automations')" id="tab-automations" class="tab-btn px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slateDark-hover flex items-center space-x-2 whitespace-nowrap transition-all">
          <i class="fa-solid fa-bolt text-amber-400"></i>
          <span>Automações</span>
        </button>
        <button onclick="switchTab('brain-os')" id="tab-brain-os" class="tab-btn px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slateDark-hover flex items-center space-x-2 whitespace-nowrap transition-all">
          <i class="fa-solid fa-server text-indigo-400"></i>
          <span>Brain OS</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Toast Banner Notification -->
  <div id="toast-banner" class="hidden apk-container px-4 mt-3">
    <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg backdrop-blur-md">
      <div class="flex items-center space-x-2">
        <i class="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
        <span id="toast-message">Operação concluída com sucesso.</span>
      </div>
      <button onclick="hideToast()" class="text-emerald-400 hover:text-emerald-200 font-bold px-2">&times;</button>
    </div>
  </div>

  <!-- Main APK App Content Body -->
  <main class="flex-1 apk-container px-4 py-5 space-y-6">

    <!-- TAB 1: VISÃO GERAL (MOBILE & DESKTOP DASHBOARD) -->
    <section id="view-overview" class="tab-view space-y-5">
      
      <!-- Top Title Bar -->
      <div class="flex items-center justify-between gap-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div>
          <h1 class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Visão Geral Guto Express</span>
            <span class="text-[10px] px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 font-mono">AO VIVO</span>
          </h1>
          <p class="text-xs text-slate-400">KPIs de Vendas, Tráfego Pago e Performance</p>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="loadDashboardData()" class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all text-xs">
            <i class="fa-solid fa-rotate"></i>
          </button>
        </div>
      </div>

      <!-- Bento Metric KPI Grid (Guto Express Brand Highlights) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- KPI 1: Vendas / Investimento (Red Accent) -->
        <div class="glass-card p-4 rounded-2xl space-y-2 relative overflow-hidden group">
          <div class="absolute -right-3 -top-3 w-16 h-16 bg-red-600/10 rounded-full blur-xl group-hover:bg-red-600/20 transition-all"></div>
          <div class="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Investimento</span>
            <div class="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
              <i class="fa-solid fa-sack-dollar text-xs"></i>
            </div>
          </div>
          <div class="text-xl sm:text-2xl font-extrabold text-white font-mono">R$ 18.450</div>
          <div class="flex items-center text-[10px] sm:text-xs text-emerald-400 font-bold">
            <i class="fa-solid fa-arrow-trend-up mr-1"></i>
            <span>+14.2% este mês</span>
          </div>
        </div>

        <!-- KPI 2: ROAS Médio (Green Accent) -->
        <div class="glass-card p-4 rounded-2xl space-y-2 relative overflow-hidden group">
          <div class="absolute -right-3 -top-3 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div class="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>ROAS Médio</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <i class="fa-solid fa-chart-line text-xs"></i>
            </div>
          </div>
          <div class="text-xl sm:text-2xl font-extrabold text-white font-mono">4.35x</div>
          <div class="flex items-center text-[10px] sm:text-xs text-emerald-400 font-bold">
            <i class="fa-solid fa-arrow-trend-up mr-1"></i>
            <span>+0.8x com IA</span>
          </div>
        </div>

        <!-- KPI 3: Pedidos & Conversões (Yellow/Gold Accent) -->
        <div class="glass-card p-4 rounded-2xl space-y-2 relative overflow-hidden group">
          <div class="absolute -right-3 -top-3 w-16 h-16 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
          <div class="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Pedidos/Conversões</span>
            <div class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <i class="fa-solid fa-pizza-slice text-xs"></i>
            </div>
          </div>
          <div class="text-xl sm:text-2xl font-extrabold text-white font-mono">1.284</div>
          <div class="flex items-center text-[10px] sm:text-xs text-amber-400 font-bold">
            <i class="fa-solid fa-bullseye mr-1"></i>
            <span>CPA: R$ 14,36</span>
          </div>
        </div>

        <!-- KPI 4: WhatsApp Leads CRM (Green Accent) -->
        <div class="glass-card p-4 rounded-2xl space-y-2 relative overflow-hidden group">
          <div class="absolute -right-3 -top-3 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div class="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Leads WhatsApp</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <i class="fa-brands fa-whatsapp text-xs"></i>
            </div>
          </div>
          <div class="text-xl sm:text-2xl font-extrabold text-white font-mono">642</div>
          <div class="flex items-center text-[10px] sm:text-xs text-emerald-400 font-bold">
            <i class="fa-solid fa-bolt mr-1"></i>
            <span>89% Auto IA</span>
          </div>
        </div>
      </div>

      <!-- Performance Mobile Optimized Line Chart -->
      <div class="glass-card p-4 rounded-2xl space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <i class="fa-solid fa-chart-column text-red-500"></i>
            <span>Desempenho de Vendas & Anúncios</span>
          </h2>
          <span class="text-[11px] text-slate-400 font-mono">Últimos 30 dias</span>
        </div>
        <div class="h-56 w-full">
          <canvas id="overviewChart"></canvas>
        </div>
      </div>

      <!-- AI Insight Banner Box -->
      <div class="glass-card p-4 rounded-2xl border-l-4 border-l-red-500 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider flex items-center gap-1">
            <i class="fa-solid fa-brain"></i> Insight do Marketing Brain AI
          </span>
          <span class="text-xs text-emerald-400 font-bold">+R$ 500/mês ROAS</span>
        </div>
        <h3 class="text-sm font-bold text-white">Recomendação de Redistribuição de Verba</h3>
        <p class="text-xs text-slate-300 leading-relaxed">
          A campanha de Google Ads <strong class="text-red-400">"[Search] Delivery Guto Express"</strong> teve ganho de +28% no CTR. Recomendamos redistribuir R$ 500 do Meta Ads para otimizar o custo por pedido.
        </p>
        <button onclick="askAiPrompt('Otimizar campanha Delivery Guto Express')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs font-bold active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>Executar Otimização Automática</span>
        </button>
      </div>

    </section>

    <!-- TAB 2: GESTÃO DE CAMPANHAS -->
    <section id="view-campaigns" class="tab-view hidden space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div>
          <h1 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-rectangle-ad text-emerald-400"></i>
            <span>Gestão de Campanhas</span>
          </h1>
          <p class="text-xs text-slate-400">Status, orçamentos e otimizações ativas</p>
        </div>
        <button onclick="openCreateCampaignModal()" class="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95">
          <i class="fa-solid fa-plus text-xs"></i>
          <span>Criar Campanha</span>
        </button>
      </div>

      <div class="glass-card rounded-2xl overflow-hidden shadow-xl border border-slate-800">
        <div class="p-3.5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <div class="flex items-center space-x-2 font-bold text-xs text-white uppercase tracking-wider">
            <i class="fa-solid fa-list-check text-red-500"></i>
            <span>Campanhas Cadastradas</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">Sync OK</span>
        </div>
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th class="p-3">Status</th>
                <th class="p-3">Plataforma</th>
                <th class="p-3">Nome</th>
                <th class="p-3">Orçamento</th>
                <th class="p-3">ROAS</th>
                <th class="p-3">Ações</th>
              </tr>
            </thead>
            <tbody id="campaigns-table-body" class="divide-y divide-slate-800/80">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- TAB 3: DICAS & RECOMENDAÇÕES IA -->
    <section id="view-recommendations" class="tab-view hidden space-y-5">
      <div class="flex items-center justify-between bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div>
          <h1 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-lightbulb text-amber-400"></i>
            <span>Recomendações IA</span>
          </h1>
          <p class="text-xs text-slate-400">Melhores práticas para acelerar conversões</p>
        </div>
        <button onclick="fetchRecommendations()" class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all text-xs">
          <i class="fa-solid fa-rotate"></i>
        </button>
      </div>

      <div id="recommendations-container" class="space-y-3">
        <!-- Rendered dynamically -->
      </div>
    </section>

    <!-- TAB 4: ASSISTENTE IA (DIRECT SYSTEM EXECUTION) -->
    <section id="view-chat" class="tab-view hidden space-y-4">
      <div class="glass-card rounded-2xl p-3.5 flex items-center justify-between border border-slate-800">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white text-base font-bold shadow-md shrink-0">
            🤖
          </div>
          <div>
            <h2 class="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Assistente AI — Guto Express v3.0</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">Direto</span>
            </h2>
            <p class="text-[11px] text-slate-400">Ações técnicas de tráfego, corte de custos e regras</p>
          </div>
        </div>

        <button onclick="clearChat()" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors">
          Limpar
        </button>
      </div>

      <!-- Fast Action Buttons (Brand Themed) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button onclick="askAiPrompt('Otimizar campanha de Display e cortar R$ 30/dia')" class="p-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-left transition-all active:scale-95">
          <div class="text-xs font-bold text-red-400">⚡ Cortar Desperdício</div>
          <div class="text-[10px] text-slate-400 truncate">Ajuste de R$ 30/dia</div>
        </button>
        <button onclick="askAiPrompt('Excluir canais de apps mobile e YouTube kids no Google Ads')" class="p-2.5 rounded-xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-left transition-all active:scale-95">
          <div class="text-xs font-bold text-amber-400">🚫 Excluir Apps & Kids</div>
          <div class="text-[10px] text-slate-400 truncate">adsenseformobile</div>
        </button>
        <button onclick="askAiPrompt('Definir limite de frequência de 3 impressões por dia')" class="p-2.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-left transition-all active:scale-95">
          <div class="text-xs font-bold text-emerald-400">📊 Frequency Cap</div>
          <div class="text-[10px] text-slate-400 truncate">3 exibições/dia</div>
        </button>
        <button onclick="askAiPrompt('Adicionar palavras-chave negativas em correspondência exata')" class="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all active:scale-95">
          <div class="text-xs font-bold text-sky-400">📉 Negativar Buscas</div>
          <div class="text-[10px] text-slate-400 truncate">[gratis], [curso]</div>
        </button>
        <button onclick="askAiPrompt('Ajustar lances de dispositivos e zerar Smart TVs')" class="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all active:scale-95">
          <div class="text-xs font-bold text-purple-400">📱 Dispositivos</div>
          <div class="text-[10px] text-slate-400 truncate">-100% Smart TV</div>
        </button>
        <button onclick="askAiPrompt('Inserir lista de compradores em exclusão de público')" class="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all active:scale-95">
          <div class="text-xs font-bold text-teal-400">👥 Excluir Compradores</div>
          <div class="text-[10px] text-slate-400 truncate">Compradores 30-180d</div>
        </button>
      </div>

      <!-- Chat Box Window -->
      <div class="glass-card rounded-2xl h-[420px] flex flex-col border border-slate-800 overflow-hidden">
        <!-- Messages Container -->
        <div id="chat-messages" class="flex-1 p-3.5 overflow-y-auto space-y-3 custom-scrollbar text-xs">
          <!-- Initial Message -->
          <div class="flex items-start space-x-2.5">
            <div class="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-sm">
              🤖
            </div>
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 max-w-[90%] text-slate-200 leading-relaxed shadow-sm space-y-2">
              <div class="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5 font-bold text-red-400">
                <span>Guto Express Marketing Brain AI</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">Execução Direta</span>
              </div>
              <p>Envie sua ordem técnica de otimização, corte de custos ou ajuste de lances.</p>
            </div>
          </div>
        </div>

        <!-- Chat Input Form -->
        <div class="p-2.5 border-t border-slate-800 bg-slate-950/80">
          <form id="chat-form" onsubmit="handleChatSubmit(event)" class="flex gap-2">
            <input type="text" id="chat-input" placeholder="Digite sua instrução de otimização..." required class="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition-colors">
            <button type="submit" id="chat-send-btn" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-red-600/20">
              <span>Enviar</span>
              <i class="fa-solid fa-paper-plane text-[10px]"></i>
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- TAB 5: WHATSAPP CRM -->
    <section id="view-whatsapp" class="tab-view hidden space-y-5">
      <div class="flex items-center justify-between bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div>
          <h1 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-brands fa-whatsapp text-emerald-400"></i>
            <span>WhatsApp Business CRM</span>
          </h1>
          <p class="text-xs text-slate-400">Pedidos, atendimentos e automações</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Lead list -->
        <div class="glass-card p-4 rounded-2xl space-y-3">
          <h3 class="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-users text-emerald-400"></i>
            <span>Pedidos & Clientes CRM</span>
          </h3>
          <div class="space-y-2">
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <div>
                <div class="text-xs font-bold text-white">Carlos Silva (Pizza Grande)</div>
                <div class="text-[11px] text-slate-400">+55 11 98888-7777 • Origem: Google Ads</div>
              </div>
              <span class="px-2 py-1 rounded-lg text-[10px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Atendido IA</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <div>
                <div class="text-xs font-bold text-white">Mariana Costa (Combo Express)</div>
                <div class="text-[11px] text-slate-400">+55 21 97777-6666 • Origem: Meta Ads</div>
              </div>
              <span class="px-2 py-1 rounded-lg text-[10px] bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">Aguardando</span>
            </div>
          </div>
        </div>

        <!-- Automation status -->
        <div class="glass-card p-4 rounded-2xl space-y-3">
          <h3 class="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-robot text-amber-400"></i>
            <span>Fluxo de Mensagem Automático</span>
          </h3>
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div><strong class="text-amber-400">Gatilho:</strong> Clique no Anúncio WhatsApp</div>
            <div><strong class="text-emerald-400">Ação IA:</strong> Enviar cardápio interativo Guto Express e registrar pedido no CRM.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 6: AUTOMAÇÕES -->
    <section id="view-automations" class="tab-view hidden space-y-5">
      <div class="flex items-center justify-between bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div>
          <h1 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-bolt text-amber-400"></i>
            <span>Automações de Tráfego</span>
          </h1>
          <p class="text-xs text-slate-400">Regras de otimização automática ativas</p>
        </div>
      </div>

      <div class="space-y-3">
        <div class="glass-card p-4 rounded-2xl flex justify-between items-center">
          <div>
            <div class="font-bold text-white text-xs sm:text-sm">Escala Automática de Orçamento</div>
            <div class="text-xs text-slate-400">Aumenta verba em 15% se o ROAS for > 4.0x por 3 dias consecutivos.</div>
          </div>
          <span class="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ativo</span>
        </div>

        <div class="glass-card p-4 rounded-2xl flex justify-between items-center">
          <div>
            <div class="font-bold text-white text-xs sm:text-sm">Alerta de Custo por Pedido</div>
            <div class="text-xs text-slate-400">Notifica no WhatsApp se o CPA ultrapassar R$ 25,00 por pedido.</div>
          </div>
          <span class="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ativo</span>
        </div>
      </div>
    </section>

    <!-- TAB 7: BRAIN OS -->
    <section id="view-brain-os" class="tab-view hidden space-y-5">
      <div class="flex items-center justify-between bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div>
          <h1 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-server text-indigo-400"></i>
            <span>Brain OS — Monitoramento</span>
          </h1>
          <p class="text-xs text-slate-400">Status do sistema e APIs</p>
        </div>
        <button onclick="runSystemDiagnostics()" class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold active:scale-95 transition-all">
          Diagnóstico
        </button>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="glass-card p-3.5 rounded-2xl">
          <div class="text-[10px] text-slate-400 font-bold uppercase">Google Ads API</div>
          <div class="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Online
          </div>
        </div>
        <div class="glass-card p-3.5 rounded-2xl">
          <div class="text-[10px] text-slate-400 font-bold uppercase">Meta Ads API</div>
          <div class="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Online
          </div>
        </div>
        <div class="glass-card p-3.5 rounded-2xl">
          <div class="text-[10px] text-slate-400 font-bold uppercase">OpenAI Direct</div>
          <div class="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Ativo
          </div>
        </div>
        <div class="glass-card p-3.5 rounded-2xl">
          <div class="text-[10px] text-slate-400 font-bold uppercase">Guto Express Engine</div>
          <div class="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> v3.0 OK
          </div>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-4 space-y-2">
        <div class="text-xs font-bold text-white uppercase tracking-wider">Logs do Sistema</div>
        <div id="diagnostic-logs" class="bg-slate-950 p-3 rounded-xl text-[11px] font-mono text-slate-300 space-y-1 h-36 overflow-y-auto custom-scrollbar border border-slate-800">
          <div><span class="text-slate-500">[SYSTEM]</span> Guto Express Marketing Brain v3.0 iniciado.</div>
          <div><span class="text-emerald-400">[HEALTH]</span> Servidor rodando na porta 3000. Todas as rotas ativas.</div>
        </div>
      </div>
    </section>

  </main>

  <!-- MOBILE FIXED BOTTOM TAB NAVIGATION BAR (APK App Style) -->
  <nav class="fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-slate-800/90 py-2 px-2">
    <div class="apk-container flex justify-around items-center">
      
      <!-- Tab 1: Visão Geral -->
      <button onclick="switchTab('overview')" id="bottom-tab-overview" class="bottom-tab active-tab flex flex-col items-center justify-center w-14 text-slate-400 hover:text-red-400 transition-all active:scale-90">
        <i class="fa-solid fa-chart-pie tab-icon text-lg mb-0.5"></i>
        <span class="text-[10px] font-bold">Geral</span>
      </button>

      <!-- Tab 2: Campanhas -->
      <button onclick="switchTab('campaigns')" id="bottom-tab-campaigns" class="bottom-tab flex flex-col items-center justify-center w-14 text-slate-400 hover:text-red-400 transition-all active:scale-90">
        <i class="fa-solid fa-rectangle-ad tab-icon text-lg mb-0.5 text-emerald-400"></i>
        <span class="text-[10px] font-bold">Anúncios</span>
      </button>

      <!-- Tab 3: Dicas IA -->
      <button onclick="switchTab('recommendations')" id="bottom-tab-recommendations" class="bottom-tab flex flex-col items-center justify-center w-14 text-slate-400 hover:text-red-400 transition-all active:scale-90">
        <i class="fa-solid fa-lightbulb tab-icon text-lg mb-0.5 text-amber-400"></i>
        <span class="text-[10px] font-bold">Dicas</span>
      </button>

      <!-- Tab 4: Assistente IA (Highlighted Center CTA Button) -->
      <button onclick="switchTab('chat')" id="bottom-tab-chat" class="bottom-tab flex flex-col items-center justify-center w-14 text-slate-400 hover:text-red-400 transition-all active:scale-90">
        <div class="w-10 h-10 -mt-5 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white text-base shadow-lg shadow-red-600/30 border border-red-400/30">
          🤖
        </div>
        <span class="text-[10px] font-bold mt-0.5">IA Brain</span>
      </button>

      <!-- Tab 5: WhatsApp CRM -->
      <button onclick="switchTab('whatsapp')" id="bottom-tab-whatsapp" class="bottom-tab flex flex-col items-center justify-center w-14 text-slate-400 hover:text-red-400 transition-all active:scale-90">
        <i class="fa-brands fa-whatsapp tab-icon text-lg mb-0.5 text-emerald-400"></i>
        <span class="text-[10px] font-bold">CRM</span>
      </button>

      <!-- Tab 6: Brain OS -->
      <button onclick="switchTab('brain-os')" id="bottom-tab-brain-os" class="bottom-tab flex flex-col items-center justify-center w-14 text-slate-400 hover:text-red-400 transition-all active:scale-90">
        <i class="fa-solid fa-server tab-icon text-lg mb-0.5 text-indigo-400"></i>
        <span class="text-[10px] font-bold">System</span>
      </button>

    </div>
  </nav>

  <!-- MODAL: CRIAR NOVA CAMPANHA -->
  <div id="modal-create-campaign" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="glass-card rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl border border-slate-800">
      <div class="flex justify-between items-center border-b border-slate-800 pb-2.5">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-square-plus text-red-500"></i>
          <span>Criar Campanha Guto Express</span>
        </h3>
        <button onclick="closeCreateCampaignModal()" class="text-slate-400 hover:text-white font-bold text-xl px-2">&times;</button>
      </div>

      <form id="form-create-campaign" onsubmit="handleCreateCampaignSubmit(event)" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Nome da Campanha</label>
          <input type="text" id="campaign-name" placeholder="Ex: [Google Search] Delivery Guto Express" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Plataforma</label>
            <select id="campaign-platform" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
              <option value="google-ads">Google Ads</option>
              <option value="meta-ads">Meta Ads</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Orçamento/dia (R$)</label>
            <input type="number" id="campaign-budget" value="100" step="10" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Estratégia de Lance</label>
          <input type="text" id="campaign-strategy" placeholder="Ex: Maximizador de Conversões (tCPA R$ 12,00)" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
        </div>

        <div class="flex justify-end space-x-2 pt-3 border-t border-slate-800">
          <button type="button" onclick="closeCreateCampaignModal()" class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-red-600/20">
            <i class="fa-solid fa-check text-xs"></i>
            <span>Salvar e Ativar</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <script>
    // Global State
    let campaignsData = [];

    // Tab Switching Functionality (Unified Desktop & Mobile Bottom Nav)
    function switchTab(tabId) {
      document.querySelectorAll('.tab-view').forEach(el => el.classList.add('hidden'));
      
      // Update top desktop tabs
      document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active-tab', 'bg-red-600/20', 'text-red-400', 'border-red-500/30');
        el.classList.add('text-slate-400');
      });

      // Update bottom mobile tabs
      document.querySelectorAll('.bottom-tab').forEach(el => {
        el.classList.remove('active-tab', 'text-red-500');
        el.classList.add('text-slate-400');
      });

      const activeView = document.getElementById('view-' + tabId);
      if (activeView) activeView.classList.remove('hidden');

      const activeTopTab = document.getElementById('tab-' + tabId);
      if (activeTopTab) {
        activeTopTab.classList.add('active-tab', 'bg-red-600/20', 'text-red-400', 'border-red-500/30');
        activeTopTab.classList.remove('text-slate-400');
      }

      const activeBottomTab = document.getElementById('bottom-tab-' + tabId);
      if (activeBottomTab) {
        activeBottomTab.classList.add('active-tab', 'text-red-500');
        activeBottomTab.classList.remove('text-slate-400');
      }

      if (tabId === 'campaigns') fetchCampaigns();
      if (tabId === 'recommendations') fetchRecommendations();
    }

    // Modal Controls
    function openCreateCampaignModal() {
      document.getElementById('modal-create-campaign').classList.remove('hidden');
    }

    function closeCreateCampaignModal() {
      document.getElementById('modal-create-campaign').classList.add('hidden');
    }

    // Toast Banner
    function showToast(msg) {
      const toast = document.getElementById('toast-banner');
      document.getElementById('toast-message').innerText = msg;
      toast.classList.remove('hidden');
      setTimeout(() => hideToast(), 5000);
    }

    function hideToast() {
      document.getElementById('toast-banner').classList.add('hidden');
    }

    // Fetch and render campaigns dynamically
    async function fetchCampaigns() {
      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        campaignsData = data.campaigns || [];
        renderCampaignsTable(campaignsData);
      } catch (err) {
        console.error("Erro ao carregar campanhas:", err);
      }
    }

    function renderCampaignsTable(campaigns) {
      const tbody = document.getElementById('campaigns-table-body');
      if (!tbody) return;

      if (!campaigns || campaigns.length === 0) {
        tbody.innerHTML = \`<tr><td colspan="6" class="p-4 text-center text-slate-400">Nenhuma campanha cadastrada.</td></tr>\`;
        return;
      }

      tbody.innerHTML = campaigns.map(c => {
        const isGoogle = c.platform === 'google-ads';
        const platformBadge = isGoogle 
          ? \`<span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold flex items-center gap-1 w-fit border border-blue-500/20 text-[10px]"><i class="fa-brands fa-google"></i> Google</span>\`
          : \`<span class="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold flex items-center gap-1 w-fit border border-sky-500/20 text-[10px]"><i class="fa-brands fa-meta"></i> Meta</span>\`;

        const statusClass = c.status === 'Ativa'
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20';

        return \`
          <tr class="hover:bg-slate-800/40 transition-colors">
            <td class="p-2.5">
              <button onclick="toggleCampaignStatus('\${c.id}')" class="px-2 py-0.5 rounded text-[10px] font-bold \${statusClass} flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full \${c.status === 'Ativa' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}"></span>
                <span>\${c.status}</span>
              </button>
            </td>
            <td class="p-2.5">\${platformBadge}</td>
            <td class="p-2.5 font-bold text-white text-xs truncate max-w-[120px] sm:max-w-none">\${escapeHtml(c.name)}</td>
            <td class="p-2.5 font-semibold text-slate-200 font-mono text-xs">R$ \${Number(c.budget).toFixed(0)}</td>
            <td class="p-2.5 font-bold text-emerald-400 font-mono text-xs">\${c.roas ? c.roas + 'x' : '4.2x'}</td>
            <td class="p-2.5">
              <div class="flex items-center space-x-1">
                <button onclick="toggleCampaignStatus('\${c.id}')" class="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-semibold">
                  \${c.status === 'Ativa' ? 'Pausar' : 'Ativar'}
                </button>
                <button onclick="askAiPrompt('Otimizar campanha \${escapeHtml(c.name)}')" class="px-2 py-1 rounded bg-red-600/20 text-red-300 border border-red-500/30 text-[10px] font-semibold">
                  IA
                </button>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    async function toggleCampaignStatus(id) {
      try {
        const res = await fetch(\`/api/campaigns/\${id}/status\`, { method: 'PATCH' });
        const data = await res.json();
        if (data.success) {
          showToast(data.message);
          fetchCampaigns();
        }
      } catch (err) {
        showToast("Erro ao alterar status da campanha");
      }
    }

    async function handleCreateCampaignSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('campaign-name').value;
      const platform = document.getElementById('campaign-platform').value;
      const budget = parseFloat(document.getElementById('campaign-budget').value);
      const strategy = document.getElementById('campaign-strategy').value;

      try {
        const res = await fetch('/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, platform, budget, strategy })
        });
        const data = await res.json();
        if (data.success) {
          closeCreateCampaignModal();
          showToast(data.message);
          switchTab('campaigns');
        }
      } catch (err) {
        showToast("Erro ao criar campanha");
      }
    }

    // Fetch and render operational recommendations
    async function fetchRecommendations() {
      const container = document.getElementById('recommendations-container');
      if (!container) return;

      try {
        const res = await fetch('/api/recommendations');
        const data = await res.json();
        const recs = data.recommendations || [];

        if (recs.length === 0) {
          container.innerHTML = \`<div class="p-4 text-center text-slate-400 text-xs">Sem recomendações no momento.</div>\`;
          return;
        }

        container.innerHTML = recs.map(r => \`
          <div class="glass-card p-4 rounded-2xl space-y-2 border border-slate-800">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">\${escapeHtml(r.type || 'Otimização')}</span>
              <span class="text-xs font-bold text-emerald-400 font-mono">\${escapeHtml(r.impact || '+15% ROAS')}</span>
            </div>
            <h4 class="text-xs font-bold text-white">\${escapeHtml(r.title)}</h4>
            <p class="text-xs text-slate-300">\${escapeHtml(r.description)}</p>
            <div class="pt-2 flex justify-end">
              <button onclick="askAiPrompt('\${escapeHtml(r.actionPrompt || r.title)}')" class="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-xs font-bold active:scale-95 transition-all">
                Aplicar com IA
              </button>
            </div>
          </div>
        \`).join('');

      } catch (err) {
        container.innerHTML = \`<div class="p-4 text-center text-red-400 text-xs">Erro ao carregar recomendações.</div>\`;
      }
    }

    function askAiPrompt(promptText) {
      switchTab('chat');
      const input = document.getElementById('chat-input');
      input.value = promptText;
      const form = document.getElementById('chat-form');
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }

    async function handleChatSubmit(e) {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      const userMessage = input.value.trim();
      if (!userMessage) return;

      const chatMessages = document.getElementById('chat-messages');

      // Append User Message
      const userMsgHtml = \`
        <div class="flex items-start justify-end space-x-2">
          <div class="bg-red-600 text-white rounded-2xl p-3 max-w-[85%] leading-relaxed font-medium shadow-md text-xs">
            \${escapeHtml(userMessage)}
          </div>
        </div>
      \`;
      chatMessages.innerHTML += userMsgHtml;
      input.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Loading Placeholder
      const loadingId = 'loading-' + Date.now();
      const loadingHtml = \`
        <div id="\${loadingId}" class="flex items-start space-x-2.5">
          <div class="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-sm">
            🤖
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-slate-400 text-xs flex items-center space-x-2">
            <i class="fa-solid fa-spinner fa-spin text-red-500"></i>
            <span>Executando ação técnica no Marketing Brain...</span>
          </div>
        </div>
      \`;
      chatMessages.innerHTML += loadingHtml;
      chatMessages.scrollTop = chatMessages.scrollHeight;

      try {
        const startTime = performance.now();
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage })
        });

        const data = await res.json();
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);

        // Remove loading
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        const botReply = data.reply || "Processado com sucesso pelo agente da plataforma.";

        // Append Bot Reply
        const botMsgHtml = \`
          <div class="flex items-start space-x-2.5">
            <div class="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-sm">
              🤖
            </div>
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 max-w-[88%] text-slate-200 leading-relaxed space-y-2 shadow-md">
              <div class="flex items-center justify-between text-[10px] text-red-400 font-bold border-b border-slate-800 pb-1">
                <span>Guto Express Direct Technical Engine</span>
                <span class="text-slate-500 font-mono">\${latency}ms</span>
              </div>
              <div class="text-xs whitespace-pre-line font-sans">\${escapeHtml(botReply)}</div>
            </div>
          </div>
        \`;
        chatMessages.innerHTML += botMsgHtml;
        chatMessages.scrollTop = chatMessages.scrollHeight;

      } catch (err) {
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        chatMessages.innerHTML += \`
          <div class="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs">
            Erro de comunicação com o serviço de IA: \${err.message}
          </div>
        \`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }

    function clearChat() {
      const chatMessages = document.getElementById('chat-messages');
      chatMessages.innerHTML = \`
        <div class="flex items-start space-x-2.5">
          <div class="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 text-xs">
            🤖
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 max-w-[80%] text-slate-200 leading-relaxed text-xs">
            <p class="font-bold text-red-400 mb-1">Guto Express Direct Engine</p>
            Histórico limpo. Prorrogue ou envie novas instruções de otimização.
          </div>
        </div>
      \`;
    }

    function escapeHtml(text) {
      return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    // Chart initialization
    window.addEventListener('DOMContentLoaded', () => {
      fetchCampaigns();
      fetchRecommendations();

      const ctx = document.getElementById('overviewChart');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [
              {
                label: 'Guto Express Vendas (R$ x100)',
                data: [38, 45, 52, 60],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                fill: true,
                tension: 0.35,
                borderWidth: 2
              },
              {
                label: 'Google Ads (ROAS x10)',
                data: [35, 42, 45, 48],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                fill: true,
                tension: 0.35,
                borderWidth: 2
              },
              {
                label: 'Meta Ads (ROAS x10)',
                data: [28, 32, 38, 39],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                fill: true,
                tension: 0.35,
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 10 } } }
            },
            scales: {
              x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 10 } } },
              y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 10 } } }
            }
          }
        });
      }
    });

    async function runSystemDiagnostics() {
      const logs = document.getElementById('diagnostic-logs');
      logs.innerHTML += \`<div><span class="text-amber-400">[DIAGNOSTIC]</span> Iniciando verificação de APIs e banco de dados Guto Express...</div>\`;
      
      try {
        const res = await fetch('/health');
        const data = await res.json();
        logs.innerHTML += \`<div><span class="text-emerald-400">[SUCCESS]</span> Status do sistema: \${data.status}. Versão \${data.version}.</div>\`;
      } catch(e) {
        logs.innerHTML += \`<div><span class="text-red-400">[ERROR]</span> Falha na verificação: \${e.message}</div>\`;
      }
      logs.scrollTop = logs.scrollHeight;
    }

    function loadDashboardData() {
      fetchCampaigns();
      fetchRecommendations();
      runSystemDiagnostics();
    }
  </script>
</body>
</html>`;
}
