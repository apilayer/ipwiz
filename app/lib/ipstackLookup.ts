import type { IPstackResponse } from "./ipstack";

const IPSTACK_BASE = "http://api.ipstack.com";

// Server-side IPstack fetcher used by internal code paths (grab tracker page,
// etc.) so they don't have to HTTP-hop through /api/ipstack.
export async function lookupIp(ip: string | null): Promise<{
  target: string;
  elapsedMs: number;
  status: number;
  body: IPstackResponse;
  maskedUrl: string;
} | null> {
  const key = process.env.IPSTACK_ACCESS_KEY;
  if (!key || key === "PASTE_YOUR_NEW_IPSTACK_KEY_HERE") return null;

  const target = ip && isValidIp(ip) && !isPrivate(ip) ? ip : "check";
  const url =
    target === "check"
      ? `${IPSTACK_BASE}/check?access_key=${key}&hostname=1&security=1`
      : `${IPSTACK_BASE}/${encodeURIComponent(target)}?access_key=${key}&hostname=1&security=1`;

  const started = Date.now();
  try {
    const res = await fetch(url, { cache: "no-store" });
    const body = (await res.json()) as IPstackResponse;
    return {
      target,
      elapsedMs: Date.now() - started,
      status: res.status,
      body,
      maskedUrl: url.replace(/access_key=[^&]+/i, "access_key=••••••••"),
    };
  } catch {
    return null;
  }
}

function isPrivate(ip: string) {
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip.startsWith("fc") ||
    ip.startsWith("fd")
  );
}

function isValidIp(ip: string) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) || (ip.includes(":") && /^[0-9a-fA-F:]+$/.test(ip));
}
