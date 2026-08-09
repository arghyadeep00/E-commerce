import { NextResponse } from "next/dist/server/web/spec-extension/response";
import type { NextRequest } from "next/dist/server/web/spec-extension/request";

export function middleware(request: NextRequest) {
  // Check if there is any token in the cookies
  const token = request.cookies.get("token")?.value;
  
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  if (!token && !isLoginPage) {
    // Redirect to login if accessing a protected route without a token
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isLoginPage) {
    // Redirect to dashboard if trying to access login while already authenticated
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
