// middleware.ts
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

/**
 * Public routes that do NOT require authentication
 * Everything else is protected by default
 */
const PUBLIC_ROUTES = ["/api/auth", "/signIn", "/signUp"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore Next internals & static files
  if (
    pathname.startsWith("/_next") ||
    (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) ||
    pathname.match(/\.(png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const sessionCookie = getSessionCookie(request);

  // 🔒 Protected route → no session → redirect
  if (!isPublicRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/signIn", request.url));
  }

  // 🚫 Logged-in user visiting auth pages → redirect to dashboard
  if (
    isPublicRoute &&
    sessionCookie &&
    ["/signIn", "/signUp"].includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
