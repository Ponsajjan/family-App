import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { updateToken } from "./utils/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const access = request.cookies.get("access")?.value;
  const pathname = request.nextUrl.pathname;

  // If no token, redirect to login
  if (!token || !access) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if the token is close to expiring and refresh it if necessary
  // await updateToken(request);
  
  // If user is Admin but not on an admin route, redirect to admin
  if (access === "Admin" && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If user is not Admin but trying to access admin, redirect to home
  if (access !== "Admin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
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