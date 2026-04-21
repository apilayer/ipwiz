"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { IPstackResponse } from "@/app/lib/ipstack";

export type ClickRow = {
  id: string;
  ip: string;
  userAgent: string | null;
  acceptLanguage: string | null;
  referrer: string | null;
  continued: boolean;
  capturedAt: number;
  ipstack: Record<string, unknown> | null;
};

const POLL_MS = 2000;

export function GrabDetail({
  code,
  shortUrl,
  destinationUrl,
  initialClicks,
}: {
  code: string;
  shortUrl: string | null;
  destinationUrl: string;
  initialClicks: ClickRow[];
}) {
  const [clicks, setClicks] = useState<ClickRow[]>(initialClicks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());
  const [live, setLive] = useState(true);
  const seenIds = useRef<Set<string>>(new Set(initialClicks.map((c) => c.id)));
  const seenContinued = useRef<Set<string>>(
    new Set(initialClicks.filter((c) => c.continued).map((c) => c.id))
  );

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/grabs/${code}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { clicks: ClickRow[] };
      setClicks(data.clicks);

      const newIds: string[] = [];
      for (const c of data.clicks) {
        const freshRow = !seenIds.current.has(c.id);
        const freshContinue = c.continued && !seenContinued.current.has(c.id);
        if (freshRow || freshContinue) newIds.push(c.id);
        seenIds.current.add(c.id);
        if (c.continued) seenContinued.current.add(c.id);
      }
      if (newIds.length) {
        setFlashIds((prev) => {
          const next = new Set(prev);
          newIds.forEach((id) => next.add(id));
          return next;
        });
        setTimeout(() => {
          setFlashIds((prev) => {
            const next = new Set(prev);
            newIds.forEach((id) => next.delete(id));
            return next;
          });
        }, 1500);
      }
    } catch {}
  }, [code]);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(poll, POLL_MS);
    return () => clearInterval(t);
  }, [live, poll]);

  const selected = clicks.find((c) => c.id === selectedId) ?? null;
  const shareUrl = shortUrl ?? `${typeof window !== "undefined" ? window.location.origin : ""}/g/${code}`;

  return (
    <div className="grid gap-5 md:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-5">
        <ShareCard
          code={code}
          shortUrl={shortUrl}
          destinationUrl={destinationUrl}
          shareUrl={shareUrl}
        />

        <section className="overflow-hidden rounded-xl border border-border bg-bg-elev">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
                clicks
              </span>
              <span className="mono text-xs text-fg-muted">
                {clicks.length} captured
              </span>
            </div>
            <label className="mono flex items-center gap-2 text-[11px] text-fg-muted">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  live ? "bg-accent pulse-dot" : "bg-fg-dim"
                }`}
              />
              <input
                type="checkbox"
                checked={live}
                onChange={(e) => setLive(e.target.checked)}
                className="h-3 w-3 accent-[color:var(--accent)]"
              />
              live
            </label>
          </div>
          {clicks.length === 0 ? (
            <div className="p-8 text-center text-sm text-fg-muted">
              no clicks yet — share the link above and watch this fill up in
              real time.
            </div>
          ) : (
            <ul className="max-h-[28rem] divide-y divide-border overflow-auto scrollbar-thin">
              {clicks
                .slice()
                .reverse()
                .map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelectedId(c.id)}
                      className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm transition hover:bg-bg-elev-2 ${
                        selectedId === c.id ? "bg-bg-elev-2" : ""
                      } ${flashIds.has(c.id) ? "animate-flash" : ""}`}
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="mono truncate text-fg">{c.ip}</span>
                        <span className="truncate text-xs text-fg-muted">
                          {locationLabel(c.ipstack) ?? uaShort(c.userAgent) ?? "—"}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`mono rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
                            c.continued
                              ? "border-accent/40 bg-accent/10 text-accent"
                              : "border-warn/40 bg-warn/10 text-warn"
                          }`}
                        >
                          {c.continued ? "continued" : "bounced"}
                        </span>
                        <span className="mono text-[10px] text-fg-dim">
                          {relativeTime(c.capturedAt)}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </section>
      </div>

      <ClickDetail click={selected} />
    </div>
  );
}

function ShareCard({
  code,
  shortUrl,
  destinationUrl,
  shareUrl,
}: {
  code: string;
  shortUrl: string | null;
  destinationUrl: string;
  shareUrl: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  function copy(text: string, key: string) {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
  }
  const fullUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/g/${code}`;
  return (
    <section className="rounded-xl border border-border bg-bg-elev p-5">
      <div className="mono text-[10px] uppercase tracking-wider text-fg-dim">
        share this link
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <Row
          label={shortUrl ? "tinyurl" : "full"}
          value={shareUrl}
          onCopy={() => copy(shareUrl, "primary")}
          copied={copied === "primary"}
        />
        {shortUrl ? (
          <Row
            label="full"
            value={fullUrl}
            onCopy={() => copy(fullUrl, "full")}
            copied={copied === "full"}
          />
        ) : null}
      </div>
      <p className="mt-4 text-xs text-fg-muted">
        Destination after capture:{" "}
        <span className="mono text-fg">{destinationUrl}</span>
      </p>
    </section>
  );
}

function Row({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="mono w-16 shrink-0 text-[10px] uppercase tracking-wider text-fg-dim">
        {label}
      </span>
      <code className="mono flex-1 truncate rounded-md border border-border bg-bg-elev-2 px-2 py-1.5 text-xs text-fg">
        {value}
      </code>
      <button
        type="button"
        onClick={onCopy}
        className="mono h-8 rounded-md border border-border bg-bg-elev-2 px-2 text-[11px] text-fg-muted transition hover:text-fg"
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}

function ClickDetail({ click }: { click: ClickRow | null }) {
  if (!click) {
    return (
      <section className="flex min-h-[20rem] items-center justify-center rounded-xl border border-dashed border-border bg-bg-elev p-5 text-sm text-fg-muted">
        Select a click to see full IPstack details.
      </section>
    );
  }
  const ipstack = (click.ipstack ?? {}) as IPstackResponse;
  const sec = ipstack.security ?? {};
  return (
    <section className="flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-bg-elev">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
            click detail
          </span>
          <span className="mono text-xs text-fg-muted">
            {new Date(click.capturedAt * 1000).toLocaleString()}
          </span>
        </div>
        <span
          className={`mono rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
            click.continued
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-warn/40 bg-warn/10 text-warn"
          }`}
        >
          {click.continued ? "continued" : "bounced"}
        </span>
      </div>

      <div className="flex flex-col gap-3 px-5">
        <Group label="identity">
          <Kv k="ip" v={click.ip} />
          <Kv k="asn" v={ipstack.connection?.asn} />
          <Kv k="isp" v={ipstack.connection?.isp} />
          <Kv k="type" v={ipstack.type} />
        </Group>
        <Group label="location">
          <Kv
            k="city"
            v={[ipstack.city, ipstack.region_name, ipstack.country_name]
              .filter(Boolean)
              .join(", ")}
          />
          <Kv k="lat/lon" v={latLon(ipstack)} />
          <Kv k="timezone" v={ipstack.time_zone?.id} />
          <Kv k="zip" v={ipstack.zip} />
        </Group>
        <Group label="security">
          <Kv k="is_proxy" v={boolStr(sec.is_proxy)} />
          <Kv k="proxy_type" v={sec.proxy_type} />
          <Kv k="vpn_service" v={sec.vpn_service} />
          <Kv k="is_tor" v={boolStr(sec.is_tor)} />
          <Kv k="threat_level" v={sec.threat_level} />
          <Kv k="hosting_facility" v={boolStr(sec.hosting_facility)} />
        </Group>
        <Group label="surface">
          <Kv k="user-agent" v={click.userAgent} wide />
          <Kv k="accept-lang" v={click.acceptLanguage} />
          <Kv k="referrer" v={click.referrer ?? "(direct)"} wide />
        </Group>
      </div>

      <details className="border-t border-border px-5 py-3">
        <summary className="mono cursor-pointer text-[10px] uppercase tracking-wider text-fg-dim">
          raw ipstack json
        </summary>
        <pre className="mono mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-bg-elev-2 p-3 text-[11px] leading-relaxed text-fg scrollbar-thin">
{JSON.stringify(click.ipstack, null, 2)}
        </pre>
      </details>
    </section>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mono mb-1 text-[10px] uppercase tracking-wider text-fg-dim">
        {label}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-l border-border pl-3">
        {children}
      </div>
    </div>
  );
}

function Kv({
  k,
  v,
  wide,
}: {
  k: string;
  v: string | number | undefined | null;
  wide?: boolean;
}) {
  return (
    <div className={`mono flex gap-3 text-xs ${wide ? "col-span-2" : ""}`}>
      <span className="w-24 shrink-0 text-info">{k}</span>
      <span className="break-all text-fg">
        {v === undefined || v === null || v === "" ? (
          <span className="text-fg-dim">—</span>
        ) : (
          String(v)
        )}
      </span>
    </div>
  );
}

function latLon(ip: IPstackResponse): string | null {
  if (ip.latitude === undefined || ip.longitude === undefined) return null;
  return `${ip.latitude.toFixed(4)}, ${ip.longitude.toFixed(4)}`;
}
function boolStr(v: boolean | undefined) {
  if (v === undefined) return null;
  return v ? "yes" : "no";
}
function locationLabel(ipstack: Record<string, unknown> | null): string | null {
  if (!ipstack) return null;
  const ip = ipstack as IPstackResponse;
  const parts = [ip.city, ip.country_name].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}
function uaShort(ua: string | null): string | null {
  if (!ua) return null;
  const match = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/);
  return match?.[0] ?? ua.slice(0, 40);
}
function relativeTime(unix: number): string {
  const diff = Math.max(0, Math.floor(Date.now() / 1000 - unix));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
