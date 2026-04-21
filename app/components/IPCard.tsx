"use client";

import type { IPstackResponse, LookupResult } from "@/app/lib/ipstack";
import { Stat } from "./Stat";
import { VpnVerdict } from "./VpnVerdict";

export function IPCard({
  result,
  loading,
}: {
  result: LookupResult | null;
  loading: boolean;
}) {
  const data: IPstackResponse | undefined = result?.response.body;
  const flag = data?.location?.country_flag_emoji;
  const locParts = [data?.city, data?.region_name, data?.country_name].filter(
    Boolean
  );

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-bg-elev">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
            target
          </span>
          <span className="mono text-xs text-fg-muted">
            {result?.target === "check" ? "/check (requester)" : result?.target ?? "—"}
          </span>
        </div>
        <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
          {loading ? (
            <span className="text-info">resolving…</span>
          ) : result ? (
            <span>{result.response.elapsedMs} ms</span>
          ) : null}
        </span>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="mono text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              {loading && !data ? (
                <span className="inline-block h-9 w-48 animate-pulse rounded bg-bg-elev-2" />
              ) : (
                (data?.ip ?? "—")
              )}
            </h1>
            {data?.type ? (
              <span className="mono rounded border border-border bg-bg-elev-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
                {data.type}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2 text-fg-muted">
            {flag ? <span className="text-2xl leading-none">{flag}</span> : null}
            <span className="text-sm">
              {locParts.length ? locParts.join(", ") : "—"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
            <Stat label="ISP" value={data?.connection?.isp ?? null} />
            <Stat label="ASN" value={data?.connection?.asn ?? null} />
            <Stat
              label="Timezone"
              value={data?.time_zone?.id ?? null}
              hint={data?.time_zone?.current_time}
            />
            <Stat
              label="Postal"
              value={data?.zip ?? null}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {data ? <VpnVerdict data={data} /> : <VerdictSkeleton />}
        </div>
      </div>
    </section>
  );
}

function VerdictSkeleton() {
  return (
    <div className="flex h-full min-h-[7rem] animate-pulse items-center justify-center rounded-lg border border-dashed border-border bg-bg-elev-2 text-xs text-fg-dim">
      analyzing…
    </div>
  );
}
