import { MetadataRoute } from 'next';

const BLOCKED_PATHS = ['/admin', '/admin/', '/api/'];

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com').replace(/\/$/, '');

const AI_BOTS = [
  // Google
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-Video',
  'Googlebot-News',
  'Google-Extended',      // Gemini / Google AI training
  'AdsBot-Google',
  // OpenAI / ChatGPT
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  // Anthropic / Claude
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  // Microsoft / Bing / Copilot
  'Bingbot',
  'BingPreview',
  'msnbot',
  // Perplexity
  'PerplexityBot',
  // Meta AI
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  // Apple
  'Applebot',
  // Amazon
  'Amazonbot',
  // You.com
  'YouBot',
  // Cohere
  'cohere-ai',
  // Common Crawl (used by many AI datasets)
  'CCBot',
  // DuckDuckGo
  'DuckDuckBot',
  // Yandex
  'YandexBot',
  // Baidu
  'Baiduspider',
];

export default function robots(): MetadataRoute.Robots {
  const aiRules = AI_BOTS.map((bot) => ({
    userAgent: bot,
    allow: '/',
    disallow: BLOCKED_PATHS,
  }));

  return {
    rules: [
      // Explicit allow for all major search + AI bots
      ...aiRules,
      // Default rule for everything else
      { userAgent: '*', allow: '/', disallow: BLOCKED_PATHS },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/image-sitemap.xml`],
    host: SITE_URL,
  };
}
