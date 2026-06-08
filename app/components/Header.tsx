import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-fg transition hover:opacity-80">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="h-5 w-5"
              aria-hidden
            >
              <rect x="3" y="3" width="26" height="26" rx="7" fill="currentColor" />
              <path
                d="M10 12.5 14 16l-4 3.5"
                stroke="var(--bg)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 20.5h6"
                stroke="var(--bg)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
            <span className="mono text-sm font-semibold tracking-tight">
              IPWiz
            </span>
          </Link>
          <span className="text-xs text-fg-dim">by</span>
          <a 
            href="https://apilayer.com/" 
            target="_blank" 
            rel="noreferrer noopener"
            className="flex items-center transition hover:opacity-80"
          >
            <Image
              src="/apilayer-logo.png"
              alt="APILayer"
              width={100}
              height={20}
              priority
              className="h-5 w-auto dark:brightness-0 dark:invert"
            />
          </a>
        </div>
        <div className="flex items-center gap-4 text-xs text-fg-muted">
          <a
            href="https://docs.apilayer.com/ipstack/docs/api-documentation"
            target="_blank"
            rel="noreferrer noopener"
            className="mono text-fg-muted transition hover:text-fg"
          >
            docs ↗
          </a>
          <a
            href="https://github.com/heyOnuoha/ipwiz"
            target="_blank"
            rel="noreferrer noopener"
            className="hidden sm:flex items-center gap-2 rounded-md border border-border bg-bg-elev-2 px-3 py-1.5 text-xs text-fg-muted transition hover:bg-bg-elev hover:text-fg"
          >
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="mono">Fork on GitHub</span>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
