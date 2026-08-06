import { randomUUID } from "node:crypto";
import type { CampaignSnapshot } from "./store.js";

export interface CampaignStructureInput {
  campaignId: string;
  name: string;
  channel: "google" | "meta" | "tiktok" | "linkedin" | string;
  biddingStrategy?: ("manual_cpc" | "maximize_conversions" | "target_cpa" | "target_roas" | "maximize_clicks" | string) | undefined;
  dailyBudget?: number | undefined;
  targetCpa?: number | undefined;
  targetRoas?: number | undefined;
  negativeKeywords?: string[] | undefined;
  negativeKeywordsCount?: number | undefined;
  adGroups?: Array<{
    id?: string | undefined;
    name?: string | undefined;
    keywords?: string[] | undefined;
    keywordsCount?: number | undefined;
    ads?: Array<{
      type?: string | undefined;
      headlines?: string[] | undefined;
      descriptions?: string[] | undefined;
      headlinesCount?: number | undefined;
      descriptionsCount?: number | undefined;
    }> | undefined;
    adsCount?: number | undefined;
  }> | undefined;
  adGroupsCount?: number | undefined;
  trackingConfig?: {
    ga4Configured?: boolean | undefined;
    gtmConfigured?: boolean | undefined;
    metaCapiConfigured?: boolean | undefined;
    serverSideTracking?: boolean | undefined;
  } | undefined;
  targetAudience?: {
    lookalikePercentage?: number | undefined;
    customAudiencesCount?: number | undefined;
  } | undefined;
}

export interface AuditFinding {
  id: string;
  category: "negative_keywords" | "bidding_strategy" | "creative_structure" | "tracking_integration" | "budget_allocation" | "audience_targeting";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  rule: string;
  impactedComponent: string;
  recommendation: string;
}

export interface OptimizationTask {
  id: string;
  campaignId: string;
  title: string;
  category: string;
  priority: "high" | "medium" | "low";
  actionType: "add_negative_keywords" | "update_bidding_strategy" | "add_ad_variations" | "configure_tracking" | "adjust_budget";
  description: string;
  payload: Record<string, unknown>;
  estimatedImpact: string;
  status: "pending" | "in_progress" | "completed";
}

export interface CampaignAuditResult {
  campaignId: string;
  name: string;
  channel: string;
  auditScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  findingsCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  findings: AuditFinding[];
  optimizationTasks: OptimizationTask[];
  auditedAt: string;
}

/**
 * Audit a campaign structure against digital marketing best practices.
 */
export function auditCampaignStructure(campaign: CampaignStructureInput): CampaignAuditResult {
  const findings: AuditFinding[] = [];
  const tasks: OptimizationTask[] = [];

  const isGoogleSearch =
    campaign.channel.toLowerCase() === "google" ||
    campaign.name.toLowerCase().includes("search") ||
    campaign.name.toLowerCase().includes("google");

  const isMeta =
    campaign.channel.toLowerCase() === "meta" ||
    campaign.name.toLowerCase().includes("meta") ||
    campaign.name.toLowerCase().includes("facebook") ||
    campaign.name.toLowerCase().includes("instagram");

  // 1. Negative Keywords Check
  if (isGoogleSearch) {
    const negCount = campaign.negativeKeywordsCount ?? campaign.negativeKeywords?.length ?? 0;
    if (negCount === 0) {
      const findingId = randomUUID();
      findings.push({
        id: findingId,
        category: "negative_keywords",
        severity: "critical",
        title: "Lista de Palavras-Chave Negativas Ausente",
        description: "A campanha do Google Ads Search não possui nenhuma palavra-chave negativa configurada, aumentando o risco de desperdício com buscas irrelevantes.",
        rule: "Google Search Best Practice: Always maintain a negative keyword list to protect budget.",
        impactedComponent: `Campanha: ${campaign.name}`,
        recommendation: "Adicione uma lista inicial de palavras negativas (ex: 'gratis', 'curso', 'vagas', 'pdf', 'emprego').",
      });

      tasks.push({
        id: randomUUID(),
        campaignId: campaign.campaignId,
        title: "Adicionar Lista de Palavras-Chave Negativas Iniciais",
        category: "negative_keywords",
        priority: "high",
        actionType: "add_negative_keywords",
        description: "Cadastrar 15 palavras-chave negativas essenciais para mitigar cliques desqualificados.",
        payload: {
          campaignId: campaign.campaignId,
          suggestedKeywords: ["gratis", "gratuito", "curso", "vagas", "emprego", "pdf", "tcc", "faculdade", "download", "reclame aqui"],
        },
        estimatedImpact: "Redução imediata de 15% a 25% no desperdício de orçamento.",
        status: "pending",
      });
    } else if (negCount < 5) {
      findings.push({
        id: randomUUID(),
        category: "negative_keywords",
        severity: "medium",
        title: "Baixa Cobertura de Palavras-Chave Negativas",
        description: `Existem apenas ${negCount} palavras negativas cadastradas.`,
        rule: "Google Search Best Practice: Expand negative list regularly based on Search Term Audits.",
        impactedComponent: `Campanha: ${campaign.name}`,
        recommendation: "Audite os termos de pesquisa semanalmente e expanda a lista de negativas.",
      });

      tasks.push({
        id: randomUUID(),
        campaignId: campaign.campaignId,
        title: "Expandir Lista de Palavras Negativas com Termos de Busca",
        category: "negative_keywords",
        priority: "medium",
        actionType: "add_negative_keywords",
        description: "Revisar relatório de termos de pesquisa e negativar buscas de baixa intenção.",
        payload: { campaignId: campaign.campaignId },
        estimatedImpact: "Melhoria de +0.8% no CTR e redução do CPA.",
        status: "pending",
      });
    }
  }

  // 2. Bidding Strategy Check
  const strategy = campaign.biddingStrategy?.toLowerCase() ?? "manual_cpc";
  if (strategy === "manual_cpc" || strategy === "maximize_clicks") {
    findings.push({
      id: randomUUID(),
      category: "bidding_strategy",
      severity: "high",
      title: "Uso de Estratégia de Lance Manual / Foco em Cliques",
      description: `A campanha está utilizando '${strategy}', que não otimiza lances para conversão ou ROI em tempo real.`,
      rule: "Smart Bidding Standard: Utilize Target CPA ou Target ROAS alimentados por Machine Learning.",
      impactedComponent: `Estratégia de Lances: ${strategy}`,
      recommendation: "Migrar para 'Maximize Conversions' ou 'Target CPA' para aproveitar o algoritmo preditivo.",
    });

    tasks.push({
      id: randomUUID(),
      campaignId: campaign.campaignId,
      title: "Migrar para Estratégia de Lances Inteligentes (Smart Bidding)",
      category: "bidding_strategy",
      priority: "high",
      actionType: "update_bidding_strategy",
      description: "Atualizar lances da campanha para Maximizar Conversões com tCPA alvo.",
      payload: {
        campaignId: campaign.campaignId,
        recommendedStrategy: "target_cpa",
        targetCpa: campaign.targetCpa ?? 25.0,
      },
      estimatedImpact: "Aumento potencial de +18% a +30% na taxa de conversão.",
      status: "pending",
    });
  } else if (strategy === "target_cpa" && (!campaign.targetCpa || campaign.targetCpa <= 0)) {
    findings.push({
      id: randomUUID(),
      category: "bidding_strategy",
      severity: "medium",
      title: "Target CPA Ausente ou Não Definido",
      description: "A campanha utiliza Target CPA mas não especificou o tCPA limite.",
      rule: "Smart Bidding Calibration: tCPA deve estar alinhado com a média histórica de CPA.",
      impactedComponent: "Configuração de tCPA",
      recommendation: "Calibrar o tCPA com base nos custos de aquisição dos últimos 30 dias.",
    });
  }

  // 3. Creative & Ad Group Structure Check
  const adGroups = campaign.adGroups ?? [];
  const adGroupsCount = campaign.adGroupsCount ?? adGroups.length;

  if (adGroupsCount === 0) {
    findings.push({
      id: randomUUID(),
      category: "creative_structure",
      severity: "high",
      title: "Campanha Sem Grupos de Anúncios Estruturados",
      description: "Nenhum grupo de anúncios foi detectado na campanha.",
      rule: "Campaign Architecture: Minimum of 1-3 tightly themed ad groups required.",
      impactedComponent: campaign.name,
      recommendation: "Criar ao menos 2 grupos de anúncios com temas e palavras-chave alinhados.",
    });

    tasks.push({
      id: randomUUID(),
      campaignId: campaign.campaignId,
      title: "Estruturar Grupos de Anúncios Temáticos",
      category: "creative_structure",
      priority: "high",
      actionType: "add_ad_variations",
      description: "Configurar grupos de anúncios divididos por intenção do consumidor.",
      payload: { campaignId: campaign.campaignId },
      estimatedImpact: "Melhora no Índice de Qualidade (Quality Score) e menor CPC.",
      status: "pending",
    });
  } else {
    // Check ad variations per ad group
    for (const ag of adGroups) {
      const ads = ag.ads ?? [];
      const adsCount = ag.adsCount ?? ads.length;

      if (adsCount < 2) {
        findings.push({
          id: randomUUID(),
          category: "creative_structure",
          severity: "medium",
          title: `Poucas Variações de Anúncios no Grupo '${ag.name ?? "AdGroup"}'`,
          description: "O grupo possui menos de 2 variações de anúncio ativas.",
          rule: "Creative Diversity Rule: Test at least 2-3 ad creative variations per ad group.",
          impactedComponent: ag.name ?? "Grupo de Anúncios",
          recommendation: "Adicionar variações de títulos e descrições com diferentes abordagens neuromarketing.",
        });

        tasks.push({
          id: randomUUID(),
          campaignId: campaign.campaignId,
          title: `Criar Variação de Anúncio para '${ag.name ?? "AdGroup"}'`,
          category: "creative_structure",
          priority: "medium",
          actionType: "add_ad_variations",
          description: "Gerar novo Responsive Search Ad com 5 headlines e 3 descrições otimizadas.",
          payload: { campaignId: campaign.campaignId, adGroupId: ag.id },
          estimatedImpact: "Aumento de até 12% no CTR através de testes A/B.",
          status: "pending",
        });
      }
    }
  }

  // 4. Tracking & Server-Side CAPI Integration Check
  const tracking = campaign.trackingConfig;
  if (!tracking || (!tracking.ga4Configured && !tracking.metaCapiConfigured && !tracking.serverSideTracking)) {
    findings.push({
      id: randomUUID(),
      category: "tracking_integration",
      severity: "critical",
      title: "Integração de Tracking e Server-Side CAPI Incompleta",
      description: "Não foi detectada configuração ativa de GA4 Server-Side ou Meta Conversion API (CAPI).",
      rule: "Data Integrity Best Practice: Implement Server-Side CAPI to overcome cookie loss and iOS privacy limits.",
      impactedComponent: "Tracking & Analytics Engine",
      recommendation: "Configurar disparo via GTM Server-Side + Meta CAPI para garantir atribuição precisa.",
    });

    tasks.push({
      id: randomUUID(),
      campaignId: campaign.campaignId,
      title: "Ativar Tracking Server-Side (Meta CAPI + GA4)",
      category: "tracking_integration",
      priority: "high",
      actionType: "configure_tracking",
      description: "Configurar Meta Conversion API e eventos validados de conversão no GTM.",
      payload: { campaignId: campaign.campaignId, enableCapi: true, enableGa4: true },
      estimatedImpact: "Recuperação de 15% a 30% dos eventos não atribuídos pelo navegador.",
      status: "pending",
    });
  }

  // 5. Audience Targeting Check (For Meta Ads)
  if (isMeta && campaign.targetAudience) {
    const lal = campaign.targetAudience.lookalikePercentage;
    if (lal !== undefined && lal > 5) {
      findings.push({
        id: randomUUID(),
        category: "audience_targeting",
        severity: "medium",
        title: "Público Lookalike Muito Amplo (Acima de 5%)",
        description: `O público semelhante está em ${lal}%, o que pode diluir a afinidade do comprador.`,
        rule: "Meta Targeting Rule: Keep high-intent Lookalikes between 1% and 3%.",
        impactedComponent: "Segmentação de Público Meta Ads",
        recommendation: "Ajustar a porcentagem do Lookalike para 1%-3% com base na lista de compradores LTV.",
      });
    }
  }

  // Calculate overall audit score & grade
  let score = 100;
  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  for (const f of findings) {
    if (f.severity === "critical") {
      score -= 25;
      criticalCount++;
    } else if (f.severity === "high") {
      score -= 15;
      highCount++;
    } else if (f.severity === "medium") {
      score -= 8;
      mediumCount++;
    } else {
      score -= 4;
      lowCount++;
    }
  }

  score = Math.max(0, Math.min(100, score));

  const grade: CampaignAuditResult["grade"] =
    score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";

  return {
    campaignId: campaign.campaignId,
    name: campaign.name,
    channel: campaign.channel,
    auditScore: score,
    grade,
    findingsCount: {
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount,
    },
    findings,
    optimizationTasks: tasks,
    auditedAt: new Date().toISOString(),
  };
}

/**
 * Convenience helper to audit campaign structures from campaign snapshots.
 */
export function auditFromSnapshot(snapshot: CampaignSnapshot): CampaignAuditResult {
  const isGoogle = snapshot.channel.toLowerCase() === "google";
  return auditCampaignStructure({
    campaignId: snapshot.campaignId,
    name: snapshot.name,
    channel: snapshot.channel,
    dailyBudget: snapshot.spend > 0 ? Math.round(snapshot.spend / 30) : 50,
    biddingStrategy: snapshot.conversions > 20 ? "target_cpa" : "manual_cpc",
    ...(isGoogle ? { negativeKeywordsCount: 0 } : {}),
    adGroupsCount: 1,
    trackingConfig: {
      ga4Configured: true,
      gtmConfigured: true,
      metaCapiConfigured: false,
    },
  });
}
