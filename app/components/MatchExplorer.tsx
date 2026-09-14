'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { IntelligenceMatch } from '@/lib/domain/intelligenceCenter';
import { displayLabel } from '@/app/lib/displayLabel';
import { getTeamCrest } from '@/app/lib/teamCrests';
import LocalizedMatchTime from './LocalizedMatchTime';

const countryByCompetition: Array<{ country: string; pattern: RegExp }> = [
  { country: 'Argentina', pattern: /argentina|primera division/i },
  { country: 'Brasil', pattern: /brasileirao|brasil/i },
  { country: 'España', pattern: /la ?liga|copa del rey|españa/i },
  { country: 'Inglaterra', pattern: /premier league|fa cup|inglaterra/i },
  { country: 'Italia', pattern: /serie a|italia/i },
  { country: 'Alemania', pattern: /bundesliga|alemania/i },
  { country: 'Francia', pattern: /ligue 1|francia/i },
  { country: 'Portugal', pattern: /primeira liga|portugal/i },
  { country: 'Estados Unidos', pattern: /mls|usa|united states/i },
];

function getMatchCountry(match: IntelligenceMatch): string {
  if (match.country) {
    return match.country;
  }

  const { competition } = match;
  return countryByCompetition.find(({ pattern }) => pattern.test(competition))?.country ?? 'Internacional';
}

export default function MatchExplorer({ matches }: { matches: IntelligenceMatch[] }) {
  const [country, setCountry] = useState('Todos los países');
  const countries = ['Todos los países', ...Array.from(new Set(matches.map(getMatchCountry))).sort()];
  const visibleMatches = matches.filter((match) => country === 'Todos los países' || getMatchCountry(match) === country);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <label className="text-sm font-semibold text-gray-300" htmlFor="match-country">Filtrar por país</label>
        <select
          id="match-country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          className="h-11 w-full rounded-lg border border-blue-500/50 bg-slate-950 px-3 text-sm font-semibold text-blue-200 outline-none transition-colors focus:border-blue-400 sm:w-56"
        >
          {countries.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>

      {visibleMatches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleMatches.map((match) => {
            const statusColor = match.status === 'EN VIVO'
              ? 'text-green-300 border-green-500/35 bg-green-500/10'
              : 'text-gray-300 border-gray-700/60 bg-gray-800/40';
            const hasScore = match.status !== 'PROXIMO' && match.homeScore !== undefined && match.awayScore !== undefined;
            const matchClock = match.status === 'EN VIVO' && match.elapsedMinutes !== undefined
              ? `${match.elapsedMinutes}'`
              : match.status === 'FINALIZADO'
                ? `Final${match.elapsedMinutes ? ` · ${match.elapsedMinutes}'` : ''}`
                : match.status;

            return (
              <article key={match.slug} className="rounded-2xl border border-gray-800/75 bg-gradient-to-br from-gray-950/90 via-gray-950/80 to-black p-5 md:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-[11px] text-gray-500">{displayLabel(match.competition)}</p>
                    {match.sourceLabel ? <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-sky-300">{match.sourceTier === 'paid' ? 'Fuente API' : 'Fuente gratis'}</span> : null}
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusColor}`}>{matchClock}</span>
                </div>

                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex flex-1 flex-col items-center">
                    <Image src={getTeamCrest(match.team1, match.team1Logo)} alt={`Escudo de ${match.team1}`} width={64} height={64} className="h-16 w-16 object-contain" />
                    <p className="mt-2 text-center text-sm font-semibold text-white">{match.team1}</p>
                  </div>
                  <span className="text-lg font-bold text-blue-200">{hasScore ? `${match.homeScore} - ${match.awayScore}` : 'VS'}</span>
                  <div className="flex flex-1 flex-col items-center">
                    <Image src={getTeamCrest(match.team2, match.team2Logo)} alt={`Escudo de ${match.team2}`} width={64} height={64} className="h-16 w-16 object-contain" />
                    <p className="mt-2 text-center text-sm font-semibold text-white">{match.team2}</p>
                  </div>
                </div>

                <div className="mb-5 grid grid-cols-3 gap-3 rounded-xl border border-gray-800/70 bg-gray-900/45 p-3">
                  <div className="text-center"><p className="text-[11px] text-gray-500">S24</p><p className="text-xl font-bold text-blue-300">{match.s24Index}</p></div>
                  <div className="text-center"><p className="text-[11px] text-gray-500">Confianza</p><p className="text-sm font-semibold text-emerald-300">{match.confidence}</p></div>
                  <div className="text-center"><p className="text-[11px] text-gray-500">Prob.</p><p className="text-xl font-bold text-orange-300">{match.probability}%</p></div>
                </div>

                <p className="mb-4 text-xs text-gray-500"><LocalizedMatchTime dateTimeUtc={match.dateTimeUtc} fallback={match.time} /></p>
                <Link href={`/match/${match.slug}`} className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-blue-400">Ver análisis completo</Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">No hay partidos confiables para mostrar con este filtro.</div>
      )}
    </div>
  );
}