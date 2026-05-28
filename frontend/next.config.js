/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Image Optimization ──────────────────────────────────────
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'plus.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'newprojectsingurgaon.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.newprojectsingurgaon.com', pathname: '/**' },
      { protocol: 'https', hostname: 'newprojectsingurgaon.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.newprojectsingurgaon.com', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '5007', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '5007', pathname: '/**' },
      { protocol: 'http', hostname: '192.168.1.11', port: '5007', pathname: '/**' },
    ],
  },

  // ── Compress output ─────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Bundle Optimization ─────────────────────────────────────
  experimental: {
    optimizePackageImports: ['framer-motion', '@heroicons/react', 'swiper'],
  },

  // ── 301 Redirects (www → non-www + trailing slash) ─────────
  async redirects() {
    return [
      // www → non-www canonical (301 permanent)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.newprojectsingurgaon.com' }],
        destination: 'https://newprojectsingurgaon.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.newprojectsingurgaon.com' }],
        destination: 'https://newprojectsingurgaon.com/:path*',
        permanent: true,
      },
      // Trailing slash removal
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },

  // ── Security + Performance Headers ─────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Remove X-Powered-By completely
          { key: 'X-Powered-By', value: '' },
          // Permissions Policy
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
      // Long-lived cache for static assets
      {
        source: '/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/_next/image(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
      // API routes — no cache
      {
        source: '/api/(.*)',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};

module.exports = nextConfig;
