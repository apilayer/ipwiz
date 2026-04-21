import type { NextRequest } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/app/lib/db";
import { getOwnerCookie } from "@/app/lib/identity";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/grabs/[code]">
) {
  const { code } = await ctx.params;
  const owner = await getOwnerCookie();
  if (!owner) return Response.json({ error: "unauthorized" }, { status: 401 });

  const [grab] = await db
    .select()
    .from(schema.grabs)
    .where(
      and(eq(schema.grabs.code, code), eq(schema.grabs.ownerCookie, owner))
    )
    .limit(1);
  if (!grab) return Response.json({ error: "not found" }, { status: 404 });

  const rows = await db
    .select()
    .from(schema.clicks)
    .where(eq(schema.clicks.grabId, grab.id))
    .orderBy(asc(schema.clicks.capturedAt));

  const clicks = rows.map((r) => ({
    ...r,
    continued: Boolean(r.continued),
    ipstack: r.ipstackJson ? safeParse(r.ipstackJson) : null,
  }));

  return Response.json({ grab, clicks });
}

function safeParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
