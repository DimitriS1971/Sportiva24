import { createEditorialEngine } from '@/lib/intelligence-s24/editorial';
import type { IntelligenceProfile } from '@/lib/domain/intelligenceProfile';
import { fillerSentences, sectionTitles } from '@/lib/intelligence-s24/narrativa/narrativeTemplates';
import {
  describeTeamDifferential,
  detectScenario,
  levelTargets,
} from '@/lib/intelligence-s24/narrativa/narrativeRules';
import type {
  S24NarrativeGenerationOptions,
  S24NarrativeInput,
  S24NarrativeOutput,
  S24NarrativeParagraph,
  S24NarrativeSection,
  S24NarrativeSectionId,
} from '@/lib/intelligence-s24/narrativa/narrativeTypes';
import { countWords, ensureWordRange, formatList, lowFactors, topFactors } from '@/lib/intelligence-s24/narrativa/narrativeUtils';

interface SportNarrativeContext {
  duel: string;
  momentum: string;
  tacticalFocus: string;
  fatigueFocus: string;
}

function getSportNarrativeContext(sport: string): SportNarrativeContext {
  switch (sport) {
    case 'basketball':
      return {
        duel: 'partido',
        momentum: 'ritmo por posesiones',
        tacticalFocus: 'eficiencia ofensiva y ajustes defensivos',
        fatigueFocus: 'rotacion y gestion de minutos',
      };
    case 'tennis':
      return {
        duel: 'duelo',
        momentum: 'secuencia de sets',
        tacticalFocus: 'servicio, resto y puntos de quiebre',
        fatigueFocus: 'resistencia en tramos largos',
      };
    case 'formula1':
      return {
        duel: 'carrera',
        momentum: 'ritmo por vuelta',
        tacticalFocus: 'gestion de neumaticos y estrategia de boxes',
        fatigueFocus: 'consistencia en la ejecucion',
      };
    case 'cycling':
      return {
        duel: 'etapa',
        momentum: 'control del ritmo del peloton',
        tacticalFocus: 'ataque en subida y gestion de relevo',
        fatigueFocus: 'reserva de energia',
      };
    case 'baseball':
      return {
        duel: 'juego',
        momentum: 'control de entradas',
        tacticalFocus: 'produccion de carreras y control del pitcheo',
        fatigueFocus: 'administracion del bullpen',
      };
    case 'esports':
      return {
        duel: 'serie',
        momentum: 'tempo de ejecucion',
        tacticalFocus: 'control de mapa y toma de objetivos',
        fatigueFocus: 'consistencia de toma de decisiones',
      };
    default:
      return {
        duel: 'partido',
        momentum: 'momento competitivo',
        tacticalFocus: 'duelo tactico',
        fatigueFocus: 'gestion fisica',
      };
  }
}

function toNarrativeInputFromProfile(profile: IntelligenceProfile): S24NarrativeInput {
  const factors = profile.factors.map((factor) => ({
    key: factor.key,
    title: factor.label,
    contributionPoints: factor.contribution,
    maxPoints: factor.maxContribution,
    detail: factor.detail,
  }));

  const teamA = (profile.identity as { homeTeam?: string }).homeTeam ?? profile.identity.name;
  const teamB = (profile.identity as { awayTeam?: string }).awayTeam ?? profile.identity.competition ?? 'Rival';

  return {
    sport: profile.identity.sport,
    match: {
      homeTeam: teamA,
      awayTeam: teamB,
      competition: profile.identity.competition ?? 'Competicion',
      status: (profile.identity as { status?: string }).status ?? 'N/A',
      time: (profile.identity as { kickoff?: string }).kickoff ?? profile.metadata.generatedAt,
    },
    summary: {
      s24Index: profile.competitiveState.index.value,
      s24Rating: profile.competitiveState.ratingLabel,
      s24Confianza: profile.competitiveState.confidence.level,
      s24Riesgo: profile.competitiveState.risk.level,
      s24Tendencia: profile.competitiveState.trend.direction,
    },
    teams: [
      {
        side: 'local',
        teamName: teamA,
        s24Index: profile.competitiveState.index.value,
        s24Rating: profile.competitiveState.ratingLabel,
        s24Confianza: profile.competitiveState.confidence.level,
        s24Riesgo: profile.competitiveState.risk.level,
        s24Tendencia: profile.competitiveState.trend.direction,
      },
      {
        side: 'visitante',
        teamName: teamB,
        s24Index: profile.competitiveState.index.value,
        s24Rating: profile.competitiveState.ratingLabel,
        s24Confianza: profile.competitiveState.confidence.level,
        s24Riesgo: profile.competitiveState.risk.level,
        s24Tendencia: profile.competitiveState.trend.direction,
      },
    ],
    factores: factors,
    insight: {
      texto: profile.insights[0]?.summary ?? 'Sin insight registrado.',
      ventajas: profile.insights.slice(0, 2).map((item) => item.title),
      riesgos: profile.alerts.slice(0, 2).map((item) => item.title),
    },
    veredicto: {
      texto: profile.narrative.executiveSummary,
      ventajaCompetitiva: teamA,
    },
  };
}

function buildSection(id: S24NarrativeSectionId, title: string, paragraphs: S24NarrativeParagraph[]): S24NarrativeSection {
  return { id, title, paragraphs };
}

function createParagraph(id: string, text: string, evidenceRefs: string[]): S24NarrativeParagraph {
  const clean = text.trim().replace(/\s+/g, ' ');
  return {
    id,
    text: /[.!?]$/.test(clean) ? clean : `${clean}.`,
    evidenceRefs,
  };
}

function sectionText(section: S24NarrativeSection): string {
  const body = section.paragraphs.map((paragraph) => paragraph.text).join('\n\n');
  return `### ${section.title}\n\n${body}`;
}

function confidenceConcept(confidence: string): 'confidenceHigh' | 'confidenceMedium' | 'confidenceLow' {
  const c = confidence.toLowerCase();
  if (c.includes('muy alta') || c.includes('alta')) return 'confidenceHigh';
  if (c.includes('media')) return 'confidenceMedium';
  return 'confidenceLow';
}

function riskConcept(risk: string): 'riskHigh' | 'riskMedium' | 'riskLow' {
  const r = risk.toLowerCase();
  if (r.includes('alto')) return 'riskHigh';
  if (r.includes('medio')) return 'riskMedium';
  return 'riskLow';
}

function titleTemplateByScenario(key: 'favorable' | 'balanced' | 'uncertain') {
  if (key === 'favorable') return 'titleFavorable';
  if (key === 'balanced') return 'titleBalanced';
  return 'titleUncertain';
}

export function generateS24Narrative(
  input: S24NarrativeInput,
  options: S24NarrativeGenerationOptions = {},
): S24NarrativeOutput {
  const level = options.level ?? 3;
  const targets = levelTargets(level);

  const seed =
    input.match.homeTeam.length * 7
    + input.match.awayTeam.length * 11
    + input.match.competition.length * 5
    + Math.round(input.summary.s24Index * 13);

  const editorial = createEditorialEngine({
    locale: options.locale ?? 'es',
    seed,
  });
  const sportContext = getSportNarrativeContext(input.sport);

  const scenario = detectScenario(input);

  const strongest = topFactors(input.factores, 3);
  const weakest = lowFactors(input.factores, 2);
  const strongestNames = strongest.map((item) => item.title.toLowerCase());
  const weakestNames = weakest.map((item) => item.title.toLowerCase());

  const differentialText = describeTeamDifferential(input.teams, scenario.winnerSide);
  const confidenceText = editorial.pickConcept(confidenceConcept(input.summary.s24Confianza));
  const riskText = editorial.pickConcept(riskConcept(input.summary.s24Riesgo));

  const title = editorial.pickTemplate(titleTemplateByScenario(scenario.key), {
    team: scenario.winnerTeamName,
    rival: scenario.loserTeamName,
    deporte: sportContext.duel,
  });

  const strengthsSummary = editorial.pickTemplate('strengthsSummary', {
    team: scenario.winnerTeamName,
    rival: scenario.loserTeamName,
    factorA: strongestNames[0] ?? 'el rendimiento reciente',
    factorB: strongestNames[1] ?? 'la estructura competitiva',
    deporte: sportContext.duel,
  });

  const risksSummary = editorial.pickTemplate('riskSummary', {
    team: scenario.winnerTeamName,
    rival: scenario.loserTeamName,
    factorA: weakestNames[0] ?? 'la gestion del riesgo',
    factorB: weakestNames[1] ?? 'la carga contextual',
    deporte: sportContext.duel,
  });

  const factorsSummary = editorial.pickTemplate('factorsSummary', { deporte: sportContext.duel });
  const marketRead = scenario.key === 'uncertain'
    ? 'No hay una señal suficientemente estable para sostener una selección directa.'
    : scenario.key === 'favorable'
      ? `${scenario.winnerTeamName} es la señal principal del modelo, con una diferencia de ${scenario.indexGap.toFixed(1)} puntos S24.`
      : `${scenario.winnerTeamName} tiene una ventaja leve; cualquier opción protegida debe contrastarse con la cuota disponible.`;

  const sectionEstado = buildSection('estado-competitivo', sectionTitles.estadoCompetitivo, [
    createParagraph(
      'estado-1',
      `${input.match.homeTeam} recibe a ${input.match.awayTeam} en ${input.match.competition}. ${scenario.key === 'uncertain' ? 'La previa es abierta y no hay un favorito sólido.' : `${scenario.winnerTeamName} parte mejor ubicado en la estimación S24.`}`,
      ['indicadores', 'rating', 'tendencia'],
    ),
    createParagraph(
      'estado-2',
      `El S24 Index de referencia es ${input.summary.s24Index}: rating ${input.summary.s24Rating}, confianza ${input.summary.s24Confianza}, riesgo ${input.summary.s24Riesgo} y tendencia ${input.summary.s24Tendencia}.`,
      ['indicadores', 'confianza', 'riesgo'],
    ),
  ]);

  const sectionFortalezas = buildSection('fortalezas', sectionTitles.fortalezas, [
    createParagraph(
      'fortalezas-1',
      `${scenario.winnerTeamName} toma ventaja principalmente por ${formatList(strongestNames.slice(0, 2)) || 'un mejor balance de señales'}. ${strengthsSummary}`,
      ['factores', 'contribuciones'],
    ),
    createParagraph(
      'fortalezas-2',
      `En términos de juego, el modelo prioriza ${sportContext.tacticalFocus}. Es una inclinación previa, no una predicción cerrada.`,
      ['factores', 'indicadores'],
    ),
  ]);

  const sectionRiesgos = buildSection('riesgos', sectionTitles.riesgos, [
    createParagraph(
      'riesgos-1',
      `${risksSummary} El punto de mayor cautela está en ${formatList(weakestNames) || 'la variabilidad del partido'}.`,
      ['riesgo', 'factores'],
    ),
    createParagraph(
      'riesgos-2',
      `Alineaciones, una expulsión, el ritmo inicial y cualquier movimiento relevante de cuota pueden cambiar la lectura antes del inicio.`,
      ['confianza', 'riesgo', 'contexto'],
    ),
  ]);

  const sectionContexto = buildSection('contexto', sectionTitles.contexto, [
    createParagraph(
      'contexto-1',
      `El ${sportContext.duel} está programado para ${input.match.time}, con estado ${input.match.status}. La localía se considera una señal contextual, no una garantía.`,
      ['contexto', 'datos'],
    ),
    createParagraph(
      'contexto-2',
      `Contexto disponible: ${input.insight.texto}`,
      ['insight', 'evidencias'],
    ),
  ]);

  const sectionFactores = buildSection('factores-explicativos', sectionTitles.factores, [
    createParagraph(
      'factores-1',
      `Señal del modelo: ${marketRead}`,
      ['factores', 'ponderaciones'],
    ),
    createParagraph(
      'factores-2',
      `El modelo no publica líneas de goles ni cuotas propias sin cobertura suficiente de estadísticas ofensivas, defensivas y de mercado.`,
      ['factores', 'metodologia'],
    ),
  ]);

  const sectionConclusion = buildSection('conclusion-metodologica', sectionTitles.conclusion, [
    createParagraph(
      'conclusion-1',
      `Conclusión S24: ${input.veredicto.texto}`,
      ['veredicto', 'riesgo', 'confianza'],
    ),
    createParagraph(
      'conclusion-2',
      `La lectura sirve para comparar escenarios. Antes de cualquier decisión, confirma los datos finales y evalúa si la cuota disponible justifica el riesgo.`,
      ['metodologia', 'evidencias', 'pasaporte'],
    ),
  ]);

  const sections = [
    sectionEstado,
    sectionFortalezas,
    sectionRiesgos,
    sectionContexto,
    sectionFactores,
    sectionConclusion,
  ];

  const executiveBase = [
    `${input.match.homeTeam} vs ${input.match.awayTeam}: ${marketRead}`,
    `El modelo trabaja con S24 Index ${input.summary.s24Index}, confianza ${input.summary.s24Confianza} y riesgo ${input.summary.s24Riesgo}.`,
    `La ventaja estimada se apoya en ${formatList(strongestNames.slice(0, 2)) || 'el balance general de señales'}.`,
    `La principal cautela es ${formatList(weakestNames) || 'la variabilidad del escenario'}.`,
    `Contexto disponible: ${input.insight.texto}`,
  ].join(' ');

  const executiveSummary = ensureWordRange(
    executiveBase,
    targets.executiveMin,
    targets.executiveMax,
    fillerSentences.executive,
  );

  const fullAnalysisBase = sections.map((section) => sectionText(section)).join('\n\n');
  const fullAnalysis = ensureWordRange(
    fullAnalysisBase,
    targets.fullMin,
    targets.fullMax,
    fillerSentences.full,
  );

  const finalFactorsSummary = `${marketRead} ${strengthsSummary} ${risksSummary}`;

  const evidenceLinks = sections.flatMap((section) =>
    section.paragraphs.map((paragraph) => ({
      paragraphId: paragraph.id,
      evidenceRefs: paragraph.evidenceRefs,
    })),
  );

  return {
    level,
    mode: 'rules-template',
    aiReady: {
      provider: 'none',
      replaceable: true,
      notes: 'Arquitectura preparada para reemplazar este generador por IA sin cambios en la interfaz de consumo.',
    },
    editorialTitle: title,
    executiveSummary,
    fullAnalysis,
    factorsSummary: finalFactorsSummary,
    sections,
    evidenceLinks,
    insightIntegratedText: input.insight.texto,
    verdictIntegratedText: input.veredicto.texto,
    stats: {
      executiveWords: countWords(executiveSummary),
      fullAnalysisWords: countWords(fullAnalysis),
    },
  };
}

export function generateS24NarrativeFromProfile(
  profile: IntelligenceProfile,
  options: S24NarrativeGenerationOptions = {},
): S24NarrativeOutput {
  return generateS24Narrative(toNarrativeInputFromProfile(profile), options);
}
