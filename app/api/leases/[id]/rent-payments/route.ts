import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { isPast, startOfDay } from "date-fns";

const prisma = new PrismaClient();

// GET /api/leases/[id]/rent-payments - list rent payments for a lease
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leaseId = params.id;

  try {
    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
      select: { property: { select: { userId: true } } },
    });

    if (!lease || lease.property.userId !== user.id) {
      return NextResponse.json(
        { error: "Lease not found or access denied" },
        { status: 404 }
      );
    }

    const rentPayments = await prisma.rentPayment.findMany({
      where: { leaseId },
      orderBy: { dueDate: "asc" },
    });

    // Dynamically update statuses for overdue payments
    const today = startOfDay(new Date());
    const updatePromises = rentPayments
      .filter(
        (payment: any) =>
          (payment.status === "UPCOMING" && isPast(payment.dueDate)) ||
          (payment.status === "UNPAID" && isPast(payment.dueDate))
      )
      .map((payment: any) => {
        let newStatus = payment.status;
        if (payment.status === "UPCOMING") {
          newStatus = "UNPAID";
        }
        if (payment.status === "UNPAID") {
          newStatus = "LATE";
        }

        return prisma.rentPayment.update({
          where: { id: payment.id },
          data: { status: newStatus },
        });
      });

    await Promise.all(updatePromises);

    const finalPayments = await prisma.rentPayment.findMany({
      where: { leaseId },
      orderBy: { dueDate: "asc" },
      include: {
        transaction: true,
      },
    });

    return NextResponse.json(finalPayments);
  } catch (error) {
    console.error("Error fetching rent payments:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 