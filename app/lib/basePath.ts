/**
 * The sub-path this app is served from, e.g. "/devtools/what-is-my-ip".
 *
 * Next wants "" for the root and rejects a trailing slash, so both the unset
 * case and a stray "/" normalise to "". Must be set at build time: Next inlines
 * it into the client bundle, so changing it needs a rebuild, not a restart.
 *
 * Deliberately separate from the canonical URL in `site.ts`. Where the app is
 * served from and what a crawler should be told about it are different
 * questions, and conflating them either 404s local dev or de-indexes the page.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "/").replace(
  /\/+$/,
  ""
);
