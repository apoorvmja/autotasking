import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, decodeAuthCookie } from "@/lib/auth";

function isAdminBasicAuthValid(header: string | null) {
  if (!header || !header.startsWith("Basic ")) return false;
  const encoded = header.replace("Basic ", "").trim();
  let decoded = "";
  try {
    if (typeof atob === "function") {
      decoded = atob(encoded);
    } else {
      decoded = Buffer.from(encoded, "base64").toString("utf8");
    }
  } catch {
    return false;
  }
  return decoded === "admin:admin";
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const hasAdminAuth = isAdminBasicAuthValid(request.headers.get("authorization"));
  if (hasAdminAuth) {
    return NextResponse.next();
  }

  const isAdminRoute =
    path.startsWith("/admin") || path.startsWith("/api/interns") || path.startsWith("/api/admin-summary");
  if (isAdminRoute) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic realm=\"Admin\"" },
    });
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (decodeAuthCookie(token)) {
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
  matcher: [
    "/tasks/:path*",
    "/admin/:path*",
    "/api/daily-tasks",
    "/api/reddit-prompt",
    "/api/reddit-status",
    "/api/facebook-status",
    "/api/youtube-status",
    "/api/youtube-videos",
    "/api/interns",
    "/api/tasks",
    "/api/admin-summary",
  ],
};
