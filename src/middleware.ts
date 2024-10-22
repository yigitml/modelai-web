// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define your list of routes that require authentication.
const authenticatedRoutes = [
  "/camera",
  "/prompts",
  "/saved",
  "/packs",
  "/deleted",
  "/db",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore authentication routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/db")
  ) {
    return NextResponse.next();
  }

  // Get the auth token from cookies, checking both possible names
  const token = request.cookies.get('next-auth.session-token')?.value ||
                request.cookies.get('__Secure-next-auth.session-token')?.value;

  // Check if the route is an authenticated route.
  const isAuthenticatedRoute = authenticatedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If the route requires authentication and no token is found, redirect to login.
  if (isAuthenticatedRoute && !token) {
    // Redirect to login page, preserving the original destination as a query parameter for redirect after login.
    const loginUrl = new URL("/auth/signin", request.url);
    loginUrl.searchParams.set("redirect", pathname); // Optional: redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // If a token is found but you want to validate it, you can add token validation here:
  // For example, call a backend API to validate the token or decode a JWT.

  // If the user is already logged in and trying to access public pages like login, redirect them to a protected page.
  if (pathname.startsWith("/auth") && token) {
    // Redirect logged-in users away from login/signup pages to a default authenticated page.
    return NextResponse.redirect(new URL("/camera", request.url));
  }

  // Allow the request to proceed if it passes all checks.
  return NextResponse.next();
}

// Define which routes the middleware should apply to.
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)", // Apply to all except API routes, Next.js internals, and static assets.
  ],
};
