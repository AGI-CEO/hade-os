import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.userType !== "tenant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if preferences exist, if not, return defaults
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: user.id },
    });

    if (!preferences) {
      // Create default preferences
      preferences = await prisma.userPreferences.create({
        data: {
          userId: user.id,
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          rentReminders: true,
          maintenanceUpdates: true,
          documentSharing: true,
          marketingEmails: false,
          theme: "system",
          language: "en",
        },
      });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.userType !== "tenant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        emailNotifications: body.emailNotifications,
        smsNotifications: body.smsNotifications,
        pushNotifications: body.pushNotifications,
        rentReminders: body.rentReminders,
        maintenanceUpdates: body.maintenanceUpdates,
        documentSharing: body.documentSharing,
        marketingEmails: body.marketingEmails,
        theme: body.theme,
        language: body.language,
      },
      create: {
        userId: user.id,
        emailNotifications: body.emailNotifications ?? true,
        smsNotifications: body.smsNotifications ?? false,
        pushNotifications: body.pushNotifications ?? true,
        rentReminders: body.rentReminders ?? true,
        maintenanceUpdates: body.maintenanceUpdates ?? true,
        documentSharing: body.documentSharing ?? true,
        marketingEmails: body.marketingEmails ?? false,
        theme: body.theme ?? "system",
        language: body.language ?? "en",
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
} 