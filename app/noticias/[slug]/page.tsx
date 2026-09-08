import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AdSlot from "@/app/components/AdSlot";
import { newsData, type NewsArticle } from "@/app/data/news";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PublishedArticle = NewsArticle & { publishedAt: string };

async function getArticle(slug: string): Promise<PublishedArticle | null> {
  const localArticle = newsData.find((article) => article.slug === slug);

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select("id,slug,title,excerpt,content,image,category,published_at")
      .eq("slug", slug)
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        category: data.category,
        date: new Date(data.published_at).toLocaleDateString("es-CR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        publishedAt: data.published_at,
      };
    }
  } catch {
    // Keep local articles available if Supabase is temporarily unavailable.
  }

  if (!localArticle) return null;
  return { ...localArticle, publishedAt: localArticle.date };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <article className="mx-auto max-w-4xl px-6 pb-16 pt-12 md:pt-16">
        <Link href="/noticias" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
          ← Volver a noticias
        </Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{article.category}</p>
        <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{article.title}</h1>
        <p className="mt-5 text-sm uppercase tracking-wide text-slate-400">{article.date}</p>
        <p className="mt-8 text-xl leading-relaxed text-slate-300">{article.excerpt}</p>
        <div className="mt-10 overflow-hidden rounded-2xl bg-slate-900">
          <img src={article.image} alt={article.title} className="max-h-[32rem] w-full object-cover" />
        </div>
        <div className="prose prose-invert mt-10 max-w-none whitespace-pre-wrap text-lg leading-8 text-slate-200">
          {article.content}
        </div>
        <AdSlot variant="compact" />
      </article>
      <Footer />
    </main>
  );
}
