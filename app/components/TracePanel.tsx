"use client";

import { useState } from "react";
import type { LookupResult } from "@/app/lib/ipstack";

export function TracePanel({
  result,
  loading,
  error,
}: {
  result: LookupResult | null;
  loading: boolean;
  error: string | null;
}) {
  const [tab, setTab] = useState<"request" | "details" | "json">("request");

  const statusColor = result
    ? result.response.status >= 400
      ? "text-danger"
      : "text-accent"
    : "text-fg-dim";

  return (
    <section className="flex h-full flex-col rounded-xl border border-border bg-bg-elev">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
            live trace
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {loading ? (
            <span className="mono flex items-center gap-1 text-info">
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-info" />
              fetching
            </span>
          ) : result ? (
            <>
              <span className={`mono ${statusColor}`}>
                {result.response.status}
              </span>
              <span className="mono text-fg-dim">
                {result.response.elapsedMs}ms
              </span>
            </>
          ) : error ? (
            <span className="mono text-danger">error</span>
          ) : null}
        </div>
      </div>

      <div className="flex gap-4 border-b border-border px-5">
        {(["details", "json"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`mono -mb-px border-b-2 py-2 text-xs uppercase tracking-wider transition ${
              tab === t
                ? "border-accent text-accent"
                : "border-transparent text-fg-dim hover:text-fg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-5 scrollbar-thin">
        {error ? (
          <div className="mono whitespace-pre-wrap text-sm text-danger">
            {error}
          </div>
        ) : !result ? (
          <div className="mono text-sm text-fg-dim">awaiting lookup…</div>
        ): tab === "details" ? (
          <ResponseView result={result} />
        ) : (
          <JsonView data={result.response.body} />
        )}
      </div>
    </section>
  );
}

function RequestView({ result }: { result: LookupResult }) {
  const url = new URL(
    result.request.url.replace("http://", "https-fake://")
  );
  const params = Array.from(url.searchParams.entries());
  return (
    <div className="flex flex-col gap-4">
      <KvRow label="method" value={result.request.method} />
      <div className="flex flex-col gap-1">
        <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
          url
        </span>
        <code className="mono break-all rounded-md border border-border bg-bg-elev-2 px-2 py-1.5 text-xs text-fg">
          {result.request.url}
        </code>
      </div>
      <div className="flex flex-col gap-1">
        <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
          params
        </span>
        <div className="divide-y divide-border rounded-md border border-border bg-bg-elev-2">
          {params.length === 0 ? (
            <div className="mono px-3 py-2 text-xs text-fg-dim">—</div>
          ) : (
            params.map(([k, v]) => (
              <div
                key={k}
                className="mono flex items-center gap-3 px-3 py-1.5 text-xs"
              >
                <span className="w-24 shrink-0 text-info">{k}</span>
                <span className="truncate text-fg">{v}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <p className="text-[11px] leading-relaxed text-fg-dim">
        This request is issued from{" "}
        <span className="mono text-fg-muted">/api/ipstack</span> on your
        server. The <span className="mono">access_key</span> is read from{" "}
        <span className="mono">process.env.IPSTACK_ACCESS_KEY</span> and never
        exposed to the browser. The value above is masked for display.
      </p>
    </div>
  );
}

type FieldRow = [string, string | number | boolean | undefined | null];

type FieldGroup = {
  label: string;
  icon: string;
  defaultOpen: boolean;
  rows: FieldRow[];
};

function ResponseView({ result }: { result: LookupResult }) {
  const b = result.response.body;

  const groups: FieldGroup[] = [
    {
      label: "Request",
      icon: "↗",
      defaultOpen: true,
      rows: [
        ["status", result.response.status],
        ["elapsed", `${result.response.elapsedMs} ms`],
      ],
    },
    {
      label: "Network",
      icon: "◎",
      defaultOpen: true,
      rows: [
        ["ip", b.ip],
        ["hostname", b.hostname],
        ["type", b.type],
        ["continent", b.continent_name],
        ["routing", (b as Record<string, unknown>).ip_routing_type as string | undefined],
      ],
    },
    {
      label: "Location",
      icon: "⌖",
      defaultOpen: true,
      rows: [
        ["city", b.city],
        ["region", b.region_name],
        ["country", b.country_name],
        ["zip", b.zip],
        ["latitude", b.latitude],
        ["longitude", b.longitude],
        ["capital", b.location?.capital],
        ["calling_code", b.location?.calling_code],
        ["is_eu", b.location?.is_eu],
      ],
    },
    {
      label: "Timezone",
      icon: "◷",
      defaultOpen: false,
      rows: [
        ["id", b.time_zone?.id],
        ["code", b.time_zone?.code],
        ["current_time", b.time_zone?.current_time],
        ["gmt_offset", b.time_zone?.gmt_offset],
        ["daylight_saving", b.time_zone?.is_daylight_saving],
      ],
    },
    {
      label: "Currency",
      icon: "¤",
      defaultOpen: false,
      rows: [
        ["code", b.currency?.code],
        ["name", b.currency?.name],
        ["symbol", b.currency?.symbol],
        ["symbol_native", b.currency?.symbol_native],
      ],
    },
    {
      label: "Connection",
      icon: "⟁",
      defaultOpen: false,
      rows: [
        ["asn", b.connection?.asn],
        ["isp", b.connection?.isp],
        ["organization", b.connection?.organization_type],
        ["carrier", b.connection?.carrier],
        ["domain", [b.connection?.sld, b.connection?.tld].filter(Boolean).join(".") || undefined],
        ["home", b.connection?.home],
      ],
    },
    {
      label: "Security",
      icon: "⛊",
      defaultOpen: false,
      rows: [
        ["is_proxy", b.security?.is_proxy],
        ["proxy_type", b.security?.proxy_type],
        ["is_crawler", b.security?.is_crawler],
        ["is_tor", b.security?.is_tor],
        ["threat_level", b.security?.threat_level],
        ["vpn_service", b.security?.vpn_service],
        ["hosting_facility", b.security?.hosting_facility],
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {groups.map((group) => {
        const filled = group.rows.filter(
          ([, v]) => v !== undefined && v !== null && v !== ""
        ).length;
        if (filled === 0) return null;

        return (
          <details
            key={group.label}
            open={group.defaultOpen}
            className="group rounded-lg border border-border bg-bg-elev-2 transition-colors"
          >
            <summary className="flex cursor-pointer select-none items-center gap-2.5 px-3 py-2 text-xs transition-colors hover:bg-border/20">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded text-[11px] text-fg-dim">
                {group.icon}
              </span>
              <span className="mono flex-1 uppercase tracking-wider text-fg-muted">
                {group.label}
              </span>
              <span className="mono rounded-full bg-bg-elev px-2 py-0.5 text-[10px] text-fg-dim">
                {filled}
              </span>
              <span className="text-fg-dim transition-transform group-open:rotate-90">
                ▸
              </span>
            </summary>
            <div className="divide-y divide-border border-t border-border">
              {group.rows.map(([k, v]) => {
                if (v === undefined || v === null || v === "") return null;
                const display = typeof v === "boolean" ? (v ? "true" : "false") : String(v);
                const boolColor =
                  typeof v === "boolean"
                    ? v
                      ? "text-accent"
                      : "text-danger"
                    : "text-fg";
                return (
                  <div
                    key={k}
                    className="mono grid grid-cols-[8rem_1fr] items-start gap-3 px-3 py-1.5 text-xs"
                  >
                    <span className="text-info">{k}</span>
                    <span className={`break-all ${boolColor}`}>{display}</span>
                  </div>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}

function JsonView({ data }: { data: unknown }) {
  const json = JSON.stringify(data, null, 2);
  return (
    <pre className="mono whitespace-pre-wrap break-words rounded-md border border-border bg-bg-elev-2 p-3 text-xs leading-relaxed text-fg">
      {colorize(json)}
    </pre>
  );
}

function colorize(json: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex =
    /("(?:\\.|[^"\\])*"\s*:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  let lastIndex = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(json)) !== null) {
    if (match.index > lastIndex) {
      parts.push(json.slice(lastIndex, match.index));
    }
    const [m, key, str, bool, num] = match;
    if (key) parts.push(<span key={i++} className="text-info">{m}</span>);
    else if (str) parts.push(<span key={i++} className="text-accent">{m}</span>);
    else if (bool) parts.push(<span key={i++} className="text-warn">{m}</span>);
    else if (num) parts.push(<span key={i++} className="text-warn">{m}</span>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < json.length) parts.push(json.slice(lastIndex));
  return parts;
}

function KvRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="mono flex items-center gap-3 text-xs">
      <span className="w-20 shrink-0 uppercase tracking-wider text-fg-dim">
        {label}
      </span>
      <span className="text-fg">{value}</span>
    </div>
  );
}
