'use client';

import { useState } from 'react';
import MatchCardNew from '@/app/components/MatchCardNew';
import type { IntelligenceMatch } from '@/lib/domain/intelligenceCenter';

export default function AnalysisMatchList({ matches }: { matches: IntelligenceMatch[] }) {
  const [country, setCountry] = useState('ALL');
  const countries = [...new Set(matches.map((match) => match.country).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b, 'es'));
  const filteredMatches = country === 'ALL'
    ? matches
    : matches.filter((match) => match.country === country);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">Filtrar análisis</p>
          <p className="mt-1 text-sm text-slate-400">Selecciona un país para ver solo sus partidos próximos.</p>
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <span className="sr-only">País</span>
          <select value={country} onChange={(event) => setCountry(event.target.value)} className="min-w-48 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400">
            <option value="ALL">Todos los países</option>
            {countries.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMatches.map((analysis) => (
            <MatchCardNew
              key={analysis.slug}
              competition={analysis.competition}
              time={analysis.time}
              dateTimeUtc={analysis.dateTimeUtc}
              status={analysis.status === 'PROXIMO' ? 'PRÓXIMO' : analysis.status}
              team1={analysis.team1}
              team1Logo={analysis.team1Logo}
              team2={analysis.team2}
              team2Logo={analysis.team2Logo}
              s24Index={analysis.s24Index}
              confidence={analysis.confidence}
              probability={analysis.probability}
              slug={analysis.slug}
              href={`/analisis/${analysis.slug}`}
              sourceLabel={analysis.sourceLabel}
              sourceTier={analysis.sourceTier}
              homeScore={analysis.homeScore}
              awayScore={analysis.awayScore}
              elapsedMinutes={analysis.elapsedMinutes}
            />
          ))}
        </div>
      ) : (
        <section className="rounded-2xl border border-gray-800 bg-gray-950/70 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">No hay partidos de ese país</h2>
          <p className="mt-2 text-gray-400">Prueba con otro país o vuelve a seleccionar todos.</p>
        </section>
      )}
    </>
  );
}
