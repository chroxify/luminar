/** @type {import('next').NextConfig} */

let hostPath = ['http', 'localhost', '3000'];
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  hostPath = process.env.NEXT_PUBLIC_SUPABASE_URL.split(':');
}

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@feedbase/ui'],
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: hostPath[0],
        hostname: hostPath[1].replace('//', ''),
        port: hostPath[2],
        pathname: '/storage/v1/object/public/changelog-images/**',
      },
      {
        protocol: hostPath[0],
        hostname: hostPath[1].replace('//', ''),
        port: hostPath[2],
        pathname: '/storage/v1/object/public/workspaces/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:slug/board/:id',
        destination: '/:slug',
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
