import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/devtools/aerostack',
  assetPrefix: '/devtools/aerostack',
  images: { unoptimized: true },
};

export default nextConfig;