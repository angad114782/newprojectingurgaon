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
      { protocol: 'https', hostname: 'propertyinbhiwadi.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.propertyinbhiwadi.com', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '5007', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '5008', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '5007', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '5008', pathname: '/**' },
    ],
  },

  // ── Compress output ─────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Strip console.log in production ────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // ── Bundle Optimization ─────────────────────────────────────
  experimental: {
    optimizePackageImports: ['framer-motion', 'swiper', 'react-hot-toast'],
  },

  // ── Webpack: reduce number of JS chunks ─────────────────────
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Increase minimum chunk size so small modules get merged
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        maxInitialRequests: 5,
        maxAsyncRequests: 8,
        minSize: 30000,
        cacheGroups: {
          // Merge React + Next.js framework into one chunk
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /node_modules\/(react|react-dom|next|scheduler)\//,
            priority: 50,
            enforce: true,
          },
          // Merge all other vendor libs (≥2 pages use them) into one chunk
          vendors: {
            name: 'vendors',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },

  // ── 301 Redirects (www → non-www + trailing slash) ─────────
  async redirects() {
    return [
      // www → non-www canonical (301 permanent)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.propertyinbhiwadi.com' }],
        destination: 'https://propertyinbhiwadi.com/:path*',
        permanent: true,
      },
      // /projects/:slug → /project/:slug (plural → singular)
      {
        source: '/projects/:slug',
        destination: '/project/:slug',
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
