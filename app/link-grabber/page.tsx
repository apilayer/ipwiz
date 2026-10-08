import type { Metadata } from "next";
import Link from "next/link";
import { eq, sql, desc } from "drizzle-orm";
import { db, schema } from "@/app/lib/db";
import { getOwnerCookie } from "@/app/lib/identity";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { GrabButton } from "@/app/components/GrabButton";
import { SITE_URL } from "@/app/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Link Grabber: see the IP behind a click",
  description:
    "Create a trackable link, share it, and see the IP address, approximate location, ISP and device of everyone who opens it. Visitors see exactly what was captured before they continue.",
  alternates: { canonical: `${SITE_URL}/link-grabber` },
};

export default async function LinkGrabberPage() {
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
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[2rem] font-semibold leading-[1.24] text-fg md:text-[2.8125rem] md:leading-[3.5rem]">
              Link Grabber
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg-muted md:text-[1.1875rem] md:leading-[1.7]">
              Create a trackable link, share it anywhere, and see the IP
              address, approximate location, ISP and device of everyone who
              opens it. Anyone who clicks lands on a page showing exactly what
              was captured, then continues to your destination. Nothing is
              collected behind their back.
            </p>
          </div>
          <GrabButton />
        </header>

        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-bg-elev p-8 text-center text-sm text-fg-muted">
            No links yet. Create one with{" "}
            <span className="font-semibold text-fg">grab ipinfo</span> above.
            Links are scoped to this browser. Clear your cookies and they are
            gone. No account needed.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-bg-elev">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-bg-elev-2">
                <tr className="label text-[10px] font-semibold uppercase tracking-wider text-fg-dim">
                  <th className="px-4 py-2">code</th>
                  <th className="px-4 py-2">label</th>
                  <th className="px-4 py-2">destination</th>
                  <th className="px-4 py-2">clicks</th>
                  <th className="px-4 py-2">created</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((g) => (
                  <tr
                    key={g.id}
                    className="border-b border-border transition last:border-b-0 hover:bg-bg-elev-2"
                  >
                    <td className="code px-4 py-3 text-fg">{g.code}</td>
                    <td className="px-4 py-3 text-fg-muted">
                      {g.label ?? <span className="text-fg-dim">—</span>}
                    </td>
                    <td className="code max-w-[20rem] truncate px-4 py-3 text-xs text-fg-muted">
                      {g.destinationUrl}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-fg">
                      {g.clickCount}
                    </td>
                    <td className="px-4 py-3 text-xs tabular-nums text-fg-dim">
                      {new Date(g.createdAt * 1000).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/grabs/${g.code}`}
                        className="text-xs font-semibold text-accent hover:underline"
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

        <Footer />
      </main>
    </>
  );
}
