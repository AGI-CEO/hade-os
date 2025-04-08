const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

async function addProperty() {
  console.log('Adding test property...')
  
  try {
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    })
    
    // First, ensure we have a user
    const userId = "00000000-0000-0000-0000-000000000000"
    
    let user
    try {
      user = await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: "demo@example.com",
          name: "Demo User",
          password: "password123", // In a real app, this would be hashed
          role: "user",
        },
      })
      console.log('User found or created:', user)
    } catch (userError) {
      console.error('Error ensuring user exists:', userError)
      throw userError
    }
    
    // Now create a property
    const property = await prisma.property.create({
      data: {
        address: "123 Test St",
        city: "Test City",
        state: "TX",
        zipCode: "12345",
        image: "https://example.com/image.jpg",
        value: 450000,
        occupancy: "vacant",
        userId: userId,
      },
    })
    
    console.log('Property created successfully:', property)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error adding property:', error.message)
    console.error('Error details:', error)
  }
}

addProperty()
