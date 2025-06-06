import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// PATCH /api/transactions/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { amount, date, description, type, categoryId } = await request.json();

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: id,
        property: {
          userId: session.user.id,
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found or access denied" },
        { status: 404 }
      );
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount,
        date: date ? new Date(date) : undefined,
        description,
        type,
        categoryId,
      },
    });
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: id,
        property: {
          userId: session.user.id,
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.transaction.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
