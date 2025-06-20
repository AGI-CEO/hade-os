import prisma from "@/lib/prisma";
import { addDays, startOfDay } from "date-fns";

export async function POST() {
  try {
    const today = startOfDay(new Date());
    const threeDaysOut = addDays(today, 3);

    // Fetch upcoming (due within 3 days) and overdue rent payments
    const [upcoming, overdue] = await Promise.all([
      prisma.rentPayment.findMany({
        where: {
          status: "UPCOMING",
          dueDate: { gte: today, lte: threeDaysOut },
        },
        include: {
          tenant: { include: { user: true } },
          lease: { include: { property: { select: { id: true, userId: true } } } },
        },
      }),
      prisma.rentPayment.findMany({
        where: {
          status: "UNPAID",
          dueDate: { lt: today },
        },
        include: {
          tenant: { include: { user: true } },
          lease: { include: { property: { select: { id: true, userId: true } } } },
        },
      }),
    ]);

    const createData = [] as Parameters<typeof prisma.notification.create>[0][];

    const queue = (
      userId: string | null | undefined,
      message: string,
      type: "RENT_DUE" | "RENT_OVERDUE",
      rentPaymentId: string,
      tenantId: string,
      propertyId: string | null | undefined,
    ) => {
      if (!userId) return;
      createData.push({
        data: {
          userId,
          message,
          type,
          relatedEntityType: "RentPayment",
          relatedEntityId: rentPaymentId,
          tenantId,
          propertyId: propertyId ?? undefined,
        },
      });
    };

    const fmt = (d: Date) => d.toLocaleDateString();

    for (const p of upcoming) {
      const msg = `Rent of $${p.amountDue.toFixed(2)} is due on ${fmt(p.dueDate)}.`;
      queue(p.tenant.userId, `Reminder: ${msg}`, "RENT_DUE", p.id, p.tenantId, p.lease.property.id);
      queue((p.lease.property as any).userId, `Tenant ${p.tenant.name}'s ${msg}`, "RENT_DUE", p.id, p.tenantId, p.lease.property.id);
    }

    for (const p of overdue) {
      const msg = `Rent of $${p.amountDue.toFixed(2)} was due on ${fmt(p.dueDate)} and is now overdue.`;
      queue(p.tenant.userId, msg, "RENT_OVERDUE", p.id, p.tenantId, p.lease.property.id);
      queue((p.lease.property as any).userId, `Tenant ${p.tenant.name}'s ${msg}`, "RENT_OVERDUE", p.id, p.tenantId, p.lease.property.id);
    }

    for (const data of createData) {
      try {
        await prisma.notification.create(data);
      } catch (e) {
        // Ignore duplicates or errors for now
      }
    }

    return NextResponse.json({ created: createData.length });
  } catch (err) {
    console.error("rent-due-notifications", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
} 
import { NextResponse } from "next/server";
 