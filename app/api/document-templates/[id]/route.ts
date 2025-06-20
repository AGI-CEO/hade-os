import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const template = await prisma.documentTemplate.findUnique({
      where: { id: params.id },
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

    if (!template) {
      return NextResponse.json(
        { error: "Document template not found" },
        { status: 404 }
      );
    }

    // Check if user can access this template (own template or system template)
    if (!template.isSystem && template.userId !== user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching document template:", error);
    return NextResponse.json(
      { error: "Failed to fetch document template" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Only landlords can update document templates
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const template = await prisma.documentTemplate.findUnique({
      where: { id: params.id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Document template not found" },
        { status: 404 }
      );
    }

    // Only template owner can update (cannot update system templates)
    if (template.isSystem || template.userId !== user.id) {
      return NextResponse.json(
        { message: "Cannot update this template" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields if provided
    if (body.name === "" || body.content === "" || body.category === "") {
      return NextResponse.json(
        { message: "Name, content, and category cannot be empty" },
        { status: 400 }
      );
    }

    const updatedTemplate = await prisma.documentTemplate.update({
      where: { id: params.id },
      data: {
        name: body.name || template.name,
        description: body.description !== undefined ? body.description : template.description,
        category: body.category || template.category,
        content: body.content || template.content,
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

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error("Error updating document template:", error);
    return NextResponse.json(
      { error: "Failed to update document template" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Only landlords can delete document templates
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const template = await prisma.documentTemplate.findUnique({
      where: { id: params.id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Document template not found" },
        { status: 404 }
      );
    }

    // Only template owner can delete (cannot delete system templates)
    if (template.isSystem || template.userId !== user.id) {
      return NextResponse.json(
        { message: "Cannot delete this template" },
        { status: 403 }
      );
    }

    await prisma.documentTemplate.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting document template:", error);
    return NextResponse.json(
      { error: "Failed to delete document template" },
      { status: 500 }
    );
  }
} 