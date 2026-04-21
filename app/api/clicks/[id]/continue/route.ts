import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/app/lib/db";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/clicks/[id]/continue">
) {
  const { id } = await ctx.params;

  const [click] = await db
    .select()
    .from(schema.clicks)
    .where(eq(schema.clicks.id, id))
    .limit(1);
  if (!click) return new Response("Click not found", { status: 404 });

  const [grab] = await db
    .select()
    .from(schema.grabs)
    .where(eq(schema.grabs.id, click.grabId))
    .limit(1);
  if (!grab) return new Response("Grab not found", { status: 404 });

  await db
    .update(schema.clicks)
    .set({ continued: 1 })
    .where(eq(schema.clicks.id, id));

  return Response.redirect(grab.destinationUrl, 302);
}
