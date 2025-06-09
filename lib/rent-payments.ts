import { PrismaClient, Lease } from "@prisma/client";
import { addMonths, getMonth, getYear, isBefore, startOfDay } from "date-fns";

const prisma = new PrismaClient();

/**
 * Generates the schedule of rent payments for the entire duration of a lease.
 * This function should be called when a lease becomes active.
 * It creates a RentPayment record for each month of the lease term.
 *
 * @param leaseId The ID of the lease to generate payments for.
 * @returns A promise that resolves when all rent payments have been created.
 */
export async function generateRentPaymentsForLease(
  leaseId: string
): Promise<void> {
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
  });

  if (!lease) {
    throw new Error("Lease not found");
  }

  // Clear any existing upcoming payments to prevent duplicates if this is re-run
  await prisma.rentPayment.deleteMany({
    where: {
      leaseId: lease.id,
      status: "UPCOMING",
    },
  });

  let currentDueDate = startOfDay(lease.startDate);
  const leaseEndDate = startOfDay(lease.endDate);

  const paymentsToCreate = [];

  while (isBefore(currentDueDate, leaseEndDate)) {
    paymentsToCreate.push({
      amountDue: lease.monthlyRent,
      dueDate: currentDueDate,
      status: "UPCOMING",
      leaseId: lease.id,
      tenantId: lease.tenantId,
    });

    // Move to the next month's due date
    currentDueDate = addMonths(currentDueDate, 1);
  }

  if (paymentsToCreate.length > 0) {
    await prisma.rentPayment.createMany({
      data: paymentsToCreate,
      skipDuplicates: true, // Just in case, though the delete should prevent this
    });
  }
}
