/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['data.cdc.gov', 'nextstrain.org'],
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
};

module.exports = nextConfig;
