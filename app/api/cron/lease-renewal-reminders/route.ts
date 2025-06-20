import prisma from "@/lib/prisma";
import { addDays, startOfDay } from "date-fns";
import { NextResponse } from "next/server";

// This cron route generates lease renewal reminders for leases that are expiring soon.
// It should be scheduled to run once per day via Vercel Cron or a similar scheduler.
export async function POST() {
  try {
    const today = startOfDay(new Date());
    // Remind 60 days before lease end date. Adjust as needed.
    const sixtyDaysOut = addDays(today, 60);

    // Find active leases ending within the next 60 days
    const leasesExpiringSoon = await prisma.lease.findMany({
      where: {
        status: "active",
        endDate: { gte: today, lte: sixtyDaysOut },
      },
      include: {
        property: {
          select: { id: true, userId: true, address: true },
        },
        tenant: {
          include: { user: true },
        },
      },
    });

    const createData: Parameters<typeof prisma.notification.create>[0][] = [];

    const queue = (
      userId: string | null | undefined,
      message: string,
      leaseId: string,
      tenantId: string,
      propertyId: string,
    ) => {
      if (!userId) return;
      createData.push({
        data: {
          userId,
          message,
          type: "LEASE_RENEWAL_REMINDER" as any,
          relatedEntityType: "Lease",
          relatedEntityId: leaseId,
          tenantId,
          propertyId,
        },
      });
    };

    const fmt = (d: Date) => d.toLocaleDateString();

    for (const lease of leasesExpiringSoon) {
      const msg = `Lease for tenant ${lease.tenant.name} at property ending on ${fmt(
        lease.endDate,
      )}. Consider renewal.`;
      // Notify landlord
      queue(lease.property.userId, msg, lease.id, lease.tenantId, lease.property.id);
      // Notify tenant if they have a linked user account
      queue(
        (lease.tenant as any).userId,
        `Your lease is set to expire on ${fmt(lease.endDate)}. Please contact your landlord about renewal options.`,
        lease.id,
        lease.tenantId,
        lease.property.id,
      );
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
    console.error("lease-renewal-reminders", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
} 