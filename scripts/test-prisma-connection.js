const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function testConnection() {
  console.log('Testing connection to Supabase with Prisma...');
  console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
  
  try {
    const prisma = new PrismaClient();
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT current_timestamp as time, current_user as user`;
    
    console.log('Connection successful!');
    console.log('Query result:', result);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testConnection();
