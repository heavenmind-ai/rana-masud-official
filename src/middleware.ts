import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Only run logic if there is a query string that could be an item crawl trap
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
     * Match root and public pages only, skipping static files, images, APIs, and admin routes
     */
    "/((?!_next/static|_next/image|content|api|admin|favicon.ico|.*\\..*).*)",
  ],
};

