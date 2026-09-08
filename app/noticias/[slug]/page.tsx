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
      <article className="mx-auto max-w-6xl px-6 pb-16 pt-12 md:pt-16">
        <Link href="/noticias" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
          ← Volver a noticias
        </Link>
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)] lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{article.category}</p>
            <h1 className="mt-4 text-3xl font-black leading-[1.08] md:text-5xl">{article.title}</h1>
            <p className="mt-5 text-sm uppercase tracking-wide text-slate-400">{article.date}</p>
            <p className="mt-8 text-lg leading-relaxed text-slate-300">{article.excerpt}</p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-slate-900">
            <img src={article.image} alt={article.title} className="aspect-[4/3] w-full object-cover" />
          </div>
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
