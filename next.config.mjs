import bundleAnalyzer from '@next/bundle-analyzer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This forces Next.js to re-process the library's code to resolve
  // internal export conflicts automatically.
  transpilePackages: ['react-map-gl', 'mapbox-gl'],

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      html2canvas: path.resolve(__dirname, 'node_modules/html2canvas-pro'),
    };
    return config;
  },

  experimental: {
    turbo: {
      resolveAlias: {
        html2canvas: './node_modules/html2canvas-pro',
      },
    },
  },

  async redirects() {
    return [
      { source: "/itineraries", destination: "/hotels", permanent: true },
      { source: "/itineraries/:path*", destination: "/hotels/:path*", permanent: true },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);