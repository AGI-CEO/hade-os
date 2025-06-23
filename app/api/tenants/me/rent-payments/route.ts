import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.userType !== "tenant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { userId: user.id },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant profile not found" },
        { status: 404 }
      );
    }

    const rentPayments = await prisma.rentPayment.findMany({
      where: { tenantId: tenant.id },
      include: {
        transaction: {
          select: {
            id: true,
            date: true,
            description: true,
            amount: true,
          },
        },
        lease: {
          select: {
            id: true,
            title: true,
            property: {
              select: {
                address: true,
                city: true,
                state: true,
                zipCode: true,
              },
            },
          },
        },
      },
      orderBy: {
        dueDate: "desc",
      },
    });

    return NextResponse.json(rentPayments);
  } catch (error) {
    console.error("Error fetching rent payments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
