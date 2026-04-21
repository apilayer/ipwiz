"use client";

import { useState } from "react";

const SAMPLES = [
  { label: "Google DNS", ip: "8.8.8.8" },
  { label: "Cloudflare", ip: "1.1.1.1" },
  { label: "Tor exit", ip: "185.220.101.1" },
  { label: "AWS us-east", ip: "3.5.140.2" },
];

export function LookupBar({
  onLookup,
  loading,
  currentTarget,
}: {
  onLookup: (ip: string | null) => void;
  loading: boolean;
  currentTarget?: string;
}) {
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    onLookup(trimmed || null);
  }

  return (
    <section className="rounded-xl border border-border bg-bg-elev">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
          lookup
        </span>
        <span className="mono text-xs text-fg-muted">
          inspect any address
        </span>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3 p-5">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter any IPv4 or IPv6, or leave empty for your own"
            className="mono h-10 flex-1 rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-fg-dim focus:border-accent focus:outline-none"
            spellCheck={false}
            autoComplete="off"
            inputMode="text"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="mono h-10 rounded-md border border-accent/40 bg-accent/15 px-4 text-sm font-medium text-accent transition hover:bg-accent/25 disabled:opacity-50"
            >
              {loading ? "…" : "lookup"}
            </button>
            <button
              type="button"
              onClick={() => {
                setValue("");
                onLookup(null);
              }}
              disabled={loading}
              className="mono h-10 rounded-md border border-border bg-bg-elev-2 px-3 text-sm text-fg-muted transition hover:text-fg disabled:opacity-50"
              title="Look up my own IP"
            >
              me
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
            samples
          </span>
          {SAMPLES.map((s) => (
            <button
              key={s.ip}
              type="button"
              onClick={() => {
                setValue(s.ip);
                onLookup(s.ip);
              }}
              disabled={loading}
              className={`mono rounded border px-2 py-1 text-[11px] transition disabled:opacity-50 ${
                currentTarget === s.ip
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-border bg-bg-elev-2 text-fg-muted hover:text-fg"
              }`}
            >
              {s.label} · {s.ip}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}
