/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gurgaonrealty.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gurgaonrealty.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gurgaonrealty.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gurgaonrealty.in',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5007',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5007',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.11',
        port: '5007',
        pathname: '/**',
      },
    ],

    formats: ['image/avif', 'image/webp'],
  },

  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],

  compress: true,
};

module.exports = nextConfig;