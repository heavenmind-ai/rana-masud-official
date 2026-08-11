import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Ignore static assets, _next internal requests, admin routes, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/content") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Intercept legacy spam / e-commerce paths (/detail/*, /ctg/*) and 301-redirect to homepage
  const lowerPath = pathname.toLowerCase();
  if (
    lowerPath.startsWith("/detail/") ||
    lowerPath.startsWith("/detail") ||
    lowerPath.startsWith("/ctg/") ||
    lowerPath.startsWith("/ctg")
  ) {
    const cleanUrl = new URL("/", request.url);
    return NextResponse.redirect(cleanUrl, 301);
  }

  // Check for invalid query parameters or item crawl traps (e.g. ?items/..., ?ctgItemCd=...)
  if (search) {
    const rawQuery = search.toLowerCase();
    if (
      rawQuery.includes("items/") ||
      rawQuery.includes("items=") ||
      rawQuery.includes("items") ||
      rawQuery.includes("ctg") ||
      rawQuery.includes("ctgitemcd")
    ) {
      // 301 Permanent Redirect to clean canonical URL path without query params
      const cleanUrl = new URL(pathname, request.url);
      cleanUrl.search = "";
      return NextResponse.redirect(cleanUrl, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
