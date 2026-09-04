import Image from 'next/image';
import Link from 'next/link';

import Footer from '@/app/components/Footer';
import MatchCardNew from '@/app/components/MatchCardNew';
import Navbar from '@/app/components/Navbar';
import type {
  IntelligenceArticle,
  IntelligenceCenterContent,
  IntelligenceEvent,
  IntelligenceLeague,
  IntelligenceNewsItem,
} from '@/lib/domain/intelligenceCenter';
export type {
  IntelligenceArticle,
  IntelligenceCenterContent,
  IntelligenceEvent,
  IntelligenceLeague,
  IntelligenceMatch,
  IntelligenceNewsItem,
  IntelligenceRankingItem,
  MatchStatus,
  ConfidenceLevel,
} from '@/lib/domain/intelligenceCenter';

function LeagueChip({ league, chipLabel }: { league: IntelligenceLeague; chipLabel: string }) {
  return (
    <button className="group h-full min-h-[126px] w-full rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-500/40 hover:bg-slate-900/85 hover:shadow-[0_18px_45px_rgba(8,47,73,0.28)]">
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700/80 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.2),rgba(2,6,23,0.95))] shadow-inner shadow-sky-500/10">
          {league.logo ? (
            <Image src={league.logo} alt={league.name} width={24} height={24} className="object-contain" />
          ) : (
            <span className="text-xs font-semibold tracking-[0.2em] text-sky-200">{league.badge}</span>
          )}
        </div>
        <div className="flex min-h-[44px] flex-col items-center justify-center space-y-0.5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{chipLabel}</p>
          <p className="text-sm leading-tight font-semibold text-white transition-colors group-hover:text-sky-200">{league.name}</p>
        </div>
      </div>
    </button>
  );
}

function AnalysisCard({ article }: { article: IntelligenceArticle }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-800/80 bg-slate-950/70 transition-all duration-300 hover:border-sky-500/35 hover:bg-slate-950 hover:shadow-[0_22px_60px_rgba(8,47,73,0.26)]">
      <div className="relative h-52 overflow-hidden border-b border-slate-800/80 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_40%),linear-gradient(135deg,#0f172a_0%,#020617_60%,#07111f_100%)] px-6 py-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.28)_1px,transparent_1px)] bg-[size:44px_44px] opacity-25" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-slate-400">
            <span>{article.category}</span>
            <span>Sala de vídeo IA</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-white">{article.teams[0].name}</p>
              <p className="mt-1 text-sm text-slate-400">vs {article.teams[1].name}</p>
            </div>
            <div className="flex items-center gap-3">
              {article.teams.map((team) => (
                <div key={team.name} className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/80 p-2 shadow-[0_12px_30px_rgba(2,6,23,0.5)]">
                  <Image src={team.logo} alt={team.name} width={48} height={48} className="object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 px-6 py-6">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="rounded-full border border-slate-700/80 px-3 py-1 uppercase tracking-[0.18em]">{article.category}</span>
          <span>{article.date}</span>
        </div>
        <h3 className="text-2xl font-semibold leading-tight text-white">{article.title}</h3>
        <p className="text-sm leading-7 text-slate-300">{article.excerpt}</p>
        <Link href="/analisis" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition-colors hover:text-sky-200">
          Leer análisis
          <span className="transition-transform group-hover:translate-x-1">{'->'}</span>
        </Link>
      </div>
    </article>
  );
}

function NewsRow({ item }: { item: IntelligenceNewsItem }) {
  return (
    <article className="group grid gap-5 rounded-[26px] border border-slate-800/80 bg-slate-950/70 p-5 transition-all duration-300 hover:border-sky-500/35 hover:bg-slate-950 md:grid-cols-[220px_1fr]">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/70 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_40%),linear-gradient(135deg,#111827,#020617)] p-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.2)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30" />
        <div className="relative z-10 flex h-full min-h-[140px] flex-col justify-between">
          <span className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Señal de noticias</span>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sm font-semibold tracking-[0.18em] text-sky-100">
            {item.team.badge}
          </div>
          <div className="h-1.5 w-24 rounded-full bg-slate-800">
            <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-3 text-xs text-slate-400">
            <span className="rounded-full border border-slate-700/80 px-3 py-1 uppercase tracking-[0.18em] text-slate-300">{item.category}</span>
            <span>{item.date}</span>
          </div>
          <h3 className="text-2xl font-semibold leading-tight text-white">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">{item.excerpt}</p>
        </div>
        <Link href="/noticias" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100 transition-colors hover:text-sky-200">
          Ver noticia
          <span className="transition-transform group-hover:translate-x-1">{'->'}</span>
        </Link>
      </div>
    </article>
  );
}

function RankingRow({ position, name, score }: { position: number; name: string; score: number }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/75 px-4 py-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80 text-sm font-semibold text-slate-300">
            {String(position).padStart(2, '0')}
          </span>
          <span className="text-sm font-medium text-white">{name}</span>
        </div>
        <span className="text-lg font-semibold text-sky-300">{score}</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-900">
        <div className="h-2.5 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function IntelligenceCenterPage({ content }: { content: IntelligenceCenterContent }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-slate-900/80 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_25%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.12),transparent_24%),linear-gradient(180deg,#020617_0%,#020617_65%,#000000_100%)] px-4 pb-12 pt-24 md:px-12 md:pb-16 md:pt-28 lg:min-h-[calc(100vh-80px)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.45)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">{content.hero.badge}</p>
            <h1 className="text-[3rem] font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-[4.4rem] md:text-[5.4rem]">
              {content.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 md:text-xl">
              {content.hero.subtitle}
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              {content.hero.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={content.hero.primaryCta.href} className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(14,165,233,0.32)] transition-all hover:from-sky-400 hover:to-blue-500">
                {content.hero.primaryCta.label}
              </Link>
              <Link href={content.hero.secondaryCta.href} className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/60 px-6 text-sm font-semibold text-slate-100 transition-all hover:border-sky-500/35 hover:text-sky-200">
                {content.hero.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[620px] lg:max-w-[590px]">
            <div className="absolute -inset-4 rounded-[36px] bg-sky-500/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-sky-500/20 bg-slate-950/80 p-3 shadow-[0_28px_90px_rgba(2,6,23,0.7)]">
              <Image
                src={content.hero.image.src}
                alt={content.hero.image.alt}
                width={content.hero.image.width}
                height={content.hero.image.height}
                className="h-auto w-full rounded-[26px]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-12 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{content.leagues.intro}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">{content.leagues.title}</h2>
            </div>
            <p className="hidden text-sm text-slate-500 md:block">{content.leagues.helper}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
            {content.leagues.items.map((league) => (
              <LeagueChip key={league.name} league={league} chipLabel={content.leagues.chipLabel} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{content.matches.intro}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">{content.matches.title}</h2>
            </div>
            <Link href={content.matches.ctaHref} className="hidden text-sm font-semibold text-slate-300 transition-colors hover:text-sky-200 md:inline-flex">
              {content.matches.ctaLabel}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {content.matches.items.map((match) => (
              <MatchCardNew
                key={match.slug}
                competition={match.competition}
                time={match.time}
                status={match.status === 'PROXIMO' ? 'PRÓXIMO' : match.status}
                team1={match.team1}
                team1Logo={match.team1Logo}
                team2={match.team2}
                team2Logo={match.team2Logo}
                s24Index={match.s24Index}
                confidence={match.confidence}
                probability={match.probability}
                slug={match.slug}
                href={match.href}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{content.analysis.intro}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">{content.analysis.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">{content.analysis.description}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {content.analysis.items.map((article) => (
              <AnalysisCard key={article.title} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{content.news.intro}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">{content.news.title}</h2>
            </div>
            <Link href={content.news.ctaHref} className="hidden text-sm font-semibold text-slate-300 transition-colors hover:text-sky-200 md:inline-flex">
              {content.news.ctaLabel}
            </Link>
          </div>
          <div className="space-y-5">
            {content.news.items.map((item) => (
              <NewsRow key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-4 md:px-12 md:pb-6">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-slate-800/80 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{content.premium.intro}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">{content.premium.title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                {content.premium.description}
              </p>
            </div>
            <div className="rounded-[24px] border border-dashed border-slate-700 bg-slate-950/75 px-5 py-8 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{content.premium.badge}</p>
              <p className="mt-3 text-xl font-semibold text-slate-100">{content.premium.headline}</p>
              <p className="mt-2 text-sm text-slate-400">{content.premium.subheadline}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-12 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-slate-800/80 bg-slate-950/70 p-6 md:p-7">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{content.ranking.intro}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">{content.ranking.title}</h2>
            </div>
            <div className="space-y-3">
              {content.ranking.items.map((entry, index) => (
                <RankingRow key={entry.name} position={index + 1} name={entry.name} score={entry.score} />
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-800/80 bg-slate-950/70 p-6 md:p-7">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{content.events.intro}</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">{content.events.title}</h2>
              </div>
              <div className="hidden rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400 md:block">
                {content.events.calendarLabel}
              </div>
            </div>

            <div className="mb-6 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.18em] text-slate-500">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                <div key={day} className="py-2">{day}</div>
              ))}
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <div
                  key={item}
                  className={`rounded-2xl border px-2 py-4 text-sm font-medium ${item === 5 || item === 6 ? 'border-sky-500/35 bg-sky-500/10 text-sky-200' : 'border-slate-800/80 bg-slate-900/60 text-slate-300'}`}
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {content.events.items.map((event) => (
                <article key={event.title} className="grid gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/75 p-4 md:grid-cols-[80px_1fr] md:items-center">
                  <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 px-3 py-4 text-center">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{event.month}</p>
                    <p className="mt-1 text-3xl font-semibold text-white">{event.day}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                      <span className="rounded-full border border-slate-700/80 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">{event.time}</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-400">{event.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 pt-2 md:px-12 md:pb-14">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-slate-800/80 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_28%),linear-gradient(135deg,#050816_0%,#020617_45%,#07111f_100%)] p-6 md:p-8 lg:p-10">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{content.newsletter.intro}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">{content.newsletter.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
                {content.newsletter.description}
              </p>
            </div>
            <form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder={content.newsletter.emailPlaceholder}
                className="h-12 flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-4 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
              />
              <button className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 text-sm font-semibold text-white transition-all hover:from-sky-400 hover:to-blue-500">
                {content.newsletter.buttonLabel}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
