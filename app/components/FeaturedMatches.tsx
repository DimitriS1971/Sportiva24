'use client';

import { useState } from 'react';
import Link from 'next/link';

import EditorialMatchCard from './EditorialMatchCard';
import type { IntelligenceMatch } from '@/lib/domain/intelligenceCenter';

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

export default function FeaturedMatches({ matches }: { matches: IntelligenceMatch[] }) {
  const [country, setCountry] = useState('Todos los países');
  const countries = ['Todos los países', ...Array.from(new Set(matches.map(getMatchCountry))).sort()];
  const visibleMatches = matches
    .filter((match) => country === 'Todos los países' || getMatchCountry(match) === country)
    .slice(0, 6);

  return (
    <>
      <div className="mb-7 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="featured-country">Filtrar partidos por país</label>
        <select
          id="featured-country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          className="h-11 w-full rounded-lg border border-blue-500/50 bg-slate-950 px-3 text-sm font-semibold text-blue-200 outline-none transition-colors focus:border-blue-400 sm:w-52"
        >
          {countries.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <Link href="/match" className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-blue-500/50 px-5 text-sm font-semibold text-blue-300 transition-colors hover:bg-blue-500/10 sm:w-auto">
          Ver todos
        </Link>
      </div>

      {visibleMatches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleMatches.map((match) => (
            <EditorialMatchCard
              key={match.slug}
              competition={match.competition}
              time={match.time}
              status={match.status === 'PROXIMO' ? 'PRÓXIMO' : 'EN VIVO'}
              homeTeam={match.team1}
              homeCrestUrl={match.team1Logo}
              awayTeam={match.team2}
              awayCrestUrl={match.team2Logo}
              slug={match.slug}
              href={match.href}
              sourceLabel={match.sourceLabel}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
          No hay partidos confiables para mostrar con este filtro.
        </div>
      )}
    </>
  );
}