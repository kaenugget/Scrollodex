import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix workspace root detection warning
  outputFileTracingRoot: __dirname,
  
  // Image configuration for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'standing-bullfrog-723.convex.cloud',
        port: '',
        pathname: '/api/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'fal.run',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.fal.run',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'v3b.fal.media',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.fal.media',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Experimental features
  experimental: {
    // Enable if needed for better performance
    optimizePackageImports: ['@clerk/nextjs', 'convex'],
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle module resolution issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
