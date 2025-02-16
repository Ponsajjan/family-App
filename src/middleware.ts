// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export default function middleWare(request: NextRequest) {
    // if (request.nextUrl.pathname === "/") {
        // return NextResponse.redirect(new URL("/", request.url));
    //     return NextResponse.rewrite(new URL("/admin", request.url));
    // }
    // return NextResponse.redirect(new URL("/relatives", request.url));
// }

// export const config = {
//     matcher: "/profile",
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Define which paths this middleware should run on
export const config = {
  matcher: ["/", "/relatives", "/admin", "/tree", "/add_edit/:path*", "/terms"],
};
