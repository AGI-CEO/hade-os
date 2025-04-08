const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

async function getTestUser() {
  console.log('Getting test user from database...')
  
  try {
    const prisma = new PrismaClient()
    
    // Try to find the test user
    const user = await prisma.user.findUnique({
      where: {
        email: 'test@example.com',
      },
    })
    
    if (user) {
      console.log('Test user found:')
      console.log(`ID: ${user.id}`)
      console.log(`Name: ${user.name}`)
      console.log(`Email: ${user.email}`)
    } else {
      console.log('Test user not found. Please run the seed script first.')
    }
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error getting test user:', error.message)
    console.error('Error details:', error)
  }
}

getTestUser()
