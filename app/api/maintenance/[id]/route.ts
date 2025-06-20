import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

// GET a single maintenance request by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const maintenanceRequest = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: {
        property: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!maintenanceRequest) {
      return NextResponse.json(
        { error: "Maintenance request not found" },
        { status: 404 }
      );
    }

    if (maintenanceRequest.property.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(maintenanceRequest);
  } catch (error) {
    console.error("Error fetching maintenance request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH to update a maintenance request
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();

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

    if (maintenanceRequest.property.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedMaintenanceRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        status: body.status,
        cost: body.cost,
        vendorName: body.vendorName,
        vendorContact: body.vendorContact,
        notes: body.notes,
        completedDate: body.completedDate,
      },
    });

    // -------------------------------------------------
    // Notification logic for status change
    // -------------------------------------------------
    try {
      if (maintenanceRequest.status !== body.status) {
        // fetch property tenants with users
        const propertyWithTenants = await prisma.property.findUnique({
          where: { id: maintenanceRequest.propertyId },
          include: { tenants: true },
        });

        if (propertyWithTenants) {
          const { tenants } = propertyWithTenants;
          const { createNotification } = await import("@/lib/notifications");
          const statusMsg = `Maintenance request \"${maintenanceRequest.title}\" status updated to ${body.status}`;

          // Notify tenants who have user accounts
          await Promise.all(
            tenants
              .filter((t: any) => t.userId)
              .map((tenant: any) =>
                createNotification({
                  userId: tenant.userId!,
                  message: statusMsg,
                  type: "MAINTENANCE_STATUS_UPDATE" as any,
                  propertyId: maintenanceRequest.propertyId,
                  tenantId: tenant.id,
                  relatedEntityType: "MaintenanceRequest",
                  relatedEntityId: maintenanceRequest.id,
                })
              )
          );
        }
      }
    } catch (notificationError) {
      console.error("Failed to create maintenance status notification:", notificationError);
    }

    return NextResponse.json(updatedMaintenanceRequest);
  } catch (error) {
    console.error("Error updating maintenance request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE a maintenance request
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

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

    if (maintenanceRequest.property.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // First, delete all messages associated with the request
    await prisma.maintenanceMessage.deleteMany({
      where: { maintenanceRequestId: id },
    });

    // Then, delete the request itself
    await prisma.maintenanceRequest.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Maintenance request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting maintenance request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
