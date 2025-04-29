const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Check lease templates
    const templates = await prisma.leaseTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log(`\n=== LEASE TEMPLATES (${templates.length}) ===`);
    templates.forEach((template, index) => {
      console.log(`\n${index + 1}. ${template.name}`);
      console.log(`   ID: ${template.id}`);
      console.log(`   Description: ${template.description}`);
      console.log(`   Created: ${template.createdAt}`);
    });
    
    // Check leases
    const leases = await prisma.lease.findMany({
      include: {
        property: true,
        tenant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log(`\n=== LEASES (${leases.length}) ===`);
    leases.forEach((lease, index) => {
      console.log(`\n${index + 1}. ${lease.title}`);
      console.log(`   ID: ${lease.id}`);
      console.log(`   Status: ${lease.status}`);
      console.log(`   Period: ${lease.startDate.toLocaleDateString()} to ${lease.endDate.toLocaleDateString()}`);
      console.log(`   Property: ${lease.property.address}, ${lease.property.city}, ${lease.property.state}`);
      console.log(`   Tenant: ${lease.tenant.name} (${lease.tenant.email})`);
      console.log(`   Monthly Rent: $${lease.monthlyRent}`);
    });
    
  } catch (error) {
    console.error('Error checking leases and templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
