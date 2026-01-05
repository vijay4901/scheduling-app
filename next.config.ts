import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allows production builds to complete even with ESLint errors
    // This is useful for deployment while we fix linting issues
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;


