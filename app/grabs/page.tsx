import Link from "next/link";
import { eq, sql, desc } from "drizzle-orm";
import { db, schema } from "@/app/lib/db";
import { getOwnerCookie } from "@/app/lib/identity";
import { Header } from "@/app/components/Header";

export const dynamic = "force-dynamic";

export default async function GrabsPage() {
  const owner = await getOwnerCookie();

  const rows = owner
    ? await db
        .select({
          id: schema.grabs.id,
          code: schema.grabs.code,
          label: schema.grabs.label,
          destinationUrl: schema.grabs.destinationUrl,
          shortUrl: schema.grabs.shortUrl,
          createdAt: schema.grabs.createdAt,
          clickCount: sql<number>`(
            SELECT COUNT(*) FROM ${schema.clicks}
            WHERE ${schema.clicks.grabId} = ${schema.grabs.id}
          )`.as("click_count"),
        })
        .from(schema.grabs)
        .where(eq(schema.grabs.ownerCookie, owner))
        .orderBy(desc(schema.grabs.createdAt))
    : [];

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Your grabs</h1>
            <p className="mt-1 text-sm text-fg-muted">
              Tracking links scoped to this browser. Clear cookies and they
              disappear — no account needed.
            </p>
          </div>
          <Link
            href="/"
            className="mono inline-flex h-9 items-center rounded-md border border-border bg-bg-elev-2 px-3 text-xs text-fg-muted transition hover:text-fg"
          >
            ← dashboard
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-bg-elev p-8 text-center text-sm text-fg-muted">
            No grabs yet. Create one from the main dashboard with{" "}
            <span className="mono text-fg">Grab Link</span>.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-bg-elev">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-bg-elev-2">
                <tr className="mono text-[10px] uppercase tracking-wider text-fg-dim">
                  <th className="px-4 py-2 font-medium">code</th>
                  <th className="px-4 py-2 font-medium">label</th>
                  <th className="px-4 py-2 font-medium">destination</th>
                  <th className="px-4 py-2 font-medium">clicks</th>
                  <th className="px-4 py-2 font-medium">created</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((g) => (
                  <tr
                    key={g.id}
                    className="border-b border-border last:border-b-0 transition hover:bg-bg-elev-2"
                  >
                    <td className="mono px-4 py-3 text-fg">{g.code}</td>
                    <td className="px-4 py-3 text-fg-muted">
                      {g.label ?? <span className="text-fg-dim">—</span>}
                    </td>
                    <td className="mono max-w-[20rem] truncate px-4 py-3 text-xs text-fg-muted">
                      {g.destinationUrl}
                    </td>
                    <td className="mono px-4 py-3 text-fg">{g.clickCount}</td>
                    <td className="mono px-4 py-3 text-xs text-fg-dim">
                      {new Date(g.createdAt * 1000).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/grabs/${g.code}`}
                        className="mono text-xs text-accent hover:underline"
                      >
                        view →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
