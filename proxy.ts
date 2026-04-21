import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 renamed Middleware to Proxy. This file runs before every request
// (excluding the matcher exclusions below) and sets a persistent cookie UUID
// so we can scope "your grabs" to the creator's browser without auth.
export function proxy(request: NextRequest) {
  const res = NextResponse.next();
  if (!request.cookies.get("ipwiz_id")) {
    const id = crypto.randomUUID();
    res.cookies.set("ipwiz_id", id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 2,
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
