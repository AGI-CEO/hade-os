import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// GET /api/lease-templates - Get all lease templates
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Only landlords can access lease templates
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    const templates = await prisma.leaseTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching lease templates:", error);
    return NextResponse.json(
      { message: "Failed to fetch lease templates" },
      { status: 500 }
    );
  }
}

// POST /api/lease-templates - Create a new lease template
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Only landlords can create lease templates
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.content) {
      return NextResponse.json(
        { message: "Name and content are required" },
        { status: 400 }
      );
    }
    
    const template = await prisma.leaseTemplate.create({
      data: {
        name: body.name,
        description: body.description || "",
        content: body.content,
        userId: user.id,
      },
    });
    
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating lease template:", error);
    return NextResponse.json(
      { message: "Failed to create lease template" },
      { status: 500 }
    );
  }
}
