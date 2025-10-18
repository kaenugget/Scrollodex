import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix workspace root detection warning
  outputFileTracingRoot: __dirname,
  
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
