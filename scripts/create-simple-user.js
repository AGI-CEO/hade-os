const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function createUser() {
  console.log('Creating simple test user...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    // Test connection
    console.log('Testing database connection...');
    const connectionTest = await prisma.$queryRaw`SELECT current_timestamp as time, current_user as user`;
    console.log('Connection successful:', connectionTest);
    
    // Create a test user
    console.log('Creating user...');
    const user = await prisma.user.create({
      data: {
        email: 'simple-test@example.com',
        name: 'Simple Test User',
        password: 'password123',
        role: 'user',
        userType: 'landlord',
      },
    });
    
    console.log('User created successfully:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
