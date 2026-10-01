import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { blogArticles } from '@/app/data/blog';

export const metadata: Metadata = {
  title: 'Blog | Sportiva24',
  description: 'Producto, metodología y aprendizajes sobre datos e inteligencia deportiva en Sportiva24.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="border-b border-blue-950/40 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_42%),linear-gradient(180deg,#071426,#000)] px-6 pb-14 pt-28 md:px-12 md:pb-18 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">Ideas y metodología</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Blog Sportiva24</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Producto, metodología y aprendizajes sobre cómo convertimos datos deportivos en contexto útil.</p>
        </div>
      </section>
      <section className="px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogArticles.map((article) => (
            <article key={article.slug} className="group flex flex-col rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 transition hover:-translate-y-1 hover:border-sky-500/40 hover:bg-slate-950">
              <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-sky-300"><span>{article.category}</span><span className="text-slate-500">{article.readingTime}</span></div>
              <h2 className="mt-5 text-2xl font-bold leading-tight text-white">{article.title}</h2>
              <p className="mt-4 flex-1 text-sm leading-7 text-slate-400">{article.excerpt}</p>
              <p className="mt-6 text-xs text-slate-500">{article.publishedAt}</p>
              <Link href={`/blog/${article.slug}`} className="mt-5 inline-flex items-center text-sm font-semibold text-sky-300 hover:text-sky-200">Leer artículo <span className="ml-2">→</span></Link>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
