import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// GET /api/expenses - Get all expense entries
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const vendorId = searchParams.get("vendorId");

    // Build query filters
    const query: any = {};
    
    if (propertyId) {
      query.propertyId = propertyId;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (vendorId) {
      query.vendorId = vendorId;
    }
    
    if (startDate || endDate) {
      query.date = {};
      
      if (startDate) {
        query.date.gte = new Date(startDate);
      }
      
      if (endDate) {
        query.date.lte = new Date(endDate);
      }
    }

    const expenseEntries = await prisma.expense.findMany({
      where: query,
      include: {
        property: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(expenseEntries);
  } catch (error) {
    console.error("Error fetching expense entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense entries" },
      { status: 500 }
    );
  }
}

// POST /api/expenses - Create a new expense entry
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.amount || !body.date || !body.category || !body.propertyId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create new expense entry
    const newExpense = await prisma.expense.create({
      data: {
        amount: parseFloat(body.amount),
        date: new Date(body.date),
        category: body.category,
        description: body.description || null,
        recurring: body.recurring || false,
        propertyId: body.propertyId,
        vendorId: body.vendorId || null,
      },
    });
    
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense entry:", error);
    return NextResponse.json(
      { error: "Failed to create expense entry" },
      { status: 500 }
    );
  }
}
