import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define route protection rules
function isProtectedRoute(pathname: string) {
  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/forgot-password"];

  // API routes that don't require authentication
  if (pathname.startsWith("/api/auth/") || pathname.startsWith("/api/test")) {
    return false;
  }

  // Check if the current route is public
  return !publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// Define route restrictions based on user type
function isRestrictedRoute(pathname: string, userType: string) {
  // Routes that are only accessible to landlords
  const landlordRoutes = [
    "/dashboard",
    "/dashboard/portfolio",
    "/dashboard/tenants",
    "/dashboard/finances",
    "/dashboard/reports",
    "/dashboard/quests",
    "/dashboard/education",
    "/dashboard/prospecting",
    "/dashboard/ai-tools",
    "/dashboard/community",
    "/dashboard/veteran-resources",
  ];

  // Routes that are only accessible to tenants
  const tenantRoutes = [
    "/connect",
    "/connect/maintenance",
    "/connect/documents",
    "/connect/lease",
    "/connect/insurance",
    "/connect/settings",
  ];

  if (userType === "landlord") {
    return tenantRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
  }

  if (userType === "tenant") {
    return landlordRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("NextAuth Middleware running for path:", pathname);

  // Get the token from NextAuth.js
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("NextAuth token exists:", !!token);

  // Check if the route requires authentication
  if (isProtectedRoute(pathname)) {
    // If there's no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if the user is trying to access a restricted route
    if (
      token.userType &&
      isRestrictedRoute(pathname, token.userType as string)
    ) {
      // Redirect to the appropriate dashboard based on user type
      if (token.userType === "landlord") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/connect", request.url));
      }
    }
  }

  // If the user is already logged in and trying to access login page, redirect to appropriate dashboard
  if (pathname === "/login" && token) {
    if (token.userType === "landlord") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/connect", request.url));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - api/auth (NextAuth.js API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|api/auth).*)",
  ],
};
