"use client";

import { useEffect, useState } from "react";

/**
 * Discovering both of your addresses needs two connections, not one.
 *
 * The server only ever sees the address the browser actually connected over,
 * because that is all `x-forwarded-for` can carry. If your browser preferred
 * IPv6, the server sees IPv6 and has no way to learn your IPv4. The only way to
 * learn the other one is to make a second request that can *only* travel over
 * that family, which is why sites that show both use separate v4-only and
 * v6-only hostnames.
 *
 * `ident.me` publishes exactly that pair and sends `access-control-allow-origin`,
 * so the browser can call both. Point these at your own A-only / AAAA-only
 * subdomains to keep the lookup in-house.
 */
const V4_PROBE = process.env.NEXT_PUBLIC_IPV4_PROBE || "https://v4.ident.me";
const V6_PROBE = process.env.NEXT_PUBLIC_IPV6_PROBE || "https://v6.ident.me";

const PROBE_TIMEOUT_MS = 6000;

export type IpFamily = "ipv4" | "ipv6";

export type DualStack = {
  ipv4: string | null;
  ipv6: string | null;
  /** Still waiting on at least one probe. */
  loading: boolean;
};

const looksLikeV4 = (s: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(s);
const looksLikeV6 = (s: string) => s.includes(":") && /^[0-9a-fA-F:.]+$/.test(s);

export const familyOf = (ip: string | null | undefined): IpFamily | null => {
  if (!ip) return null;
  if (looksLikeV4(ip)) return "ipv4";
  if (looksLikeV6(ip)) return "ipv6";
  return null;
};

async function probe(url: string, expect: IpFamily): Promise<string | null> {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    // A failed probe is a real answer: it means you have no address of that
    // family, so never report a v4 address as though it were v6.
    return familyOf(text) === expect ? text : null;
  } catch {
    return null;
  }
}

/**
 * Probes both families in parallel. A family that times out or refuses is
 * reported as absent, which is the correct answer for a single-stack network.
 */
export function useDualStack(): DualStack {
  const [state, setState] = useState<DualStack>({ ipv4: null, ipv6: null, loading: true });

  useEffect(() => {
    let alive = true;
    Promise.all([probe(V4_PROBE, "ipv4"), probe(V6_PROBE, "ipv6")]).then(([ipv4, ipv6]) => {
      if (alive) setState({ ipv4, ipv6, loading: false });
    });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
