import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'cgs-strapi-production.up.railway.app'],
  },
};

export default nextConfig;
