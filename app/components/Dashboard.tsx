"use client";

import { useCallback, useEffect, useState } from "react";
import type { LookupResult } from "@/app/lib/ipstack";
import {
  describeIPstackError,
  describeTransportError,
  type FriendlyError,
} from "@/app/lib/errors";
import { IPCard } from "./IPCard";
import { TracePanel } from "./TracePanel";
import { GeoLocation } from "./GeoLocation";
import { ApiBanner } from "./ApiBanner";
import { AboutSection } from "./AboutSection";
import { ApiSuiteSection } from "./ApiSuiteSection";
import { FaqSection } from "./FaqSection";
import { Footer } from "./Footer";

export function Dashboard() {
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FriendlyError | null>(null);

  const lookup = useCallback(async (ip: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const qs = ip ? `?ip=${encodeURIComponent(ip)}` : "";
      const res = await fetch(`/api/ipstack${qs}`, { cache: "no-store" });
      const body = (await res.json()) as LookupResult | { error: string };
      if (!res.ok || "error" in body) {
        setError(describeTransportError(res.status));
        setResult(null);
        return;
      }
      const apiError = body.response.body.error;
      if (apiError) {
        setError(describeIPstackError(apiError.code, apiError.info));
        setResult(body);
        return;
      }
      setResult(body);
    } catch {
      setError(describeTransportError());
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    lookup(null);
  }, [lookup]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      {/* The question people arrived with, answered above the fold. The h1 is
          here rather than inside the card so the card can stay reusable. */}
      <header>
        <h1 className="text-[2rem] font-semibold leading-[1.24] text-fg md:text-[2.8125rem] md:leading-[3.5rem]">
          What is my IP address?
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg-muted md:text-[1.1875rem] md:leading-[1.7]">
          Here is the public IP address your connection is using right now,
          along with the location, network and privacy details attached to it.
          If your network has both an IPv4 and an IPv6 address, you will see
          both.
        </p>
      </header>

      <IPCard result={result} loading={loading} onLookup={lookup} />

      <ApiBanner />

      <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
        {/* Wrapper lets the right column drive the row height; the panel is
            absolutely positioned on md+ so it fills that height and scrolls
            internally instead of stretching the row. */}
        <div className="md:relative">
          <div className="md:absolute md:inset-0">
            <TracePanel result={result} loading={loading} error={error} />
          </div>
        </div>
        <GeoLocation data={result?.response.body ?? null} />
      </div>

      <AboutSection />

      <FaqSection />

      <ApiSuiteSection />

      <Footer />
    </main>
  );
}
