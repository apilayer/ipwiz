import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="mono text-sm font-semibold tracking-tight text-fg">
            IPWiz
          </span>
          <span className="text-xs text-fg-dim">by</span>
          <Image
            src="/apilayer-logo.png"
            alt="APILayer"
            width={100}
            height={20}
            priority
            className="h-5 w-auto dark:brightness-0 dark:invert"
          />
        </div>
        <div className="flex items-center gap-4 text-xs text-fg-muted">
          <span className="hidden items-center gap-2 sm:flex">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="mono">live</span>
          </span>
          <a
            href="https://docs.apilayer.com/ipstack/docs/api-documentation"
            target="_blank"
            rel="noreferrer noopener"
            className="mono text-fg-muted transition hover:text-fg"
          >
            docs ↗
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
