const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function createTestUsers() {
  console.log('Creating test users...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    // Test connection
    console.log('Testing database connection...');
    const connectionTest = await prisma.$queryRaw`SELECT current_timestamp as time, current_user as user`;
    console.log('Connection successful:', connectionTest);
    
    // Create a landlord user
    console.log('Creating landlord user...');
    const landlord = await prisma.user.upsert({
      where: { email: 'landlord@example.com' },
      update: {
        name: 'Test Landlord',
        password: 'password123',
        userType: 'landlord',
      },
      create: {
        email: 'landlord@example.com',
        name: 'Test Landlord',
        password: 'password123',
        role: 'user',
        userType: 'landlord',
      },
    });
    
    console.log(`Created landlord user with id: ${landlord.id}`);
    
    // Create a property for the landlord
    console.log('Creating property...');
    const property = await prisma.property.upsert({
      where: { id: 'test-property-1' },
      update: {
        address: '456 Rental St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702',
        value: 350000,
        occupancy: 'occupied',
        rentAmount: 1800,
        rentDue: new Date(new Date().setDate(1)),
      },
      create: {
        id: 'test-property-1',
        address: '456 Rental St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house%201-2A4jS3pKxw2ZYNnZw1suipKoGBkriL.jpeg',
        value: 350000,
        occupancy: 'occupied',
        rentAmount: 1800,
        rentDue: new Date(new Date().setDate(1)),
        userId: landlord.id,
      },
    });
    
    console.log(`Created property with id: ${property.id}`);
    
    // Create a tenant user
    console.log('Creating tenant user...');
    const tenantUser = await prisma.user.upsert({
      where: { email: 'tenant@example.com' },
      update: {
        name: 'Test Tenant',
        password: 'password123',
        userType: 'tenant',
      },
      create: {
        email: 'tenant@example.com',
        name: 'Test Tenant',
        password: 'password123',
        role: 'user',
        userType: 'tenant',
      },
    });
    
    console.log(`Created tenant user with id: ${tenantUser.id}`);
    
    // Create a tenant record and link it to the user
    console.log('Creating tenant record...');
    const tenant = await prisma.tenant.upsert({
      where: { userId: tenantUser.id },
      update: {
        name: 'Test Tenant',
        email: 'tenant@example.com',
        phone: '555-123-4567',
        leaseStart: new Date('2023-01-01'),
        leaseEnd: new Date('2023-12-31'),
        status: 'active',
        rentAmount: 1800,
        lastPayment: new Date(new Date().setDate(1)),
        happinessScore: 85,
        propertyId: property.id,
      },
      create: {
        name: 'Test Tenant',
        email: 'tenant@example.com',
        phone: '555-123-4567',
        leaseStart: new Date('2023-01-01'),
        leaseEnd: new Date('2023-12-31'),
        status: 'active',
        rentAmount: 1800,
        lastPayment: new Date(new Date().setDate(1)),
        happinessScore: 85,
        propertyId: property.id,
        userId: tenantUser.id,
      },
    });
    
    console.log(`Created tenant record with id: ${tenant.id}`);
    
    // Create some maintenance requests
    console.log('Creating maintenance requests...');
    const maintenanceRequest1 = await prisma.maintenanceRequest.create({
      data: {
        title: 'Leaking Faucet',
        description: 'The kitchen faucet is leaking and needs repair.',
        status: 'pending',
        priority: 'medium',
        propertyId: property.id,
      },
    });
    
    const maintenanceRequest2 = await prisma.maintenanceRequest.create({
      data: {
        title: 'AC Not Working',
        description: 'The air conditioning unit is not cooling properly.',
        status: 'in-progress',
        priority: 'high',
        propertyId: property.id,
      },
    });
    
    const maintenanceRequest3 = await prisma.maintenanceRequest.create({
      data: {
        title: 'Light Bulb Replacement',
        description: 'The light bulb in the hallway needs to be replaced.',
        status: 'completed',
        priority: 'low',
        propertyId: property.id,
      },
    });
    
    console.log('Created maintenance requests');
    
    console.log('Test users and data created successfully!');
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
