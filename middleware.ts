import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, isProtectedRoute, isRestrictedRoute } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("Middleware running for path:", pathname);

  // Get the authentication token from the cookies
  const authToken = request.cookies.get(AUTH_COOKIE)?.value;
  console.log("Auth token:", authToken);

  // Check if the route requires authentication
  if (isProtectedRoute(pathname)) {
    // If there's no auth token, redirect to login
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If there is an auth token, fetch the user to check their type
    try {
      // In a real app, you would verify the token
      // For simplicity, we're using the token as the user ID
      const apiUrl = `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
      }/api/auth/me`;
      console.log("Fetching user from:", apiUrl);
      const response = await fetch(apiUrl, {
        headers: {
          Cookie: `${AUTH_COOKIE}=${authToken}`,
        },
      });
      console.log("Response status:", response.status);

      if (!response.ok) {
        // If the token is invalid, redirect to login
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }

      const user = await response.json();

      // Check if the user is trying to access a restricted route
      if (isRestrictedRoute(pathname, user.userType)) {
        // Redirect to the appropriate dashboard based on user type
        if (user.userType === "landlord") {
          return NextResponse.redirect(new URL("/", request.url));
        } else {
          return NextResponse.redirect(new URL("/connect", request.url));
        }
      }
    } catch (error) {
      console.error("Middleware error:", error);
      // If there's an error, redirect to login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If the user is already logged in and trying to access login page, redirect to appropriate dashboard
  if (pathname === "/login" && authToken) {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/api/auth/me`,
        {
          headers: {
            Cookie: `${AUTH_COOKIE}=${authToken}`,
          },
        }
      );

      if (response.ok) {
        const user = await response.json();

        if (user.userType === "landlord") {
          return NextResponse.redirect(new URL("/", request.url));
        } else {
          return NextResponse.redirect(new URL("/connect", request.url));
        }
      }
    } catch (error) {
      console.error("Middleware error:", error);
      // If there's an error, continue to the login page
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
     */
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
