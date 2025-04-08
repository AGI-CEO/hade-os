import { NextResponse } from "next/server"
import { AUTH_COOKIE } from "@/lib/auth"

export async function POST() {
  // Create a response
  const response = NextResponse.json({ message: "Logged out successfully" })
  
  // Clear the authentication cookie
  response.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0, // Expire immediately
  })
  
  return response
}
