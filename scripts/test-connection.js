const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing connection to Supabase...');
  
  try {
    const prisma = new PrismaClient();
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    console.log('Connection successful!');
    console.log('Query result:', result);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection();
