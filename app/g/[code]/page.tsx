import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/app/lib/db";
import { newId } from "@/app/lib/codes";
import {
  getClientIp,
  getRequestSurface,
} from "@/app/lib/identity";
import { lookupIp } from "@/app/lib/ipstackLookup";
import { Header } from "@/app/components/Header";
import { TrackerReveal } from "@/app/components/TrackerReveal";

export const dynamic = "force-dynamic";

export default async function TrackerPage(
  props: PageProps<"/g/[code]">
) {
  const { code } = await props.params;

  const [grab] = await db
    .select()
    .from(schema.grabs)
    .where(eq(schema.grabs.code, code))
    .limit(1);

  if (!grab) notFound();

  const [ip, surface] = await Promise.all([
    getClientIp(),
    getRequestSurface(),
  ]);

  const lookup = await lookupIp(ip);
  const ipstackBody = lookup?.body ?? null;
  const resolvedIp = ipstackBody?.ip ?? ip ?? "unknown";

  const clickId = newId();
  await db.insert(schema.clicks).values({
    id: clickId,
    grabId: grab.id,
    ip: resolvedIp,
    ipstackJson: ipstackBody ? JSON.stringify(ipstackBody) : null,
    userAgent: surface.userAgent,
    acceptLanguage: surface.acceptLanguage,
    referrer: surface.referrer,
    continued: 0,
    capturedAt: Math.floor(Date.now() / 1000),
  });

  return (
    <>
      <Header />
      <TrackerReveal
        clickId={clickId}
        ipstack={ipstackBody}
        surface={surface}
        destinationUrl={grab.destinationUrl}
        grabLabel={grab.label}
      />
    </>
  );
}
