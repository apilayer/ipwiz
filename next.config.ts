import type { NextConfig } from "next";
import { BASE_PATH } from "./app/lib/basePath";

/**
 * Where Next serves the app from. Empty by default so `npm run dev` works at
 * http://localhost:3000; production sets NEXT_PUBLIC_BASE_PATH to the sub-path
 * it is mounted at.
 *
 * No `assetPrefix`: that is for pointing assets at a CDN, and the Next docs
 * say plainly "we do not suggest you use a custom Asset Prefix for this use
 * case". basePath already covers sub-path hosting, and setting both risks
 * double-prefixing `/_next/*`.
 */
const nextConfig: NextConfig = {
  basePath: BASE_PATH,
};

export default nextConfig;
