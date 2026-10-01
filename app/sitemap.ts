import type { MetadataRoute } from 'next';

const baseUrl = 'https://sportiva24.com';
const blogSlugs = ['como-funciona-sportiva24', 'como-calculamos-probabilidades', 'que-significa-indice-s24', 'como-interpretamos-xg', 'como-utilizamos-ia-en-analisis-deportivo'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/futbol',
    '/analisis',
    '/match',
    '/noticias',
    '/blog',
    '/rendimiento-modelo',
    '/centro-inteligencia-s24',
    '/sobre-nosotros',
    '/contacto',
  ];

  return [...routes, ...blogSlugs.map((slug) => `/blog/${slug}`)].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' || path === '/futbol' || path === '/match' ? 'hourly' : 'weekly',
    priority: path === '/' ? 1 : path === '/futbol' || path === '/match' ? 0.9 : 0.7,
  }));
}
