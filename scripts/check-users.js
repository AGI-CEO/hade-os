const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

async function checkUsers() {
  console.log('Checking users in database...')
  
  try {
    const prisma = new PrismaClient()
    
    // Get all users
    const users = await prisma.user.findMany()
    
    if (users.length === 0) {
      console.log('No users found in the database.')
    } else {
      console.log(`Found ${users.length} users:`)
      users.forEach(user => {
        console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`)
      })
    }
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error checking users:', error.message)
    console.error('Error details:', error)
  }
}

checkUsers()
