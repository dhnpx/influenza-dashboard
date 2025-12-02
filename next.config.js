/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true, // Merged from next.config.ts
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'data.cdc.gov',
      },
      {
        protocol: 'https',
        hostname: 'nextstrain.org',
      },
    ],
  },
  async headers() {
    return [
      {
        // Allow requests to CDC and Nextstrain APIs
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  // Turbopack config (Next.js 16+ default)
  turbopack: {
    // Empty config to silence warning - Leaflet should work fine with Turbopack
  },
};

module.exports = nextConfig;
