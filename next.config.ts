import type { NextConfig } from "next";

/**
 * Where Next serves the app from.
 *
 * Empty by default so `npm run dev` works at http://localhost:3000. The public
 * deployment is served through a rewrite at ipstack.com/devtools/what-is-my-ip
 * and sets NEXT_PUBLIC_BASE_PATH to that sub-path, which Next needs in order to
 * resolve assets and internal links correctly.
 *
 * This is deliberately separate from the canonical URL in `app/lib/site.ts`:
 * what a crawler should be told about the page does not change just because you
 * are running it locally.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
