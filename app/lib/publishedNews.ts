import { newsData, type NewsArticle } from '@/app/data/news';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getPublishedArticles(): Promise<NewsArticle[]> {
  const fallbackArticles = newsData.map((article) => ({ ...article }));

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('articles')
      .select('id,slug,title,excerpt,content,image,category,published_at,featured')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (error || !data?.length) return fallbackArticles;

    return data.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      category: article.category,
      date: new Date(article.published_at as string).toLocaleDateString('es-CR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      featured: article.featured,
    }));
  } catch {
    return fallbackArticles;
  }
}
