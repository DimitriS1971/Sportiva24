import type { BuildPostMatchReportOptions, PostMatchReport, PostMatchSection } from '@/lib/intelligence-s24/post-match/postMatchTypes';

function sentence(input: string): string {
  const clean = input.trim();
  if (!clean) return '';
  if (/[.!?]$/.test(clean)) return clean;
  return `${clean}.`;
}

function join(parts: string[]): string {
  return parts.map((part) => sentence(part)).filter(Boolean).join(' ');
}

function buildSection(
  key: PostMatchSection['key'],
  title: string,
  content: string,
): PostMatchSection {
  return {
    key,
    title,
    content: sentence(content),
  };
}

function hasRealOutcome(report: BuildPostMatchReportOptions): boolean {
  return report.record.comparison.status === 'available' && Boolean(report.record.comparison.realOutcome);
}

export function buildPostMatchReport(options: BuildPostMatchReportOptions): PostMatchReport {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const { record } = options;
  const real = record.comparison.realOutcome;
  const ready = hasRealOutcome(options);

  const verdictAccuracy = options.validationSample?.verdictAccurate
    ? 1
    : options.validationSample?.hasRealOutcome
      ? 0
      : null;

  const sections: PostMatchSection[] = [];

  sections.push(
    buildSection(
      'que-ocurrio',
      'Que ocurrio',
      ready && real
        ? join([
          `${record.match.homeTeam} vs ${record.match.awayTeam} finalizo con resultado reportado como ${real.scoreLabel ?? 'sin marcador detallado'}`,
          `El ganador registrado fue ${real.winner}`,
          real.realPerformance?.summary ?? real.notes ?? 'El cierre competitivo se documento para comparacion con el informe previo',
        ])
        : 'El resultado real aun no fue cargado en la memoria historica del motor, por lo que este bloque queda pendiente',
    ),
  );

  sections.push(
    buildSection(
      'aciertos-del-motor',
      'Que acerto el Motor',
      ready && real
        ? join([
          `El veredicto previo apuntaba a ${record.comparison.expectedWinner} y el resultado final fue ${real.winner}`,
          `La precision de veredicto se registro en ${verdictAccuracy === null ? 'N/D' : `${Math.round(verdictAccuracy * 100)}%`}`,
          `La precision de indice se ubico en ${typeof options.validationSample?.indexPrecision === 'number' ? `${Math.round(options.validationSample.indexPrecision * 100)}%` : 'N/D'}`,
          `Insight y narrativa se evaluaron en ${typeof options.validationSample?.insightPrecision === 'number' ? `${Math.round(options.validationSample.insightPrecision * 100)}%` : 'N/D'} y ${typeof options.validationSample?.narrativePrecision === 'number' ? `${Math.round(options.validationSample.narrativePrecision * 100)}%` : 'N/D'} respectivamente`,
        ])
        : 'Sin resultado real no es posible medir aciertos del motor en esta evaluacion',
    ),
  );

  const changedFactors = real?.changedFactors ?? [];
  sections.push(
    buildSection(
      'factores-que-cambiaron',
      'Que factores cambiaron',
      changedFactors.length > 0
        ? join([
          `Se registraron ${changedFactors.length} factores con cambio relevante frente al escenario pre partido`,
          changedFactors
            .map((factor) => `${factor.title} (${factor.direction})${factor.note ? `: ${factor.note}` : ''}`)
            .join('; '),
        ])
        : 'No se registraron factores cambiados de manera explicita; se recomienda completar changedFactors en registerRealOutcome para enriquecer el analisis post partido',
    ),
  );

  sections.push(
    buildSection(
      'rendimiento-real',
      'Rendimiento real',
      ready && real
        ? join([
          real.realPerformance?.summary
            ?? `El rendimiento final se documento con marcador ${real.scoreLabel ?? 'N/D'}`,
          typeof real.s24IndexReal === 'number'
            ? `El indice real de referencia cargado fue ${real.s24IndexReal}`
            : 'No se cargo un S24 Index real para esta evaluacion',
        ])
        : 'El rendimiento real aun no fue incorporado al registro historico',
    ),
  );

  sections.push(
    buildSection(
      'comparacion-previa',
      'Comparacion con el informe previo',
      join([
        `El informe pre partido estimaba ganador ${record.comparison.expectedWinner} con S24 Index ${record.comparison.expectedIndex}`,
        `La confianza esperada era ${record.comparison.expectedConfidence} y el riesgo esperado ${record.comparison.expectedRisk}`,
        ready && real
          ? `Tras el cierre, el ganador real fue ${real.winner} con marcador ${real.scoreLabel ?? 'N/D'}`
          : 'La comparacion final queda pendiente hasta registrar el resultado real',
      ]),
    ),
  );

  sections.push(
    buildSection(
      'explicacion-de-diferencias',
      'Explicacion de diferencias',
      ready && real
        ? join([
          changedFactors.length > 0
            ? 'Las diferencias se explican principalmente por cambios en factores de contexto, disponibilidad o carga competitiva registrados en post partido'
            : 'Las diferencias observadas no cuentan aun con factores actualizados, por lo que la explicacion se mantiene a nivel de veredicto e indice',
          `Insight pre partido: ${record.insightGenerated.text}`,
          `Veredicto pre partido: ${record.verdict.text}`,
        ])
        : 'Sin datos de resultado real y factores posteriores no es posible emitir una explicacion concluyente',
    ),
  );

  return {
    type: 'POST_PARTIDO',
    generatedAt,
    evaluationId: record.id,
    status: ready ? 'ready' : 'pending-real-outcome',
    preMatchSnapshot: {
      createdAt: record.createdAt,
      matchSlug: record.match.slug,
      competition: record.match.competition,
      homeTeam: record.match.homeTeam,
      awayTeam: record.match.awayTeam,
      expectedWinner: record.comparison.expectedWinner,
      expectedIndex: record.comparison.expectedIndex,
      expectedConfidence: record.comparison.expectedConfidence,
      expectedRisk: record.comparison.expectedRisk,
      insight: record.insightGenerated.text,
      verdict: record.verdict.text,
      narrativeTitle: record.narrativeUsed.title,
    },
    realOutcome: {
      recordedAt: real?.recordedAt ?? null,
      winner: real?.winner ?? null,
      scoreLabel: real?.scoreLabel ?? null,
      summary: real?.realPerformance?.summary ?? real?.notes ?? null,
    },
    sections,
    metrics: {
      verdictAccuracy,
      indexPrecision: options.validationSample?.indexPrecision ?? null,
      insightPrecision: options.validationSample?.insightPrecision ?? null,
      narrativePrecision: options.validationSample?.narrativePrecision ?? null,
    },
  };
}
