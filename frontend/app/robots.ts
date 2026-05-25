import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: 'https://www.gurgaonrealty.in/sitemap.xml',
    host: 'https://www.gurgaonrealty.in',
  };
}
