import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
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

    // Only landlords can generate documents
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.propertyId) {
      return NextResponse.json(
        { message: "Property ID is required" },
        { status: 400 }
      );
    }

    // Get the template
    const template = await prisma.documentTemplate.findUnique({
      where: { id: params.id },
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
        { message: "Unauthorized to use this template" },
        { status: 403 }
      );
    }

    // Get property details
    const property = await prisma.property.findUnique({
      where: { id: body.propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Verify user owns the property
    if (property.userId !== user.id) {
      return NextResponse.json(
        { message: "Unauthorized to use this property" },
        { status: 403 }
      );
    }

    // Get tenant details if tenantId is provided
    let tenant = null;
    if (body.tenantId) {
      tenant = await prisma.tenant.findUnique({
        where: { id: body.tenantId },
      });

      if (!tenant || tenant.propertyId !== property.id) {
        return NextResponse.json(
          { error: "Tenant not found or not associated with property" },
          { status: 404 }
        );
      }
    }

    // Generate document content by replacing template variables
    let content = template.content;

    // Property variables
    content = content.replace(/\{PROPERTY_ADDRESS\}/g, property.address);
    content = content.replace(/\{PROPERTY_CITY\}/g, property.city);
    content = content.replace(/\{PROPERTY_STATE\}/g, property.state);
    content = content.replace(/\{PROPERTY_ZIP\}/g, property.zipCode);
    content = content.replace(/\{PROPERTY_FULL_ADDRESS\}/g, `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`);

    // Tenant variables (if tenant is provided)
    if (tenant) {
      content = content.replace(/\{TENANT_NAME\}/g, tenant.name);
      content = content.replace(/\{TENANT_EMAIL\}/g, tenant.email);
      content = content.replace(/\{TENANT_PHONE\}/g, tenant.phone);
      content = content.replace(/\{MONTHLY_RENT\}/g, tenant.rentAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    } else {
      // If no tenant, replace with property rent amount or empty
      const rentAmount = property.rentAmount || 0;
      content = content.replace(/\{TENANT_NAME\}/g, "[Tenant Name]");
      content = content.replace(/\{TENANT_EMAIL\}/g, "[Tenant Email]");
      content = content.replace(/\{TENANT_PHONE\}/g, "[Tenant Phone]");
      content = content.replace(/\{MONTHLY_RENT\}/g, rentAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    }

    // Date variables
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    content = content.replace(/\{CURRENT_DATE\}/g, currentDate);
    content = content.replace(/\{TODAY\}/g, currentDate);

    // Landlord variables
    content = content.replace(/\{LANDLORD_NAME\}/g, user.name || "[Landlord Name]");
    content = content.replace(/\{LANDLORD_EMAIL\}/g, user.email);

    // Custom variables from request body
    if (body.customVariables) {
      Object.entries(body.customVariables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{${key.toUpperCase()}\\}`, 'g');
        content = content.replace(regex, String(value));
      });
    }

    // Generate document title
    const documentTitle = body.title || `${template.name} - ${property.address}${tenant ? ` - ${tenant.name}` : ''}`;

    // Create document content as HTML (for now, could extend to PDF generation)
    const documentContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${documentTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1, h2, h3 { color: #333; }
        .header { text-align: center; margin-bottom: 40px; }
        .content { max-width: 800px; margin: 0 auto; }
        .signature-line { margin-top: 50px; border-top: 1px solid #333; width: 300px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="content">
        ${content.replace(/\n/g, '<br>')}
    </div>
    <div class="footer">
        Generated on ${currentDate}
    </div>
</body>
</html>`;

    // If saveToDocuments is true, save as a document in the system
    let savedDocument = null;
    if (body.saveToDocuments !== false) {
      // Create a simple text file content for storage
      const fileContent = content;
      
      // For now, we'll store as a text document with HTML content
      // In a real implementation, you might want to generate a PDF or use a file storage service
      savedDocument = await prisma.document.create({
        data: {
          name: documentTitle + ".html",
          description: `Generated from template: ${template.name}`,
          fileUrl: "data:text/html;base64," + Buffer.from(documentContent).toString('base64'),
          fileType: "html",
          fileSize: documentContent.length,
          category: template.category,
          isShared: body.shareWithTenant || false,
          propertyId: property.id,
          tenantId: tenant?.id,
        },
      });
    }

    const response = {
      title: documentTitle,
      content: documentContent,
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
      },
      property: {
        id: property.id,
        address: property.address,
        city: property.city,
        state: property.state,
      },
      tenant: tenant ? {
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
      } : null,
      savedDocument: savedDocument ? {
        id: savedDocument.id,
        name: savedDocument.name,
      } : null,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
} 