"use client";

import type { IPstackResponse } from "@/app/lib/ipstack";
import { Stat } from "./Stat";

export function TrackerReveal({
  clickId,
  ipstack,
  surface,
  destinationUrl,
  grabLabel,
}: {
  clickId: string;
  ipstack: IPstackResponse | null;
  surface: {
    userAgent: string | null;
    acceptLanguage: string | null;
    referrer: string | null;
  };
  destinationUrl: string;
  grabLabel: string | null;
}) {
  const continueHref = `/api/clicks/${clickId}/continue`;
  const flag = ipstack?.location?.country_flag_emoji;
  const locParts = [ipstack?.city, ipstack?.region_name, ipstack?.country_name]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-8 md:px-6">
      <div className="rounded-xl border border-warn/30 bg-warn/5 p-5">
        <div className="mono text-[10px] uppercase tracking-wider text-warn">
          transparency notice
        </div>
        <h1 className="mt-2 text-xl font-semibold text-fg">
          You clicked an IPWiz tracking link.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Below is exactly what was captured about you and sent to whoever created
          this link. Nothing is hidden. This is a demo of how any link redirector
          can profile visitors — share your takeaways, be careful what you click.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-bg-elev">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
            what was logged
          </span>
          {grabLabel ? (
            <span className="mono text-xs text-fg-muted">
              label: {grabLabel}
            </span>
          ) : null}
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div>
              <div className="mono text-[10px] uppercase tracking-wider text-fg-dim">
                your ip
              </div>
              <div className="mono mt-1 text-2xl text-fg">
                {ipstack?.ip ?? "—"}
              </div>
            </div>
            <div className="flex items-center gap-2 text-fg-muted">
              {flag ? <span className="text-xl">{flag}</span> : null}
              <span className="text-sm">{locParts || "—"}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Stat label="ISP" value={ipstack?.connection?.isp ?? null} />
              <Stat label="ASN" value={ipstack?.connection?.asn ?? null} />
              <Stat label="Timezone" value={ipstack?.time_zone?.id ?? null} />
              <Stat label="Postal" value={ipstack?.zip ?? null} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Kv label="user agent" value={surface.userAgent} />
            <Kv label="accept-language" value={surface.acceptLanguage} />
            <Kv label="referrer" value={surface.referrer ?? "(direct)"} />
            <Kv
              label="vpn / proxy"
              value={
                ipstack?.security?.is_proxy
                  ? `yes (${ipstack.security.proxy_type ?? "proxy"})`
                  : ipstack?.security
                    ? "no"
                    : "(security module off)"
              }
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-bg-elev p-5">
        <p className="text-sm text-fg-muted">
          The creator of this link asked to send you to:
        </p>
        <p className="mono mt-2 break-all text-sm text-fg">
          {destinationUrl}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={continueHref}
            className="mono inline-flex h-10 items-center rounded-md border border-accent/40 bg-accent/15 px-4 text-sm font-medium text-accent transition hover:bg-accent/25"
          >
            continue to destination →
          </a>
          <a
            href="/"
            className="mono inline-flex h-10 items-center rounded-md border border-border bg-bg-elev-2 px-4 text-sm text-fg-muted transition hover:text-fg"
          >
            go to IPWiz instead
          </a>
        </div>
        <p className="mono mt-4 text-[11px] text-fg-dim">
          continue click-id = {clickId}
        </p>
      </section>
    </main>
  );
}

function Kv({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
        {label}
      </span>
      <span className="mono break-words text-xs text-fg">
        {value ?? <span className="text-fg-dim">—</span>}
      </span>
    </div>
  );
}
