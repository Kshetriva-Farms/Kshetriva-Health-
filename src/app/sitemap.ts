import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://health.kshetrivafarms.com';
  const now = new Date();

  const routes = [
    '',
    '/dashboard',
    '/ai-advisor',
    '/recipes',
    '/vitals',
    '/calorie-tracker',
    '/water-tracker',
    '/weight-tracker',
    '/farm-basket',
    '/meal-plan',
    '/subscription',
    '/notifications',
    '/analytics',
    '/admin',
    '/profile',
    '/settings',
    '/login',
    '/register',
    '/forgot-password',
    '/profile-creation',
    '/verify-subscription',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/dashboard' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/dashboard' || route === '/ai-advisor' ? 0.9 : 0.8,
  }));
}
