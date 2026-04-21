import { NextRequest } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/app/lib/db";
import { newGrabCode, newId } from "@/app/lib/codes";
import { getOwnerCookie } from "@/app/lib/identity";
import { shortenUrl } from "@/app/lib/shorten";

function originFor(request: NextRequest): string {
  const envOrigin = process.env.PUBLIC_ORIGIN;
  if (envOrigin) return envOrigin.replace(/\/$/, "");
  const host = request.headers.get("host");
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (request.url.startsWith("https") ? "https" : "http");
  return `${proto}://${host}`;
}

function normalizeDestination(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const owner = await getOwnerCookie();
  if (!owner) {
    return Response.json({ error: "Missing identity cookie." }, { status: 400 });
  }

  let payload: { destinationUrl?: string; label?: string };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const destination = normalizeDestination(payload.destinationUrl ?? "");
  if (!destination) {
    return Response.json(
      { error: "destinationUrl must be a valid http(s) URL." },
      { status: 400 }
    );
  }

  const code = newGrabCode();
  const id = newId();
  const origin = originFor(request);
  const fullUrl = `${origin}/g/${code}`;
  const shortUrl = await shortenUrl(fullUrl);

  await db.insert(schema.grabs).values({
    id,
    code,
    ownerCookie: owner,
    destinationUrl: destination,
    label: payload.label?.trim() || null,
    shortUrl: shortUrl,
    createdAt: Math.floor(Date.now() / 1000),
  });

  return Response.json({ id, code, fullUrl, shortUrl });
}

export async function GET() {
  const owner = await getOwnerCookie();
  if (!owner) return Response.json({ grabs: [] });

  const rows = await db
    .select({
      id: schema.grabs.id,
      code: schema.grabs.code,
      destinationUrl: schema.grabs.destinationUrl,
      label: schema.grabs.label,
      shortUrl: schema.grabs.shortUrl,
      createdAt: schema.grabs.createdAt,
      clickCount: sql<number>`COUNT(${schema.clicks.id})`
        .mapWith(Number)
        .as("click_count"),
    })
    .from(schema.grabs)
    .leftJoin(schema.clicks, eq(schema.clicks.grabId, schema.grabs.id))
    .where(eq(schema.grabs.ownerCookie, owner))
    .groupBy(schema.grabs.id)
    .orderBy(sql`${schema.grabs.createdAt} DESC`);

  return Response.json({ grabs: rows });
}
