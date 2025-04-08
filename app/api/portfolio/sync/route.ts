import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * This API endpoint synchronizes property rent amounts with tenant rent amounts.
 * It ensures that the property's rentAmount matches the active tenant's rentAmount.
 */
export async function POST() {
  try {
    // Get all properties
    const properties = await prisma.property.findMany({
      include: {
        tenants: {
          where: {
            status: "active",
          },
        },
      },
    });

    const updates = [];

    // For each property, update its rentAmount based on active tenants
    for (const property of properties) {
      // If the property has active tenants, use their rentAmount
      if (property.tenants.length > 0) {
        // Use the first active tenant's rentAmount (assuming one active tenant per property)
        const activeTenant = property.tenants[0];
        
        // Update the property's occupancy and rentAmount
        updates.push(
          prisma.property.update({
            where: { id: property.id },
            data: {
              occupancy: "occupied",
              rentAmount: activeTenant.rentAmount,
            },
          })
        );
      } else if (property.occupancy === "occupied") {
        // If the property is marked as occupied but has no active tenants,
        // update its occupancy to vacant
        updates.push(
          prisma.property.update({
            where: { id: property.id },
            data: {
              occupancy: "vacant",
            },
          })
        );
      }
    }

    // Execute all updates in parallel
    await Promise.all(updates);

    // Update portfolio snapshot
    await prisma.portfolioSnapshot.create({
      data: {
        totalValue: properties.reduce((sum, property) => sum + property.value, 0),
        monthlyIncome: properties.reduce((sum, property) => {
          const activeTenant = property.tenants[0];
          return sum + (activeTenant ? activeTenant.rentAmount : 0);
        }, 0),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Portfolio synchronized successfully",
      updatedProperties: updates.length,
    });
  } catch (error) {
    console.error("Error synchronizing portfolio:", error);
    return NextResponse.json(
      { error: "Failed to synchronize portfolio", details: error.message },
      { status: 500 }
    );
  }
}
