import type { MetadataRoute } from 'next';

const baseUrl = 'https://sportiva24.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/futbol',
    '/basketball',
    '/beisbol',
    '/tenis',
    '/f1',
    '/ciclismo',
    '/egames',
    '/analisis',
    '/match',
    '/noticias',
    '/blog',
    '/centro-inteligencia-s24',
    '/club-intelligence',
    '/player-intelligence',
    '/league-intelligence',
    '/season-intelligence',
    '/modelo-online',
    '/sobre-nosotros',
    '/contacto',
  ];

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' || path === '/futbol' || path === '/match' ? 'hourly' : 'weekly',
    priority: path === '/' ? 1 : path === '/futbol' || path === '/match' ? 0.9 : 0.7,
  }));
}
