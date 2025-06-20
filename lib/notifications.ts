import { PrismaClient, NotificationType } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Helper to create a notification record.
 */
export async function createNotification({
  userId,
  message,
  type,
  propertyId,
  tenantId,
  relatedEntityType,
  relatedEntityId,
}: {
  userId: string;
  message: string;
  type: NotificationType;
  propertyId?: string;
  tenantId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        message,
        type,
        propertyId,
        tenantId,
        relatedEntityType,
        relatedEntityId,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
} 