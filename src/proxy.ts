import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const access = request.cookies.get("access")?.value;
  const pathname = request.nextUrl.pathname;

  // Allow access to login page for non-authenticated users
  if (pathname === "/login") {
    // If user has token and is on login page, redirect based on access level
    if (token) {
      if (access === "Admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    // If no token, allow access to login page
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token || !access) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is Admin but not on an admin route, redirect to admin
  if (token && access === "Admin" && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If user is not Admin but trying to access admin, redirect to home
  if (token && access !== "Admin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
// Define which paths this middleware should run on
// export const config = {
//   matcher: ["/", "/relatives", "/tree", "/add_edit/:path*", "/terms", "/not-found"],
// };