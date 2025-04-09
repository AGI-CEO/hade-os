import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Session token name
export const AUTH_COOKIE = "hade_auth_token";

// Function to get the current user from the session
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    console.log("Auth token in getCurrentUser:", token);

    if (!token) {
      return null;
    }

    // In a real app, you would verify the token (JWT, etc.)
    // For simplicity, we're just using the token as the user ID
    const user = await prisma.user.findUnique({
      where: { id: token },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Function to check if a route is protected
export function isProtectedRoute(pathname: string) {
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

// Function to check if a route is restricted to a specific user type
export function isRestrictedRoute(pathname: string, userType: string) {
  // Routes that are only accessible to landlords
  const landlordRoutes = [
    "/",
    "/portfolio",
    "/finances",
    "/reports",
    "/quests",
    "/prospecting",
    "/ai-tools",
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

// Function to redirect based on user type
export function redirectBasedOnUserType(userType: string) {
  if (userType === "landlord") {
    return NextResponse.redirect(
      new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001")
    );
  } else {
    return NextResponse.redirect(
      new URL(
        "/connect",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
      )
    );
  }
}
