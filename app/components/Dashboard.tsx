"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { LookupResult } from "@/app/lib/ipstack";
import { IPCard } from "./IPCard";
import { LookupBar } from "./LookupBar";
import { TracePanel } from "./TracePanel";
import { GeoCompare } from "./GeoCompare";
import { GrabButton } from "./GrabButton";

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

      <IPCard result={result} loading={loading} />

      <LookupBar
        onLookup={lookup}
        loading={loading}
        currentTarget={result?.target}
      />

      <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
        <TracePanel result={result} loading={loading} error={error} />
        <GeoCompare data={result?.response.body ?? null} />
      </div>

      <footer className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-fg-dim">
        <span className="mono">
          IPWiz
        </span>
        <span className="mono">
          IPWiz © IPstack by APILayer
        </span>
      </footer>
    </main>
  );
}
