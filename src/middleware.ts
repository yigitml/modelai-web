import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Allow access to auth-related routes
  if (pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from signin page
  if (token && pathname === "/auth/signin") {
    return NextResponse.redirect(new URL("/camera", request.url));
  }

  const authenticatedRoutes = [
    "/camera",
    "/prompts",
    "/saved",
    "/packs",
    "/deleted",
  ];

  // Redirect unauthenticated users to signin page
  if (
    !token &&
    authenticatedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
