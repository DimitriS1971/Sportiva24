'use client';

import { startTransition, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { mockMatch } from '@/app/data/mockMatch';
import type { RealMatchContext } from '@/lib/intelligence-s24/realMatchContext';

type Team = (typeof mockMatch.teams)[keyof typeof mockMatch.teams];
const teams = [mockMatch.teams.atletico, mockMatch.teams.real] as const;
const tabs = ['RESUMEN', 'ESTADÍSTICAS', 'ALINEACIONES', 'TÁCTICA', 'H2H', 'TABLA', 'NOTICIAS'];
let activeRealContext: RealMatchContext | null = null;

interface ReferenceMatchDemoProps {
  realContext?: RealMatchContext | null;
}

function Crest({ team, compact = false }: { team: Team; compact?: boolean }) {
  return <div className={`ref-crest ${compact ? 'ref-crest-compact' : ''}`}><img src={team.crest} alt={`Escudo de ${team.name}`} /></div>;
}

function Countdown() {
  const [now, setNow] = useState(0);
  useEffect(() => { startTransition(() => setNow(Date.now())); const timer = window.setInterval(() => startTransition(() => setNow(Date.now())), 1000); return () => window.clearInterval(timer); }, []);
  const seconds = Math.max(0, Math.floor((new Date(mockMatch.kickoff).getTime() - now) / 1000));
  const values = now === 0 ? ['--', '--', '--', '--'] : [Math.floor(seconds / 86400), Math.floor((seconds % 86400) / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map((value) => String(value).padStart(2, '0'));
  return <div className="ref-countdown">{['DÍAS', 'HORAS', 'MIN', 'SEG'].map((label, index) => <div key={label}><strong>{values[index]}</strong><span>{label}</span></div>)}</div>;
}

function Section({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return <section className={`ref-section ${className}`}><div className="ref-section-title"><h2>{title}</h2><span /></div>{children}</section>;
}

function FormCard({ team, matches }: { team: Team; matches?: RealMatchContext['recentForm']['home'] }) {
  const realMatches = matches ?? (team.shortName === 'ATL' ? activeRealContext?.recentForm.home : activeRealContext?.recentForm.away);
  const displayMatches = realMatches?.length ? realMatches.slice(0, 5).map((match) => ({ opponent: match.opponent, result: match.result === 'V' ? 'W' : match.result === 'D' ? 'L' : 'D' as const, score: match.score, competition: 'API-Football' })) : team.recentMatches;
  return <article className="ref-form-card"><div className="ref-card-heading"><Crest team={team} compact /><strong>{team.name}</strong><small>Últimos 5 partidos · API-Football</small></div><div className="ref-form-list">{displayMatches.map((match) => <div key={`${team.name}-${match.opponent}`}><span className={`ref-result ${match.result}`}>{match.result === 'W' ? 'V' : match.result === 'L' ? 'D' : 'E'}</span><b>{match.score}</b><span>{match.opponent}</span><small>{match.competition}</small></div>)}</div></article>;
}

function StatTable() {
  const rows: Array<[string, string | number, string | number]> = [['Partidos', 6, 6], ['Victorias', 4, 5], ['Empates', 1, 0], ['Derrotas', 1, 1], ['Goles a favor', 14, 16], ['Goles en contra', 8, 5], ['Diferencia de goles', '+6', '+11'], ['Posesión media', '51%', '58%'], ['Tiros por partido', 13.2, 15.4], ['Tiros al arco', 5.1, 6.3], ['Corners', 4.8, 6.3], ['Tarjetas', 1.7, 1.4]];
  const standings = activeRealContext?.standings ?? [];
  const homeStanding = standings.find((standing) => /atletico/i.test(standing.teamName));
  const awayStanding = standings.find((standing) => /real madrid/i.test(standing.teamName));
  const visibleRows = homeStanding && awayStanding ? [['Posición', homeStanding.position, awayStanding.position], ['Puntos', homeStanding.points ?? 'Sin datos', awayStanding.points ?? 'Sin datos'], ['Partidos', homeStanding.played ?? 'Sin datos', awayStanding.played ?? 'Sin datos']] as Array<[string, string | number, string | number]> : rows;
  return <div className="ref-stat-table"><div className="ref-stat-head"><b>Atlético</b><span>Estadística</span><b>Real Madrid</b></div>{visibleRows.map(([label, home, away]) => <div className="ref-stat-row" key={label}><strong>{home}</strong><span>{label}</span><strong>{away}</strong></div>)}</div>;
}

function MetricCard({ title, background, rows }: { title: string; background: string; rows: Array<[string, string, string]> }) {
  return <article className="ref-metric-card" style={{ backgroundImage: `linear-gradient(90deg,rgba(4,17,29,.94),rgba(4,17,29,.48)),url('${background}')` }}><h2>{title}</h2>{rows.map(([label, home, away]) => <div key={label}><b>{home}</b><span>{label}</span><b>{away}</b></div>)}</article>;
}

function LineupCard({ team }: { team: Team }) {
  return <article className="ref-lineup"><div className="ref-lineup-head"><Crest team={team} compact /><div><strong>{team.name}</strong><small>{team.lineup.formation} · Alineación probable</small></div></div><div className="ref-pitch">{team.lineup.players.map((player) => <span key={player.name} style={{ left: `${100 - player.y}%`, top: `${player.x}%` }}><i>{player.number}</i>{player.name}</span>)}</div></article>;
}

export default function ReferenceMatchDemo({ realContext = null }: ReferenceMatchDemoProps) {
  // The compact reference layout keeps its data helpers outside the render body.
  // eslint-disable-next-line react-hooks/immutability
  // eslint-disable-next-line react-hooks/globals
  activeRealContext = realContext;
  useEffect(() => {
    if (!realContext) return;
    const heroDetails = document.querySelectorAll<HTMLElement>('.ref-hero > p');
    if (realContext.fixture.scheduledAt && heroDetails[0]) heroDetails[0].textContent = new Date(realContext.fixture.scheduledAt).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' });
    if (heroDetails[1]) heroDetails[1].textContent = realContext.fixture.venue ?? 'Estadio no informado';
    const h2hRows = document.querySelectorAll<HTMLElement>('.ref-h2h-list > div');
    realContext.headToHead.matches.slice(0, h2hRows.length).forEach((match, index) => {
      const cells = h2hRows[index]?.children;
      if (!cells || cells.length < 3) return;
      cells[0].textContent = match.date;
      cells[1].textContent = realContext.fixture.competition;
      cells[2].textContent = `${match.homeTeam} ${match.score} ${match.awayTeam}`;
    });
  }, [realContext]);
  return <main className="reference-match"><header className="ref-topbar"><Link href="/" className="ref-brand">SPORTIVA<span>24</span></Link><small>INTELIGENCIA DEPORTIVA</small><nav><Link href="/futbol">Fútbol</Link><Link href="/analisis">Análisis</Link><Link href="/centro-inteligencia-s24">Competencias</Link><Link href="/noticias">Noticias</Link><span>⌕</span></nav></header><div className="ref-wrap"><header className="ref-hero"><div className="ref-hero-meta"><b>LA LIGA · JORNADA 7</b><span>POR JUGAR</span></div><p>Domingo 20 de septiembre · 20:00 España</p><p>Riyadh Air Metropolitano, Madrid</p><div className="ref-teams"><div><Crest team={teams[0]} /><h1>ATLÉTICO DE MADRID</h1><b>4º · 13 pts</b></div><strong className="ref-vs">VS</strong><div><Crest team={teams[1]} /><h1>REAL MADRID</h1><b>2º · 15 pts</b></div></div><div className="ref-kickoff-label">EL PARTIDO COMIENZA EN</div><Countdown /></header><nav className="ref-tabs">{tabs.map((tab) => <a key={tab} href={`#${tab.toLowerCase()}`}>{tab}</a>)}</nav><div className="ref-grid-two" id="resumen"><article className="ref-model"><div><h2>MODELO SPORTIVA24</h2><p>Estimación basada en datos de rendimiento en LaLiga</p></div><div className="ref-probs"><strong>42%<small>ATLÉTICO</small></strong><strong>28%<small>EMPATE</small></strong><strong>30%<small>REAL MADRID</small></strong><div className="ref-ring"><b>78</b><small>/ 100</small></div></div><span className="ref-confidence">NIVEL DE CONFIANZA</span></article><article className="ref-key"><h2>LA CLAVE DEL DERBI</h2><p>Atlético llega con una sólida recuperación en sus últimos encuentros, mientras Real Madrid mantiene una dinámica positiva. La localía, la eficacia y el control de las transiciones pueden ser determinantes.</p><a href="#tactica">Ver análisis completo →</a></article></div><div className="ref-grid-two ref-form-stats"><Section title="FORMA RECIENTE"><div className="ref-form-grid"><FormCard team={teams[0]} /><FormCard team={teams[1]} /></div></Section><Section title="ESTADÍSTICAS CLAVE (LALIGA 2026)"><StatTable /></Section></div><div className="ref-grid-three" id="estadisticas"><MetricCard title="ATAQUE (LaLiga)" background="/hero/hero-football.png" rows={[['Goles por partido', '2.17', '2.50'], ['Tiros por partido', '13.2', '15.4'], ['Tiros al arco', '5.1', '6.3'], ['Grandes ocasiones', '2.8', '3.1'], ['Pases clave', '11.4', '13.6']]} /><MetricCard title="DEFENSA (LaLiga)" background="/hero/hero-main-crop.png" rows={[['Goles recibidos', '1.00', '0.83'], ['Tiros recibidos', '8.9', '7.8'], ['Tiros al arco recibidos', '3.4', '2.9'], ['Porterías a cero', '1.1', '4'], ['Errores que terminan en tiro', '1.1', '0.8']]} /><MetricCard title="DISCIPLINA (LaLiga)" background="/hero/hero-portada.png" rows={[['Tarjetas amarillas', '1.5', '1.2'], ['Tarjetas rojas', '0.2', '0.1'], ['Faltas cometidas', '11.8', '9.6'], ['Faltas recibidas', '11.1', '10.9']]} /></div><div className="ref-grid-lineups" id="alineaciones"><Section title="ALINEACIONES PROBABLES"><div className="ref-lineup-grid"><LineupCard team={teams[0]} /><LineupCard team={teams[1]} /></div></Section><Section title="ÚLTIMOS ENFRENTAMIENTOS" className="ref-h2h"><div className="ref-h2h-list">{mockMatch.h2h.slice(0, 5).map((row) => <div key={row.join('-')}><small>{row[0]}</small><span>{row[1]}</span><b>{row[2]} {row[3]} {row[4]}</b></div>)}</div><div className="ref-h2h-score"><b>2<small>Victorias Atlético</small></b><b>1<small>Empates</small></b><b>3<small>Victorias Real Madrid</small></b></div></Section></div><div className="ref-lower"><Section title="LECTURA SPORTIVA24"><p>{mockMatch.reading}</p></Section><Section title="POSIBLES ESCENARIOS"><div className="ref-scenarios">{mockMatch.scenarios.map((scenario) => <article key={scenario[0]}><b>{scenario[0]}</b><h3>{scenario[1]}</h3><p>{scenario[2]}</p></article>)}</div></Section></div></div></main>;
}
