const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

async function createUser() {
  console.log('Creating test user...')
  
  try {
    const prisma = new PrismaClient()
    
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123', // In a real app, this would be hashed
        role: 'user',
      },
    })
    
    console.log('User created successfully:')
    console.log(`ID: ${user.id}`)
    console.log(`Name: ${user.name}`)
    console.log(`Email: ${user.email}`)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error creating user:', error.message)
    console.error('Error details:', error)
  }
}

createUser()
