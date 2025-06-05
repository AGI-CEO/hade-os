import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Corrected import path
import prisma from "@/lib/prisma"; // Adjust path if your prisma client is elsewhere

// PATCH /api/notifications/{notificationId}/read - Mark a specific notification as read
export async function PATCH(
  request: Request,
  { params }: { params: { notificationId: string } }
) {
  const session = await getServerSession(authOptions);
  const { notificationId } = params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!notificationId) {
    return NextResponse.json(
      { error: "Notification ID is required" },
      { status: 400 }
    );
  }

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    // Ensure the user owns this notification
    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}
