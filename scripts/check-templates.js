const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const templates = await prisma.leaseTemplate.findMany();
    console.log('Lease Templates:');
    console.log(JSON.stringify(templates, null, 2));
  } catch (error) {
    console.error('Error fetching templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
