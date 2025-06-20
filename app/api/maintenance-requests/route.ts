import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, priority, propertyId } = body;

    if (!title || !description || !priority || !propertyId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // If user is a tenant, verify they are associated with the property
    if (user.userType === "tenant") {
      const tenant = await prisma.tenant.findFirst({
        where: {
          userId: user.id,
          propertyId,
        },
      });

      if (!tenant) {
        return NextResponse.json(
          {
            message:
              "You are not authorized to create maintenance requests for this property",
          },
          { status: 403 }
        );
      }
    }

    // Create the maintenance request
    const maintenanceRequest = await prisma.maintenanceRequest.create({
      data: {
        title,
        description,
        status: "pending",
        priority,
        propertyId,
      },
    });

    // ---------------------------------------------
    // Notification logic
    // ---------------------------------------------
    try {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: { tenants: true },
      });

      if (property) {
        const { userId: landlordUserId, tenants } = property;

        // If the request was created by a tenant, notify the landlord
        if (user.userType === "tenant" && landlordUserId) {
          const { createNotification } = await import("@/lib/notifications");
          await createNotification({
            userId: landlordUserId,
            message: `New maintenance request \"${title}\" created by tenant`,
            type: "MAINTENANCE_NEW_REQUEST" as any,
            propertyId,
            relatedEntityType: "MaintenanceRequest",
            relatedEntityId: maintenanceRequest.id,
          });
        }

        // If the request was created by landlord, notify tenants (with linked user accounts)
        if (user.userType === "landlord" && tenants.length > 0) {
          const { createNotification } = await import("@/lib/notifications");
          await Promise.all(
            tenants
              .filter((t: any) => t.userId)
              .map((tenant: any) =>
                createNotification({
                  userId: tenant.userId!,
                  message: `A new maintenance request \"${title}\" has been created for your property`,
                  type: "MAINTENANCE_NEW_REQUEST" as any,
                  propertyId,
                  tenantId: tenant.id,
                  relatedEntityType: "MaintenanceRequest",
                  relatedEntityId: maintenanceRequest.id,
                })
              )
          );
        }
      }
    } catch (notificationError) {
      console.error("Failed to create maintenance notification:", notificationError);
    }

    return NextResponse.json(maintenanceRequest);
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
