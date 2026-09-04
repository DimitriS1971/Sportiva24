import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

interface InfoSection {
  heading: string;
  body: string;
}

interface SimpleInfoPageProps {
  title: string;
  subtitle: string;
  sections: InfoSection[];
  updatedAt: string;
}

export default function SimpleInfoPage({ title, subtitle, sections, updatedAt }: SimpleInfoPageProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-slate-900/80 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_25%),linear-gradient(180deg,#020617_0%,#020617_65%,#000000_100%)] px-4 pb-10 pt-24 md:px-12 md:pb-14 md:pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.45)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Sportiva24</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">{subtitle}</p>
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-slate-500">Actualizado: {updatedAt}</p>
        </div>
      </section>

      <section className="px-4 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-5xl space-y-6">
          {sections.map((section) => (
            <article key={section.heading} className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 md:p-7">
              <h2 className="text-xl font-semibold text-white md:text-2xl">{section.heading}</h2>
              <p className="mt-3 text-sm leading-8 text-slate-300 md:text-base">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
