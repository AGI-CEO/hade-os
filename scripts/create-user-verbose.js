const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

async function createUser() {
  console.log('Creating test user...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL)
  
  try {
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    })
    
    // Check if the database is accessible
    console.log('Testing database connection...')
    const result = await prisma.$queryRaw`SELECT current_timestamp as time, current_user as user`
    console.log('Database connection successful:', result)
    
    // Create a test user
    console.log('Creating user...')
    const user = await prisma.user.create({
      data: {
        email: 'test2@example.com',
        name: 'Test User 2',
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
