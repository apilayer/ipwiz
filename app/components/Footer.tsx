import Image from "next/image";
import Link from "next/link";

const YEAR = new Date().getFullYear();

type FooterLink = { label: string; href: string; external?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Live lookup", href: "/" },
      { label: "My grabs", href: "/grabs" },
      { label: "Inspect any IP", href: "/" },
    ],
  },
  {
    title: "ipstack API",
    links: [
      { label: "Get a free API key", href: "https://ipstack.com", external: true },
      {
        label: "API documentation",
        href: "https://docs.apilayer.com/ipstack/docs/api-documentation",
        external: true,
      },
      { label: "Pricing", href: "https://ipstack.com/pricing", external: true },
    ],
  },
  {
    title: "Project",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/heyOnuoha/ipwiz",
        external: true,
      },
      { label: "APILayer", href: "https://apilayer.com/", external: true },
    ],
  },
];

function Mark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5" aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="7" fill="currentColor" />
      <path
        d="M10 12.5 14 16l-4 3.5"
        stroke="var(--bg)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16.5 20.5h6" stroke="var(--bg)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-4 border-t border-border pt-8">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-fg transition hover:opacity-80"
          >
            <Mark />
            <span className="mono text-sm font-semibold tracking-tight">IPWiz</span>
          </Link>
          <p className="max-w-xs text-xs leading-relaxed text-fg-muted">
            Check your IP address, location, ISP, and VPN or proxy status — or
            look up any address with real-time geolocation, powered by ipstack.
          </p>
          <a
            href="https://apilayer.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-1 inline-flex w-fit items-center gap-2 text-fg-dim transition hover:opacity-80"
          >
            <span className="mono text-[10px] uppercase tracking-wider">Powered by</span>
            <Image
              src="/apilayer-logo.png"
              alt="APILayer"
              width={80}
              height={16}
              className="h-3.5 w-auto dark:brightness-0 dark:invert"
            />
          </a>
        </div>

        {/* Link columns */}
        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h3 className="mono text-[10px] uppercase tracking-wider text-fg-dim">
              {col.title}
            </h3>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-xs text-fg-muted transition hover:text-fg"
                    >
                      {link.label} <span className="text-fg-dim">↗</span>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-xs text-fg-muted transition hover:text-fg"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-8 flex flex-col gap-2 border-t border-border py-5 text-xs text-fg-dim sm:flex-row sm:items-center sm:justify-between">
        <span className="mono">© {YEAR} IPWiz · ipstack by APILayer</span>
        <span className="mono">
          
        </span>
      </div>
    </footer>
  );
}
