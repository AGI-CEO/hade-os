import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Count the number of properties in the database
    const propertyCount = await prisma.property.count()
    
    // Count the number of users in the database
    const userCount = await prisma.user.count()
    
    // Count the number of maintenance requests in the database
    const maintenanceRequestCount = await prisma.maintenanceRequest.count()
    
    return NextResponse.json({
      propertyCount,
      userCount,
      maintenanceRequestCount,
      message: 'Prisma is working correctly!'
    })
  } catch (error) {
    console.error('Error accessing database:', error)
    return NextResponse.json(
      { error: 'Failed to access database', details: error },
      { status: 500 }
    )
  }
}
