import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { rentPaymentId: string } }
) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { rentPaymentId } = params;
  const { amount, date, description, categoryId } = await request.json();

  if (!amount || !date || !categoryId) {
    return NextResponse.json(
      { error: "Missing required fields: amount, date, and categoryId" },
      { status: 400 }
    );
  }

  try {
    // 1. Verify the rent payment exists and belongs to the user
    const rentPayment = await prisma.rentPayment.findUnique({
      where: { id: rentPaymentId },
      include: {
        lease: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!rentPayment || rentPayment.lease.property.userId !== user.id) {
      return NextResponse.json(
        { error: "Rent payment not found or access denied" },
        { status: 404 }
      );
    }

    if (rentPayment.status === "PAID") {
      return NextResponse.json(
        { error: "This rent payment has already been paid." },
        { status: 400 }
      );
    }

    // 2. Create the income transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        date: new Date(date),
        description: description || `Rent for ${rentPayment.lease.title}`,
        type: "INCOME",
        propertyId: rentPayment.lease.propertyId,
        categoryId,
      },
    });

    // 3. Update the rent payment to link the transaction and set status to PAID
    const updatedRentPayment = await prisma.rentPayment.update({
      where: { id: rentPaymentId },
      data: {
        status: "PAID",
        transactionId: transaction.id,
      },
    });

    return NextResponse.json(updatedRentPayment);
  } catch (error) {
    console.error("Error recording rent payment:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
