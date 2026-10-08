/**
 * Canonical site facts, in one place so metadata, structured data, the sitemap
 * and robots all agree.
 *
 * The app is deployed on Vercel but served to the public through a rewrite at
 * ipstack.com/devtools/what-is-my-ip. Everything a crawler sees must point at
 * that public URL, not at the Vercel origin: a canonical aimed at a different
 * host tells Google this page is a duplicate and to index the other one
 * instead, which is the fastest way to rank for nothing.
 */
const DEFAULT_ORIGIN = "https://ipstack.com";
const DEFAULT_BASE_PATH = "/devtools/what-is-my-ip";

export const SITE = {
  name: "IPWiz",
  /** Public origin, no trailing slash. */
  origin: (process.env.NEXT_PUBLIC_SITE_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, ""),
  /**
   * Public sub-path the page lives at. Intentionally NOT read from
   * NEXT_PUBLIC_BASE_PATH: that variable moves where Next serves the app, and
   * is empty in local development. The canonical URL must describe production
   * either way, or running locally would emit a canonical pointing at the bare
   * ipstack.com homepage.
   */
  publicPath: (process.env.NEXT_PUBLIC_SITE_PATH ?? DEFAULT_BASE_PATH).replace(/\/$/, ""),
  tagline: "What is my IP address?",
  description:
    "See your public IPv4 and IPv6 address instantly, with the city, ISP, ASN, timezone and VPN or proxy status attached to it. Look up any IPv4 or IPv6 address, powered by the ipstack API.",
  locale: "en_US",
} as const;

/** The page's real public address, which is what every crawler signal must use. */
export const SITE_URL = `${SITE.origin}${SITE.publicPath}`;

export const absolute = (path = "/") => {
  if (path === "/" || path === "") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
