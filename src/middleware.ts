import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, verifySession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const s = await verifySession(req.cookies.get(COOKIE)?.value);
  if (!s) return NextResponse.redirect(new URL(`/staff-login?next=${encodeURIComponent(req.nextUrl.pathname)}`, req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/staff/:path*"] };
