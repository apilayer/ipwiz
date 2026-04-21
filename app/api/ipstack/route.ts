import { NextRequest } from "next/server";
import type { IPstackResponse, LookupResult } from "@/app/lib/ipstack";

const IPSTACK_BASE = "http://api.ipstack.com";

const isPrivate = (ip: string) =>
  ip === "::1" ||
  ip === "127.0.0.1" ||
  ip.startsWith("10.") ||
  ip.startsWith("192.168.") ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
  ip.startsWith("fc") ||
  ip.startsWith("fd");

const isValidIp = (ip: string) => {
  const v4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const v6 = /^[0-9a-fA-F:]+$/;
  return v4.test(ip) || (v6.test(ip) && ip.includes(":"));
};

const maskKey = (url: string) =>
  url.replace(/access_key=[^&]+/i, "access_key=••••••••");

export async function GET(request: NextRequest) {
  const key = process.env.IPSTACK_ACCESS_KEY;
  if (!key || key === "PASTE_YOUR_NEW_IPSTACK_KEY_HERE") {
    return Response.json(
      {
        error:
          "IPSTACK_ACCESS_KEY is not set. Add it to .env.local and restart the dev server.",
      },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const ipParam = url.searchParams.get("ip")?.trim();

  let target: string;
  if (ipParam) {
    if (!isValidIp(ipParam)) {
      return Response.json(
        { error: `"${ipParam}" is not a valid IPv4 or IPv6 address.` },
        { status: 400 }
      );
    }
    target = ipParam;
  } else {
    const xff = request.headers.get("x-forwarded-for");
    const candidate = xff?.split(",")[0]?.trim() ?? "";
    target = candidate && !isPrivate(candidate) ? candidate : "check";
  }

  const endpoint =
    target === "check"
      ? `${IPSTACK_BASE}/check?access_key=${key}&hostname=1&security=1`
      : `${IPSTACK_BASE}/${encodeURIComponent(target)}?access_key=${key}&hostname=1&security=1`;

  const started = Date.now();
  let upstream: Response;
  try {
    upstream = await fetch(endpoint, { cache: "no-store" });
  } catch (e) {
    return Response.json(
      {
        error: `Failed to reach IPstack: ${e instanceof Error ? e.message : String(e)}`,
      },
      { status: 502 }
    );
  }
  const elapsedMs = Date.now() - started;
  const body = (await upstream.json()) as IPstackResponse;

  const result: LookupResult = {
    request: { url: maskKey(endpoint), method: "GET" },
    response: { status: upstream.status, elapsedMs, body },
    target,
  };

  return Response.json(result);
}
