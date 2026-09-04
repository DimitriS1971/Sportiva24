import ArbolEvidenciasS24 from '@/app/components/ArbolEvidenciasS24';
import ContextoRealPartidoS24 from '@/app/components/ContextoRealPartidoS24';
import FactoresS24 from '@/app/components/FactoresS24';
import InsightS24 from '@/app/components/InsightS24';
import NarrativaEditorialS24 from '@/app/components/NarrativaEditorialS24';
import PasaporteAnaliticoS24 from '@/app/components/PasaporteAnaliticoS24';
import VeredictoS24 from '@/app/components/VeredictoS24';
import type { InformeS24V1, InformeS24TeamIndicators } from '@/lib/intelligence-s24/informeS24V1';

interface InformeS24Props {
  informe: InformeS24V1;
}

function getIndexTone(score: number) {
  if (score >= 90) {
    return {
      ring: '#34d399',
      glow: 'shadow-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
      description: 'Nivel competitivo de elite en el escenario evaluado.',
    };
  }

  if (score >= 80) {
    return {
      ring: '#22d3ee',
      glow: 'shadow-cyan-500/30',
      badge: 'bg-cyan-500/20 text-cyan-100 border-cyan-400/40',
      description: 'Rendimiento alto y estable para competir con ventaja.',
    };
  }

  if (score >= 70) {
    return {
      ring: '#fbbf24',
      glow: 'shadow-amber-500/30',
      badge: 'bg-amber-500/20 text-amber-100 border-amber-400/40',
      description: 'Nivel competitivo aceptable con zonas a consolidar.',
    };
  }

  return {
    ring: '#fb7185',
    glow: 'shadow-rose-500/30',
    badge: 'bg-rose-500/20 text-rose-100 border-rose-400/40',
    description: 'Escenario inestable con margen alto de mejora competitiva.',
  };
}

function getRiskTone(risk: string): string {
  if (risk === 'Bajo') return 'text-emerald-200';
  if (risk === 'Medio') return 'text-amber-200';
  return 'text-rose-200';
}

function getTrendTone(trend: string): string {
  if (trend.includes('Positiva')) return 'text-cyan-200';
  if (trend === 'Estable') return 'text-slate-200';
  return 'text-rose-200';
}

function getConfidenceTone(confidence: string): string {
  if (confidence.includes('Alta')) return 'text-emerald-200';
  if (confidence === 'Media') return 'text-amber-200';
  return 'text-rose-200';
}

function buildRingStyle(score: number, ringColor: string) {
  const value = Math.max(0, Math.min(100, score));
  const end = value * 3.6;

  return {
    background: `conic-gradient(${ringColor} 0deg ${end}deg, rgba(148,163,184,0.16) ${end}deg 360deg)`,
  };
}

function TeamComparison({ team }: { team: InformeS24TeamIndicators }) {
  return (
    <article className="premium-card-enter rounded-2xl border border-slate-700/45 bg-slate-900/45 p-4 md:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-500/65">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] uppercase tracking-[0.17em] text-slate-400">Equipo analizado</p>
        <span className="rounded-full border border-slate-600/60 bg-slate-800/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-300">S24</span>
      </div>

      <p className="mt-2 text-lg md:text-xl font-semibold text-white leading-tight">{team.teamName}</p>

      <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm">
        <MetricCell label="S24 Index" value={`${team.s24Index}`} tone="text-cyan-200" />
        <MetricCell label="Rating" value={team.s24Rating} tone="text-slate-100" />
        <MetricCell label="Confianza" value={team.s24Confianza} tone={getConfidenceTone(team.s24Confianza)} />
        <MetricCell label="Riesgo" value={team.s24Riesgo} tone={getRiskTone(team.s24Riesgo)} />
        <MetricCell label="Tendencia" value={team.s24Tendencia} tone={getTrendTone(team.s24Tendencia)} fullWidth />
      </div>
    </article>
  );
}

interface MetricCellProps {
  label: string;
  value: string;
  tone: string;
  fullWidth?: boolean;
}

function MetricCell({ label, value, tone, fullWidth }: MetricCellProps) {
  return (
    <div className={`rounded-xl border border-slate-700/45 bg-black/25 p-3 ${fullWidth ? 'col-span-2' : ''}`}>
      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className={`mt-1.5 text-sm font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function IndicadoresS24({ informe }: { informe: InformeS24V1 }) {
  const summary = informe.indicadores.resumen;
  const tone = getIndexTone(summary.s24Index);

  return (
    <section className="space-y-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Indicadores S24</p>
      <section className="premium-card-enter premium-grid-pattern rounded-3xl border border-slate-700/45 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_46%),linear-gradient(160deg,rgba(15,23,42,0.95),rgba(2,6,23,0.96))] p-5 md:p-8 shadow-2xl">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h3 className="font-editorial text-3xl md:text-4xl font-semibold tracking-tight text-white">Lectura de indicadores y diferencial</h3>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-300">Los indicadores se mantienen como referencia metodologica para validar la narrativa editorial del informe.</p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${tone.badge}`}>{summary.s24Rating}</span>
              <span className="rounded-full border border-slate-600/60 bg-slate-800/60 px-3 py-1 text-xs uppercase tracking-[0.12em] text-slate-200">Confianza {summary.s24Confianza}</span>
              <span className="rounded-full border border-slate-600/60 bg-slate-800/60 px-3 py-1 text-xs uppercase tracking-[0.12em] text-slate-200">Riesgo {summary.s24Riesgo}</span>
              <span className="rounded-full border border-slate-600/60 bg-slate-800/60 px-3 py-1 text-xs uppercase tracking-[0.12em] text-slate-200">Tendencia {summary.s24Tendencia}</span>
            </div>
          </div>

          <div className={`relative mx-auto w-full max-w-[290px] rounded-3xl border border-slate-700/50 bg-slate-900/65 p-5 md:p-6 shadow-xl ${tone.glow}`}>
            <div className="relative mx-auto h-44 w-44 premium-card-enter" style={buildRingStyle(summary.s24Index, tone.ring)}>
              <div className="absolute inset-[12px] rounded-full bg-slate-950/95" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">S24 Index</p>
                <p className="font-editorial mt-1 text-5xl font-semibold text-white leading-none">{summary.s24Index}</p>
              </div>
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed text-slate-300">{tone.description}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-700/45 bg-slate-950/60 p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Comparativa S24</p>
          <span className="text-[11px] text-slate-400">Lado a lado editorial</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {informe.indicadores.equipos.map((team) => (
            <TeamComparison key={team.teamName} team={team} />
          ))}
        </div>
      </section>
    </section>
  );
}

export default function InformeS24({ informe }: InformeS24Props) {
  return (
    <section className="space-y-6 md:space-y-7">
      <ContextoRealPartidoS24 context={informe.realContext} />
      <NarrativaEditorialS24 narrativa={informe.narrativa} />
      <InsightS24 insight={informe.insight} />
      <VeredictoS24 veredicto={informe.veredicto} />
      <IndicadoresS24 informe={informe} />
      <FactoresS24 factores={informe.factores} />
      <ArbolEvidenciasS24 arbol={informe.arbolEvidencias} />
      <PasaporteAnaliticoS24 pasaporte={informe.pasaporte} />
    </section>
  );
}
