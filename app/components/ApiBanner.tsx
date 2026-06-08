import Image from "next/image";

/**
 * Promo banner showcasing the ipstack API (by APILayer).
 * Styled to match IPWiz's dev-tool aesthetic and follows the app theme
 * toggle — light card + colored logos in light mode, dark + white in dark.
 */
export function ApiBanner() {
  return (
    <a
      href="https://ipstack.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full overflow-hidden rounded-lg border border-[#ED661D]/30 bg-bg-elev transition hover:border-[#ED661D]/70 select-none dark:shadow-2xl"
    >
      {/* subtle grid + orange glow backdrop */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fff4ea] via-white/40 to-[#ED661D]/10 dark:from-[#1a0d04]/90 dark:via-[#0a0a0b]/85 dark:to-[#ED661D]/20" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#ED661D]/15 blur-3xl transition-opacity group-hover:bg-[#ED661D]/25" />

      <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {/* brand lockup + copy */}
        <div className="flex items-center gap-4">
          <Image
            src="/brand/ipstack-icon.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-md"
          />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <Image
                src="/brand/ipstack-white.png"
                alt="ipstack"
                width={92}
                height={24}
                className="h-4 w-auto invert dark:invert-0"
              />
              <span className="h-3.5 w-px bg-black/15 dark:bg-white/25" />
              <Image
                src="/apilayer-logo.png"
                alt="APILayer"
                width={80}
                height={16}
                className="h-3 w-auto dark:brightness-0 dark:invert"
              />
            </div>
            <p className="mono text-[10px] font-semibold uppercase tracking-widest text-[#ED661D] dark:text-[#FD9950]">
              Real-time IP geolocation API
            </p>
            <p className="max-w-md text-sm font-medium leading-snug text-fg/80">
              Pinpoint any IP&apos;s location, ISP &amp; threat data — the same
              engine powering this page.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#ED661D] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#ED661D]/20 transition group-hover:bg-[#FF7917]">
            Get your free API key
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
          <span className="mono text-[9px] uppercase tracking-widest text-fg-dim">
            ipstack by APILayer
          </span>
        </div>
      </div>
    </a>
  );
}

/**
 * Compact single-row variant of {@link ApiBanner} for tight columns.
 */
export function ApiBannerCompact() {
  return (
    <a
      href="https://ipstack.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-lg border border-[#ED661D]/30 bg-bg-elev px-3 py-2.5 transition hover:border-[#ED661D]/70 select-none"
    >
      {/* orange glow backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#ED661D]/10 dark:to-[#ED661D]/15" />

      <div className="relative z-10 flex min-w-0 items-center gap-2.5">
        <Image
          src="/brand/ipstack-icon.png"
          alt=""
          width={24}
          height={24}
          className="h-6 w-6 shrink-0 rounded"
        />
        <div className="flex min-w-0 items-center gap-2">
          <Image
            src="/brand/ipstack-white.png"
            alt="ipstack"
            width={70}
            height={18}
            className="h-3.5 w-auto shrink-0 invert dark:invert-0"
          />
          <span className="mono truncate text-[10px] uppercase tracking-widest text-[#ED661D] dark:text-[#FD9950]">
            IP geolocation API
          </span>
        </div>
      </div>

      <span className="relative z-10 inline-flex shrink-0 items-center gap-1 rounded-md bg-[#ED661D] px-2.5 py-1.5 text-[11px] font-bold text-white transition group-hover:bg-[#FF7917]">
        Get API key
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </a>
  );
}
