import bundleAnalyzer from '@next/bundle-analyzer';

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
  
  async redirects() {
    return [
      { source: "/itineraries", destination: "/hotels", permanent: true },
      { source: "/itineraries/:path*", destination: "/hotels/:path*", permanent: true },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);