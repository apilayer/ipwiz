"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type CreatedGrab = {
  code: string;
  fullUrl: string;
  shortUrl: string | null;
};

export function GrabButton() {
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedGrab | null>(null);
  const [copied, setCopied] = useState(false);
  const destRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setTimeout(() => destRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/grabs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          destinationUrl: destination,
          label: label || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? `HTTP ${res.status}`);
      } else {
        setCreated({
          code: body.code,
          fullUrl: body.fullUrl,
          shortUrl: body.shortUrl,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setOpen(false);
    setDestination("");
    setLabel("");
    setCreated(null);
    setError(null);
    setCopied(false);
  }

  function copyShare() {
    if (!created) return;
    const text = created.shortUrl ?? created.fullUrl;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mono inline-flex h-10 items-center gap-2 rounded-md border border-accent/40 bg-accent/15 px-4 text-sm font-medium text-accent transition hover:bg-accent/25"
      >
        <LinkIcon />
        grab link
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) reset();
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-bg-elev shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
                  {created ? "link ready" : "new grab"}
                </span>
              </div>
              <button
                type="button"
                onClick={reset}
                className="mono text-sm text-fg-dim transition hover:text-fg"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {!created ? (
              <form onSubmit={submit} className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-1.5">
                  <label className="mono text-[10px] uppercase tracking-wider text-fg-dim">
                    destination url
                  </label>
                  <input
                    ref={destRef}
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="https://example.com/page"
                    className="mono h-10 rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-fg-dim focus:border-accent focus:outline-none"
                    spellCheck={false}
                    autoComplete="off"
                    required
                  />
                  <span className="text-[11px] text-fg-dim">
                    Where visitors will be sent after seeing what was captured.
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="mono text-[10px] uppercase tracking-wider text-fg-dim">
                    label <span className="text-fg-dim/70">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="my-test-link"
                    className="mono h-10 rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-fg-dim focus:border-accent focus:outline-none"
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
                {error ? (
                  <div className="mono rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
                    {error}
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] leading-relaxed text-fg-dim">
                    Visitors land on a transparency page showing what was logged,
                    then continue to your destination.
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mono h-9 rounded-md border border-accent/40 bg-accent/15 px-4 text-sm font-medium text-accent transition hover:bg-accent/25 disabled:opacity-50"
                  >
                    {loading ? "creating…" : "create"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-1.5">
                  <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
                    share this
                  </span>
                  <code className="mono break-all rounded-md border border-border bg-bg-elev-2 px-3 py-2 text-xs text-fg">
                    {created.shortUrl ?? created.fullUrl}
                  </code>
                  {created.shortUrl ? (
                    <span className="mono text-[11px] text-fg-dim">
                      full:{" "}
                      <span className="break-all text-fg-muted">
                        {created.fullUrl}
                      </span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-warn">
                      link shortener unavailable right now — the full URL still
                      works.
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyShare}
                    className="mono h-9 rounded-md border border-accent/40 bg-accent/15 px-3 text-xs font-medium text-accent transition hover:bg-accent/25"
                  >
                    {copied ? "copied ✓" : "copy"}
                  </button>
                  <Link
                    href={`/grabs/${created.code}`}
                    className="mono inline-flex h-9 items-center rounded-md border border-border bg-bg-elev-2 px-3 text-xs text-fg-muted transition hover:text-fg"
                    onClick={reset}
                  >
                    watch clicks live →
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="mono ml-auto h-9 rounded-md border border-border bg-bg-elev-2 px-3 text-xs text-fg-muted transition hover:text-fg"
                  >
                    done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function LinkIcon() {
  return (
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
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  );
}
