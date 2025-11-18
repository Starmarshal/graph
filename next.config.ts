import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: false,
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
