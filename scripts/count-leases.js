const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const templateCount = await prisma.leaseTemplate.count();
    const leaseCount = await prisma.lease.count();
    
    console.log(`Templates: ${templateCount}, Leases: ${leaseCount}`);
  } catch (error) {
    console.error('Error counting leases and templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
