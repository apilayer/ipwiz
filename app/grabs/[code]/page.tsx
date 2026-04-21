import Link from "next/link";
import { and, asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/app/lib/db";
import { getOwnerCookie } from "@/app/lib/identity";
import { Header } from "@/app/components/Header";
import { GrabDetail } from "@/app/components/GrabDetail";
import type { ClickRow } from "@/app/components/GrabDetail";

export const dynamic = "force-dynamic";

export default async function GrabDetailPage(
  props: PageProps<"/grabs/[code]">
) {
  const { code } = await props.params;
  const owner = await getOwnerCookie();
  if (!owner) notFound();

  const [grab] = await db
    .select()
    .from(schema.grabs)
    .where(
      and(eq(schema.grabs.code, code), eq(schema.grabs.ownerCookie, owner))
    )
    .limit(1);
  if (!grab) notFound();

  const rows = await db
    .select()
    .from(schema.clicks)
    .where(eq(schema.clicks.grabId, grab.id))
    .orderBy(asc(schema.clicks.capturedAt));

  const initialClicks: ClickRow[] = rows.map((r) => ({
    id: r.id,
    ip: r.ip,
    userAgent: r.userAgent,
    acceptLanguage: r.acceptLanguage,
    referrer: r.referrer,
    continued: Boolean(r.continued),
    capturedAt: r.capturedAt,
    ipstack: r.ipstackJson ? safeParse(r.ipstackJson) : null,
  }));

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="mono text-[10px] uppercase tracking-wider text-fg-dim">
              grab
            </div>
            <h1 className="mono text-xl text-fg">
              {grab.label ? (
                <span>
                  {grab.label}{" "}
                  <span className="text-fg-dim">· {grab.code}</span>
                </span>
              ) : (
                grab.code
              )}
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/grabs"
              className="mono inline-flex h-9 items-center rounded-md border border-border bg-bg-elev-2 px-3 text-xs text-fg-muted transition hover:text-fg"
            >
              ← all grabs
            </Link>
          </div>
        </div>

        <GrabDetail
          code={grab.code}
          shortUrl={grab.shortUrl}
          destinationUrl={grab.destinationUrl}
          initialClicks={initialClicks}
        />
      </main>
    </>
  );
}

function safeParse(s: string): Record<string, unknown> | null {
  try {
    const v = JSON.parse(s);
    return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
