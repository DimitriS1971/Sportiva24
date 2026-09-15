'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

interface FeaturedMatchesProps {
  featuredMatches: IntelligenceMatch[];
  activeMatches: IntelligenceMatch[];
}

export default function FeaturedMatches({ featuredMatches, activeMatches }: FeaturedMatchesProps) {
  const router = useRouter();
  const [country, setCountry] = useState('Todos los países');
  const matches = [...featuredMatches, ...activeMatches];
  const countries = ['Todos los países', ...Array.from(new Set(matches.map(getMatchCountry))).sort()];
  const visibleFeaturedMatches = featuredMatches
    .filter((match) => country === 'Todos los países' || getMatchCountry(match) === country)
    .slice(0, 3);
  const visibleActiveMatches = activeMatches
    .filter((match) => country === 'Todos los países' || getMatchCountry(match) === country)
    .slice(0, 3);

  useEffect(() => {
    const refreshInterval = window.setInterval(() => router.refresh(), 30_000);
    return () => window.clearInterval(refreshInterval);
  }, [router]);

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

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">Destacados del día</h3>
          <span className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200">Top 3 por competición</span>
        </div>
        {visibleFeaturedMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleFeaturedMatches.map((match) => <FeaturedMatchCard key={match.slug} match={match} />)}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">No hay partidos destacados disponibles con este filtro.</p>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">En vivo</h3>
          <span className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200">Top 3 en juego</span>
        </div>
        {visibleActiveMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleActiveMatches.map((match) => <FeaturedMatchCard key={match.slug} match={match} />)}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">No hay partidos en vivo con este filtro.</p>
        )}
      </section>
    </>
  );
}

function FeaturedMatchCard({ match }: { match: IntelligenceMatch }) {
  return (
    <EditorialMatchCard
      competition={match.competition}
      time={match.time}
      dateTimeUtc={match.dateTimeUtc}
      status={match.status === 'PROXIMO' ? 'PRÓXIMO' : match.status}
      homeTeam={match.team1}
      homeCrestUrl={match.team1Logo}
      awayTeam={match.team2}
      awayCrestUrl={match.team2Logo}
      slug={match.slug}
      href={match.href}
      sourceLabel={match.sourceLabel}
      homeScore={match.homeScore}
      awayScore={match.awayScore}
      elapsedMinutes={match.elapsedMinutes}
    />
  );
}