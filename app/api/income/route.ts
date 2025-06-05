import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// GET /api/income - Get all income entries
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build query filters
    const query: any = {};
    
    if (propertyId) {
      query.propertyId = propertyId;
    }
    
    if (category) {
      query.category = category;
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

    const incomeEntries = await prisma.income.findMany({
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
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(incomeEntries);
  } catch (error) {
    console.error("Error fetching income entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch income entries" },
      { status: 500 }
    );
  }
}

// POST /api/income - Create a new income entry
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
    
    // Create new income entry
    const newIncome = await prisma.income.create({
      data: {
        amount: parseFloat(body.amount),
        date: new Date(body.date),
        category: body.category,
        description: body.description || null,
        recurring: body.recurring || false,
        propertyId: body.propertyId,
      },
    });
    
    return NextResponse.json(newIncome, { status: 201 });
  } catch (error) {
    console.error("Error creating income entry:", error);
    return NextResponse.json(
      { error: "Failed to create income entry" },
      { status: 500 }
    );
  }
}
