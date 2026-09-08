import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import NewsCardPremium from "@/app/components/NewsCardPremium";
import { newsData, type NewsArticle } from "@/app/data/news";
import Link from "next/link";
import AdSlot from "@/app/components/AdSlot";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getPublishedArticles(): Promise<NewsArticle[]> {
  const fallbackArticles = newsData.map((article) => ({ ...article }));

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select("id,slug,title,excerpt,content,image,category,published_at,featured")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });

    if (error || !data?.length) return fallbackArticles;

    return data.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      category: article.category,
      date: new Date(article.published_at as string).toLocaleDateString("es-CR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      featured: article.featured,
    }));
  } catch {
    return fallbackArticles;
  }
}

export default async function Noticias() {
  const articles = await getPublishedArticles();
  // Get featured article
  const featuredArticle = articles.find((article) => article.featured) || articles[0];
  
  // Get remaining articles for grid
  const gridArticles = articles.filter((article) => article.id !== featuredArticle.id).slice(0, 6);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-950/30 to-black/50 pt-16 md:pt-20 pb-6 md:pb-8 border-b border-blue-900/20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Noticias
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl">
            La actualidad del deporte analizada con contexto e inteligencia.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full pt-3 md:pt-4 pb-8 md:pb-10">
        <div className="max-w-6xl mx-auto px-6 space-y-14">
          
          {/* Featured Article */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Featured Image */}
            <div className="lg:col-span-2">
              <Link href={`/noticias/${featuredArticle.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-purple-900 h-72 md:h-80 cursor-pointer">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70" />
                  
                  {/* Featured badge */}
                  <div className="absolute top-6 left-6 bg-amber-500/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                    Destacado
                  </div>
                </div>
              </Link>
            </div>

            {/* Featured Content */}
            <div className="lg:col-span-1 flex flex-col justify-between min-h-0">
              <div>
                {/* Category */}
                <p className="inline-block bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white mb-3">
                  {featuredArticle.category}
                </p>

                {/* Date */}
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                  {featuredArticle.date}
                </p>

                {/* Title */}
                <h2 className="text-2xl md:text-[2rem] font-black text-white mb-3 leading-tight">
                  {featuredArticle.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-300 mb-5 leading-relaxed line-clamp-4">
                  {featuredArticle.excerpt}
                </p>
              </div>

              {/* CTA Button */}
              <Link href={`/noticias/${featuredArticle.slug}`}>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 group/btn text-center">
                  <span>Leer artículo</span>
                  <span className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-200 inline-block">→</span>
                </button>
              </Link>
            </div>
          </div>

          <AdSlot />
          <div className="hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">Espacio Premium</p>
                  <h3 className="text-2xl font-bold text-white">Publicidad Destacada</h3>
                </div>
                <div className="text-4xl opacity-20">✨</div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                Espacio reservado para patrocinadores premium. Publicidad estratégica dentro de análisis deportivos de alto impacto.
              </p>
              <div className="mt-6 flex gap-2">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
                <div className="h-1 w-8 bg-blue-600/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* Grid Articles */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">
              Artículos Recientes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridArticles.map((article) => (
                <NewsCardPremium key={article.id} article={article} />
              ))}
            </div>
          </div>

          <AdSlot variant="compact" />
          <div className="hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-2">Espacio Premium</p>
                  <h3 className="text-2xl font-bold text-white">Publicidad Destacada</h3>
                </div>
                <div className="text-4xl opacity-20">✨</div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                Espacio reservado para patrocinadores premium. Publicidad estratégica dentro de análisis deportivos de alto impacto.
              </p>
              <div className="mt-6 flex gap-2">
                <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" />
                <div className="h-1 w-8 bg-purple-600/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/30 rounded-2xl p-8 md:p-12">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold text-white mb-3">
                Recibe análisis exclusivos
              </h3>
              <p className="text-gray-300 mb-6">
                Suscríbete a nuestro boletín para recibir análisis deportivos profundos directamente en tu inbox.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 bg-black/50 border border-blue-800/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                  Suscribir
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
