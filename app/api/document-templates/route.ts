import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Only landlords can access document templates
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Build query
    const query: any = {
      OR: [
        { userId: user.id }, // User's own templates
        { isSystem: true }   // System templates
      ]
    };

    if (category) {
      query.category = category;
    }

    const templates = await prisma.documentTemplate.findMany({
      where: query,
      orderBy: [
        { isSystem: "desc" }, // System templates first
        { name: "asc" }
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching document templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch document templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Only landlords can create document templates
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.content || !body.category) {
      return NextResponse.json(
        { message: "Missing required fields: name, content, category" },
        { status: 400 }
      );
    }

    // Create the document template
    const template = await prisma.documentTemplate.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        content: body.content,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating document template:", error);
    return NextResponse.json(
      { error: "Failed to create document template" },
      { status: 500 }
    );
  }
} 