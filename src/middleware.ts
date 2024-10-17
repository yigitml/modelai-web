import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token && request.nextUrl.pathname === "/auth/signin") {
    return NextResponse.redirect(new URL("/camera", request.url));
  }

  const authenticatedRoutes = [
    "/camera",
    "/prompts",
    "/saved",
    "/packs",
    "/deleted",
  ];
  if (
    !token &&
    authenticatedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route),
    )
  ) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)"],
};
