export const articleCategories = ['Fútbol', 'Análisis', 'Noticias'] as const;

export type ArticleCategory = (typeof articleCategories)[number];

export function isArticleCategory(value: unknown): value is ArticleCategory {
  return typeof value === 'string' && articleCategories.some((category) => category === value);
}
