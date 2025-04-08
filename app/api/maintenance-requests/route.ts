import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { title, description, priority, propertyId } = body
    
    if (!title || !description || !priority || !propertyId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // If user is a tenant, verify they are associated with the property
    if (user.userType === "tenant") {
      const tenant = await prisma.tenant.findFirst({
        where: {
          userId: user.id,
          propertyId,
        },
      })
      
      if (!tenant) {
        return NextResponse.json(
          { message: "You are not authorized to create maintenance requests for this property" },
          { status: 403 }
        )
      }
    }
    
    // Create the maintenance request
    const maintenanceRequest = await prisma.maintenanceRequest.create({
      data: {
        title,
        description,
        status: "pending",
        priority,
        propertyId,
      },
    })
    
    return NextResponse.json(maintenanceRequest)
  } catch (error) {
    console.error("Error creating maintenance request:", error)
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    )
  }
}
