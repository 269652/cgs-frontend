import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    domains: ['localhost', 'cgs-strapi-production.up.railway.app', 'cgsstrapi.reactserver.dev', 'cgsstrapi.javascript.moe', 'strapi.cgs-freiburg.de'],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Disable image optimization for external URLs to prevent timeouts
    // Images from Strapi will be served directly
    unoptimized: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
