'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { IntelligenceMatch } from '@/lib/domain/intelligenceCenter';
import { sortMatchesByImportance } from '@/app/lib/footballMatchPriority';
import MatchCardNew from './MatchCardNew';

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

const matchStatusFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'FINALIZADO', label: 'Finalizados' },
  { value: 'EN VIVO', label: 'En juego' },
  { value: 'PROXIMO', label: 'Próximos juegos' },
  { value: 'ESPECIALES', label: 'Estados especiales' },
] as const;

const liveStatuses = new Set(['EN VIVO', 'ENTRETIEMPO', 'PRÓRROGA', 'DESCANSO', 'PENALES']);
const upcomingStatuses = new Set(['PROXIMO', 'PRÓXIMO', 'POSTERGADO', 'RETRASADO']);
const finishedStatuses = new Set(['FINALIZADO', 'DESPUÉS DE PRÓRROGA', 'ADJUDICADO']);
const specialStatuses = new Set(['POSTERGADO', 'CANCELADO', 'SUSPENDIDO', 'ABANDONADO', 'ADJUDICADO', 'DESPUÉS DE PRÓRROGA', 'RETRASADO']);

function matchesStatusFilter(match: IntelligenceMatch, filter: (typeof matchStatusFilters)[number]['value']): boolean {
  if (filter === 'all') return true;
  if (filter === 'ESPECIALES') return specialStatuses.has(match.status);
  if (filter === 'EN VIVO') return liveStatuses.has(match.status);
  return match.status === filter;
}

function statusGroup(status: string): 'live' | 'upcoming' | 'finished' | 'special' {
  if (liveStatuses.has(status)) return 'live';
  if (upcomingStatuses.has(status)) return 'upcoming';
  if (finishedStatuses.has(status)) return 'finished';
  return 'special';
}

function sortUpcomingMatchesByKickoff(matches: IntelligenceMatch[]): IntelligenceMatch[] {
  return [...matches].sort((first, second) => {
    const firstTime = first.dateTimeUtc ? new Date(first.dateTimeUtc).getTime() : Number.MAX_SAFE_INTEGER;
    const secondTime = second.dateTimeUtc ? new Date(second.dateTimeUtc).getTime() : Number.MAX_SAFE_INTEGER;
    return firstTime - secondTime;
  });
}

export default function MatchExplorer({ matches }: { matches: IntelligenceMatch[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<(typeof matchStatusFilters)[number]['value']>('all');
  const [country, setCountry] = useState('Todos los países');
  const [dateFilter, setDateFilter] = useState('Todas las fechas');
  const [competition, setCompetition] = useState('Todas las competiciones');
  const [teamQuery, setTeamQuery] = useState('');
  const [finishedLimit, setFinishedLimit] = useState(30);
  const countries = ['Todos los países', ...Array.from(new Set(matches.map(getMatchCountry))).sort()];
  const dates = ['Todas las fechas', ...Array.from(new Set(matches.map((match) => match.dateTimeUtc?.slice(0, 10)).filter(Boolean))).sort()];
  const competitions = ['Todas las competiciones', ...Array.from(new Set(matches.map((match) => match.competition))).sort()];
  const normalizedTeamQuery = teamQuery.trim().toLowerCase();
  const filteredMatches = matches
    .filter((match) => matchesStatusFilter(match, statusFilter))
    .filter((match) => country === 'Todos los países' || getMatchCountry(match) === country)
    .filter((match) => dateFilter === 'Todas las fechas' || match.dateTimeUtc?.slice(0, 10) === dateFilter)
    .filter((match) => competition === 'Todas las competiciones' || match.competition === competition)
    .filter((match) => {
      if (!normalizedTeamQuery) return true;
      return [match.team1, match.team2].some((team) => team.toLowerCase().includes(normalizedTeamQuery));
    });
  const visibleMatches = [
    ...sortMatchesByImportance(filteredMatches.filter((match) => statusGroup(match.status) === 'live')).slice(0, 20),
    ...sortUpcomingMatchesByKickoff(filteredMatches.filter((match) => statusGroup(match.status) === 'upcoming')).slice(0, 30),
    ...sortMatchesByImportance(filteredMatches.filter((match) => statusGroup(match.status) === 'finished')).slice(0, finishedLimit),
    ...sortMatchesByImportance(filteredMatches.filter((match) => statusGroup(match.status) === 'special')),
  ];

  const finishedMatchesCount = filteredMatches.filter((match) => statusGroup(match.status) === 'finished').length;

  useEffect(() => {
    const refreshInterval = window.setInterval(() => router.refresh(), 30_000);
    return () => window.clearInterval(refreshInterval);
  }, [router]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-col items-start gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:w-64">
          <label className="mb-2 block text-sm font-semibold text-gray-300" htmlFor="match-team-search">Equipo</label>
          <input
            id="match-team-search"
            type="text"
            value={teamQuery}
            onChange={(event) => setTeamQuery(event.target.value)}
            placeholder="Buscar equipo"
            className="h-11 w-full rounded-lg border border-blue-500/50 bg-slate-950 px-3 text-sm font-medium text-white placeholder:text-slate-400 outline-none transition-colors focus:border-blue-400"
          />
        </div>
        <div className="w-full sm:w-52">
          <label className="mb-2 block text-sm font-semibold text-gray-300" htmlFor="match-status">Estado</label>
          <select
            id="match-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as (typeof matchStatusFilters)[number]['value'])}
            className="h-11 w-full rounded-lg border border-blue-500/50 bg-slate-950 px-3 text-sm font-semibold text-blue-200 outline-none transition-colors focus:border-blue-400"
          >
            {matchStatusFilters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}
          </select>
        </div>
        <div className="w-full sm:w-56">
          <label className="mb-2 block text-sm font-semibold text-gray-300" htmlFor="match-country">País</label>
          <select
            id="match-country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="h-11 w-full rounded-lg border border-blue-500/50 bg-slate-950 px-3 text-sm font-semibold text-blue-200 outline-none transition-colors focus:border-blue-400"
          >
            {countries.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="w-full sm:w-52">
          <label className="mb-2 block text-sm font-semibold text-gray-300" htmlFor="match-date">Fecha</label>
          <select
            id="match-date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="h-11 w-full rounded-lg border border-blue-500/50 bg-slate-950 px-3 text-sm font-semibold text-blue-200 outline-none transition-colors focus:border-blue-400"
          >
            {dates.map((option) => <option key={option} value={option}>{option === 'Todas las fechas' ? option : new Date(`${option}T12:00:00`).toLocaleDateString('es-ES')}</option>)}
          </select>
        </div>
        <div className="w-full sm:w-60">
          <label className="mb-2 block text-sm font-semibold text-gray-300" htmlFor="match-competition">Competición</label>
          <select
            id="match-competition"
            value={competition}
            onChange={(event) => setCompetition(event.target.value)}
            className="h-11 w-full rounded-lg border border-blue-500/50 bg-slate-950 px-3 text-sm font-semibold text-blue-200 outline-none transition-colors focus:border-blue-400"
          >
            {competitions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>

      {visibleMatches.length > 0 ? (
        <>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleMatches.map((match, index) => {
            const group = statusGroup(match.status);
            const previousGroup = visibleMatches[index - 1] ? statusGroup(visibleMatches[index - 1].status) : undefined;
            const sectionTitle = group === 'live'
              ? 'En vivo'
              : group === 'upcoming'
                ? 'Próximos partidos'
                : group === 'finished' ? 'Partidos finalizados' : 'Estados especiales';

            return (
              <div key={match.slug} className="contents">
                {previousGroup !== group ? (
                  <div className="col-span-full mt-4 flex items-center justify-between border-b border-slate-800 pb-3 first:mt-0">
                    <h2 className="text-2xl font-semibold text-white">{sectionTitle}</h2>
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{match.status === 'EN VIVO' ? 'Prioridad en tiempo real' : 'Por importancia'}</span>
                  </div>
                ) : null}
                <MatchCardNew
                  competition={match.competition}
                  time={match.time}
                  status={match.status === 'PROXIMO' ? 'PRÓXIMO' : match.status}
                  dateTimeUtc={match.dateTimeUtc}
                  team1={match.team1}
                  team1Logo={match.team1Logo}
                  team2={match.team2}
                  team2Logo={match.team2Logo}
                  s24Index={match.s24Index}
                  confidence={match.confidence}
                  probability={match.probability}
                  slug={match.slug}
                  href={`/match/${match.slug}`}
                  sourceLabel={match.sourceLabel}
                  sourceTier={match.sourceTier}
                  homeScore={match.homeScore}
                  awayScore={match.awayScore}
                  elapsedMinutes={match.elapsedMinutes}
                />
              </div>
            );
          })}
        </div>
        {finishedMatchesCount > finishedLimit && (statusFilter === 'all' || statusFilter === 'FINALIZADO') ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setFinishedLimit((current) => current + 30)}
              className="rounded-xl border border-blue-500/50 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-200 transition-colors hover:border-blue-400 hover:bg-blue-500/20"
            >
              Cargar más finalizados ({finishedMatchesCount - finishedLimit} restantes)
            </button>
          </div>
        ) : null}
        </>
      ) : (
        <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
          {teamQuery.trim()
            ? `No hay partidos para “${teamQuery.trim()}” con los filtros actuales.`
            : 'No hay partidos confiables para mostrar con este filtro.'}
        </div>
      )}
    </div>
  );
}