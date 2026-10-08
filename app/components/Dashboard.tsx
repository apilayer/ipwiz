"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { LookupResult } from "@/app/lib/ipstack";
import { IPCard } from "./IPCard";
import { LookupBar } from "./LookupBar";
import { TracePanel } from "./TracePanel";
import { GeoCompare } from "./GeoCompare";
import { GrabButton } from "./GrabButton";
import { ApiBanner } from "./ApiBanner";
import { FaqSection } from "./FaqSection";
import { Footer } from "./Footer";

export function Dashboard() {
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (ip: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const qs = ip ? `?ip=${encodeURIComponent(ip)}` : "";
      const res = await fetch(`/api/ipstack${qs}`, { cache: "no-store" });
      const body = (await res.json()) as LookupResult | { error: string };
      if (!res.ok || "error" in body) {
        setError("error" in body ? body.error : `HTTP ${res.status}`);
        setResult(null);
        return;
      }
      if (body.response.body.error) {
        setError(
          `IPstack: ${body.response.body.error.info} (code ${body.response.body.error.code})`
        );
        setResult(body);
        return;
      }
      setResult(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    lookup(null);
  }, [lookup]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <div className="flex items-center justify-end gap-2">
        <Link
          href="/grabs"
          className="mono inline-flex h-10 items-center rounded-md border border-border bg-bg-elev-2 px-3 text-xs text-fg-muted transition hover:text-fg"
        >
          my grabs
        </Link>
        <GrabButton />
      </div>

      {/* The question people arrived with, answered above the fold. The h1 is
          here rather than inside the card so the card can stay reusable. */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-fg md:text-3xl">
          What is my IP address?
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-muted">
          This is the public IP address your connection is presenting right now,
          with the location, network and privacy signals attached to it. Both your
          IPv4 and IPv6 addresses are shown when your network has each.
        </p>
      </header>

      <IPCard result={result} loading={loading} />

      <ApiBanner />

      <LookupBar
        onLookup={lookup}
        loading={loading}
        currentTarget={result?.target}
      />

      <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
        {/* Wrapper lets the right column drive the row height; the panel is
            absolutely positioned on md+ so it fills that height and scrolls
            internally instead of stretching the row. */}
        <div className="md:relative">
          <div className="md:absolute md:inset-0">
            <TracePanel result={result} loading={loading} error={error} />
          </div>
        </div>
        <GeoCompare data={result?.response.body ?? null} />
      </div>

      <FaqSection />

      <Footer />
    </main>
  );
}
