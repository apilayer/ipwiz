"use client";

import { useState } from "react";
import type { IPstackResponse, LookupResult } from "@/app/lib/ipstack";
import { familyOf, useDualStack } from "@/app/lib/dualStack";
import { LookupBar } from "./LookupBar";
import { Stat } from "./Stat";
import { VpnVerdict } from "./VpnVerdict";

function CopyIcon({ done }: { done: boolean }) {
  return done ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function AddressRow({
  label,
  value,
  primary = false,
  connected = false,
  loading,
}: {
  label: string;
  value: string | null;
  primary?: boolean;
  connected?: boolean;
  loading: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard is blocked in some contexts; the address is still selectable */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="w-11 shrink-0 text-[10px] font-semibold tracking-wider text-fg-dim uppercase">
        {label}
      </span>

      {loading && !value ? (
        <span className="inline-block h-8 w-48 animate-pulse rounded bg-bg-elev-2" />
      ) : value ? (
        <>
          {/* The address is the one thing everyone came to read, so it is set
              in the sans face with tabular figures rather than a code face. */}
          <span
            className={`font-semibold tracking-tight text-fg tabular-nums ${
              primary ? "text-2xl md:text-[2rem]" : "text-lg md:text-xl"
            }`}
          >
            {value}
          </span>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? `${label} address copied` : `Copy ${label} address`}
            title={copied ? "Copied" : `Copy ${label} address`}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition active:scale-90 ${
              copied
                ? "border-ok/50 bg-ok/15 text-ok"
                : "border-border bg-bg-elev-2 text-fg-dim hover:border-accent/50 hover:bg-accent/10 hover:text-accent focus-visible:border-accent/50 focus-visible:text-accent focus-visible:outline-none"
            }`}
          >
            <CopyIcon done={copied} />
          </button>
        </>
      ) : (
        <span className="text-sm text-fg-dim">
          Not detected on this connection
        </span>
      )}

      {connected && value ? (
        <span className="rounded border border-accent/40 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-accent uppercase">
          connected over
        </span>
      ) : null}
      {copied ? (
        <span
          aria-live="polite"
          className="text-[10px] font-semibold tracking-wider text-ok uppercase"
        >
          copied
        </span>
      ) : null}
    </div>
  );
}

export function IPCard({
  result,
  loading,
  onLookup,
}: {
  result: LookupResult | null;
  loading: boolean;
  onLookup: (ip: string | null) => void;
}) {
  const data: IPstackResponse | undefined = result?.response.body;
  const dual = useDualStack();

  // The address ipstack resolved is the one the browser actually connected
  // over; the probes fill in the other family. Prefer the probe result so both
  // rows stay consistent, and fall back to the connected address.
  const connected = data?.ip ?? null;
  const connectedFamily = familyOf(connected);
  const ipv4 = dual.ipv4 ?? (connectedFamily === "ipv4" ? connected : null);
  const ipv6 = dual.ipv6 ?? (connectedFamily === "ipv6" ? connected : null);
  const flag = data?.location?.country_flag_emoji;
  const locParts = [data?.city, data?.region_name, data?.country_name].filter(
    Boolean
  );

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-bg-elev">
      <div className="grid gap-6 p-5 md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-4">
          {/* IPv4 first, then IPv6 when the network has one. Most people mean
              their v4 address when they ask, even on a dual-stack connection. */}
          <div className="flex flex-col gap-2">
            <AddressRow
              label="IPv4"
              value={ipv4}
              primary
              connected={connectedFamily === "ipv4"}
              loading={(loading && !data) || dual.loading}
            />
            <AddressRow
              label="IPv6"
              value={ipv6}
              connected={connectedFamily === "ipv6"}
              loading={(loading && !data) || dual.loading}
            />
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
            <Stat label="Postal" value={data?.zip ?? null} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {data ? <VpnVerdict data={data} /> : <VerdictSkeleton />}
        </div>
      </div>

      <LookupBar
        variant="inline"
        onLookup={onLookup}
        loading={loading}
        currentTarget={result?.target}
      />
    </section>
  );
}

function VerdictSkeleton() {
  return (
    <div className="flex h-full min-h-[7rem] items-center justify-center rounded-lg border border-dashed border-border bg-bg-elev-2 text-xs text-fg-dim">
      analyzing…
    </div>
  );
}
