import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const access = request.cookies.get("access")?.value;

  if (!token || !access) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (access === "SuperAdmin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (access === "Moderator") {
    return NextResponse.redirect(new URL("/moderator", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
// Define which paths this middleware should run on
// export const config = {
//   matcher: ["/", "/relatives", "/tree", "/add_edit/:path*", "/terms", "/not-found"],
// };