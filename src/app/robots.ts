import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/verify-subscription/'],
    },
    sitemap: 'https://health.kshetrivafarms.com/sitemap.xml',
  };
}
