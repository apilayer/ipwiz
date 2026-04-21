import { cookies, headers } from "next/headers";

export async function getOwnerCookie(): Promise<string | null> {
  const c = await cookies();
  return c.get("ipwiz_id")?.value ?? null;
}

export async function requireOwnerCookie(): Promise<string> {
  const v = await getOwnerCookie();
  if (!v) {
    throw new Error(
      "ipwiz_id cookie missing — proxy.ts should have set it. Hard-refresh the page."
    );
  }
  return v;
}

export async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip");
}

export async function getRequestSurface(): Promise<{
  userAgent: string | null;
  acceptLanguage: string | null;
  referrer: string | null;
}> {
  const h = await headers();
  return {
    userAgent: h.get("user-agent"),
    acceptLanguage: h.get("accept-language"),
    referrer: h.get("referer"),
  };
}
