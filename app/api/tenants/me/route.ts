import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      )
    }
    
    // Check if the user is a tenant
    if (user.userType !== "tenant") {
      return NextResponse.json(
        { message: "User is not a tenant" },
        { status: 403 }
      )
    }
    
    // Get the tenant data
    const tenant = await prisma.tenant.findFirst({
      where: { userId: user.id },
      include: {
        property: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            image: true,
            rentAmount: true,
            rentDue: true,
          },
        },
      },
    })
    
    if (!tenant) {
      return NextResponse.json(
        { message: "Tenant data not found" },
        { status: 404 }
      )
    }
    
    // Get maintenance requests for the tenant's property
    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      where: { propertyId: tenant.propertyId },
      orderBy: { createdAt: "desc" },
    })
    
    // Combine the data
    const tenantData = {
      ...tenant,
      maintenanceRequests,
    }
    
    return NextResponse.json(tenantData)
  } catch (error) {
    console.error("Error getting tenant data:", error)
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    )
  }
}
