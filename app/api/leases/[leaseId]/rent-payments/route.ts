import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { isPast, startOfDay } from "date-fns";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { leaseId: string } }
) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { leaseId } = params;

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
        (payment) =>
          (payment.status === "UPCOMING" && isPast(payment.dueDate)) ||
          (payment.status === "UNPAID" && isPast(payment.dueDate))
      )
      .map((payment) => {
        let newStatus = payment.status;
        if (payment.status === "UPCOMING") {
          newStatus = "UNPAID";
        }
        // This is a simplification. A real-world app might have a grace period.
        // For now, we'll consider any unpaid past-due payment as LATE.
        // To make the status change more distinct, let's only change UNPAID to LATE.
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
