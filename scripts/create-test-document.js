const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting test document creation...');
    
    // Get all users
    const allUsers = await prisma.user.findMany();
    console.log(`Found ${allUsers.length} users`);
    
    // Get the first landlord user
    const landlord = await prisma.user.findFirst({
      where: {
        userType: 'landlord',
      },
    });

    if (!landlord) {
      console.error('No landlord user found. Please create a landlord user first.');
      return;
    }

    console.log(`Using landlord user: ${landlord.name || 'No name'} (${landlord.id})`);
    
    // Get or create a property
    let property = await prisma.property.findFirst();
    
    if (!property) {
      console.log('No property found. Creating a test property...');
      property = await prisma.property.create({
        data: {
          address: '123 Test Street',
          city: 'Test City',
          state: 'TX',
          zipCode: '12345',
          value: 250000,
          occupancy: 'occupied',
          rentAmount: 1500,
          rentDue: new Date(),
          userId: landlord.id,
        },
      });
      console.log(`Created test property: ${property.id}`);
    } else {
      console.log(`Using existing property: ${property.id}`);
    }
    
    // Get or create a tenant
    let tenant = await prisma.tenant.findFirst();
    
    if (!tenant) {
      console.log('No tenant found. Creating a test tenant...');
      tenant = await prisma.tenant.create({
        data: {
          name: 'Test Tenant',
          email: 'tenant@example.com',
          phone: '555-123-4567',
          leaseStart: new Date(),
          leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          status: 'active',
          rentAmount: 1500,
          propertyId: property.id,
        },
      });
      console.log(`Created test tenant: ${tenant.id}`);
    } else {
      console.log(`Using existing tenant: ${tenant.id}`);
    }
    
    // Create test documents
    console.log('Creating test documents...');
    
    // Lease document
    const leaseDocument = await prisma.document.create({
      data: {
        name: 'Lease Agreement',
        description: 'Residential lease agreement for 123 Test Street',
        fileUrl: 'https://example.com/lease.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 1024, // 1MB
        category: 'lease',
        isShared: true,
        propertyId: property.id,
        tenantId: tenant.id,
      },
    });
    console.log(`Created lease document: ${leaseDocument.id}`);
    
    // Insurance document
    const insuranceDocument = await prisma.document.create({
      data: {
        name: 'Renter\'s Insurance Policy',
        description: 'Insurance policy for tenant',
        fileUrl: 'https://example.com/insurance.pdf',
        fileType: 'application/pdf',
        fileSize: 512 * 1024, // 512KB
        category: 'insurance',
        isShared: true,
        propertyId: property.id,
        tenantId: tenant.id,
      },
    });
    console.log(`Created insurance document: ${insuranceDocument.id}`);
    
    // Property tax document (not shared with tenant)
    const taxDocument = await prisma.document.create({
      data: {
        name: 'Property Tax Statement',
        description: 'Annual property tax statement',
        fileUrl: 'https://example.com/tax.pdf',
        fileType: 'application/pdf',
        fileSize: 256 * 1024, // 256KB
        category: 'tax',
        isShared: false,
        propertyId: property.id,
      },
    });
    console.log(`Created tax document: ${taxDocument.id}`);
    
    // Maintenance receipt
    const maintenanceDocument = await prisma.document.create({
      data: {
        name: 'Plumbing Repair Receipt',
        description: 'Receipt for bathroom sink repair',
        fileUrl: 'https://example.com/receipt.pdf',
        fileType: 'application/pdf',
        fileSize: 128 * 1024, // 128KB
        category: 'maintenance',
        isShared: true,
        propertyId: property.id,
        tenantId: tenant.id,
      },
    });
    console.log(`Created maintenance document: ${maintenanceDocument.id}`);
    
    console.log('Test documents created successfully!');
    
  } catch (error) {
    console.error('Error creating test documents:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
