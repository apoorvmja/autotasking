import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, getAuthToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (token === getAuthToken()) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/tasks/:path*", "/admin/:path*", "/api/daily-tasks", "/api/reddit-prompt"],
};
