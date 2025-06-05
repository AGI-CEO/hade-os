import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Corrected import path
import prisma from "@/lib/prisma"; // Adjust path if your prisma client is elsewhere

// GET /api/notifications - Fetch notifications for the logged-in user
export async function GET(request: Request) {
  const session = await getServerSession(authOptions); // Reverted: Removed temporary 'as any' cast

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limiting the number of notifications returned
    });
    return NextResponse.json(notifications);
  } catch (error) {
    // It's good practice to avoid logging the raw error in production to the client
    // but log it on the server side.
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
