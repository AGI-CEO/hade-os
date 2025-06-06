import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

// POST a new message to a maintenance request
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { content } = await req.json();

  if (!content) {
    return NextResponse.json(
      { error: "Message content cannot be empty" },
      { status: 400 }
    );
  }

  try {
    const maintenanceRequest = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!maintenanceRequest) {
      return NextResponse.json(
        { error: "Maintenance request not found" },
        { status: 404 }
      );
    }

    // For now, only the property owner can post messages.
    // Tenant authorization can be added later.
    if (maintenanceRequest.property.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const newMessage = await prisma.maintenanceMessage.create({
      data: {
        content: content,
        maintenanceRequestId: id,
        userId: user.id,
      },
    });

    const messageWithUser = await prisma.maintenanceMessage.findUnique({
      where: { id: newMessage.id },
      include: { user: true },
    });

    return NextResponse.json(messageWithUser);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
