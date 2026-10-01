import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { blogArticles, getBlogArticle } from '@/app/data/blog';

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) return { title: 'Artículo no encontrado | Sportiva24' };
  return { title: `${article.title} | Blog Sportiva24`, description: article.excerpt, alternates: { canonical: `/blog/${article.slug}` } };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <article className="mx-auto max-w-4xl px-6 pb-16 pt-32 md:pt-40">
        <Link href="/blog" className="text-sm font-semibold text-sky-300 hover:text-sky-200">← Volver al blog</Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">{article.category} · {article.readingTime}</p>
        <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{article.title}</h1>
        <p className="mt-5 text-sm uppercase tracking-wide text-slate-500">{article.publishedAt} · Redacción Sportiva24</p>
        <p className="mt-8 text-xl leading-9 text-slate-300">{article.excerpt}</p>
        <div className="mt-12 space-y-10">{article.sections.map((section) => <section key={section.heading}><h2 className="text-2xl font-bold text-white md:text-3xl">{section.heading}</h2><p className="mt-3 text-base leading-8 text-slate-300 md:text-lg">{section.body}</p></section>)}</div>
        <div className="mt-14 border-t border-slate-800 pt-6"><Link href="/redaccion-sportiva24" className="text-sm font-semibold text-sky-300 hover:text-sky-200">Conoce la Redacción Sportiva24 →</Link></div>
      </article>
      <Footer />
    </main>
  );
}