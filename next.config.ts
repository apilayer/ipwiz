import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/devtools/ipwiz',
  assetPrefix: '/devtools/ipwiz',
  images: { unoptimized: true },
};

export default nextConfig;