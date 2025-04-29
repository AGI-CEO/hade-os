const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting test lease creation...');
    
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
    
    // Create a lease template
    console.log('Creating a lease template...');
    const template = await prisma.leaseTemplate.create({
      data: {
        name: 'Standard Residential Lease Agreement',
        description: 'A comprehensive lease agreement for residential properties',
        userId: landlord.id,
        content: `# RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement ("Agreement") is made and entered into on {CURRENT_DATE}, by and between the Landlord and Tenant as specified below.

## 1. PARTIES

**Landlord**: [Landlord Name]
**Tenant**: {TENANT_NAME}

## 2. PROPERTY

The Landlord hereby leases to the Tenant, and the Tenant hereby leases from the Landlord, the residential property located at:

{PROPERTY_ADDRESS}
{PROPERTY_CITY}, {PROPERTY_STATE} {PROPERTY_ZIP}

Hereinafter referred to as the "Premises".

## 3. TERM

This Agreement shall commence on {LEASE_START_DATE} and shall continue until {LEASE_END_DATE} ("Lease Term").

## 4. RENT

Tenant agrees to pay {MONTHLY_RENT} per month as rent, payable in advance on the 1st day of each month during the Lease Term.

## 5. SECURITY DEPOSIT

Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of {SECURITY_DEPOSIT} as a security deposit.

## 6. UTILITIES

Tenant shall be responsible for payment of all utilities and services, except for the following which shall be paid by Landlord:
- Water and sewer
- Garbage collection

## 7. USE OF PREMISES

The Premises shall be used and occupied by Tenant exclusively as a private residence. Tenant shall not use the Premises for any other purpose without the prior written consent of Landlord.

## 8. MAINTENANCE AND REPAIRS

Tenant shall maintain the Premises in a clean and sanitary condition and shall promptly notify Landlord of any damage or necessary repairs.

## 9. ALTERATIONS

Tenant shall not make any alterations, additions, or improvements to the Premises without the prior written consent of Landlord.

## 10. ENTRY BY LANDLORD

Landlord shall have the right to enter the Premises at reasonable times for the purpose of inspection, repairs, or showing the Premises to prospective tenants or purchasers, provided that Landlord gives Tenant reasonable notice.

## 11. TERMINATION

At the expiration of the Lease Term, this Agreement shall terminate without the necessity of notice from either party.

## 12. GOVERNING LAW

This Agreement shall be governed by the laws of the state of {PROPERTY_STATE}.

## 13. SIGNATURES

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.

Landlord: _________________________ Date: _____________

Tenant: __________________________ Date: _____________`,
      },
    });
    
    console.log(`Created lease template: ${template.id}`);
    
    // Create a test lease
    console.log('Creating a test lease...');
    
    // Format dates
    const startDate = new Date();
    const endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    const formattedStartDate = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedEndDate = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Replace template variables with actual values
    let content = template.content;
    
    // Property variables
    content = content.replace(/\{PROPERTY_ADDRESS\}/g, property.address);
    content = content.replace(/\{PROPERTY_CITY\}/g, property.city);
    content = content.replace(/\{PROPERTY_STATE\}/g, property.state);
    content = content.replace(/\{PROPERTY_ZIP\}/g, property.zipCode);
    
    // Tenant variables
    content = content.replace(/\{TENANT_NAME\}/g, tenant.name);
    
    // Lease variables
    content = content.replace(/\{LEASE_START_DATE\}/g, formattedStartDate);
    content = content.replace(/\{LEASE_END_DATE\}/g, formattedEndDate);
    content = content.replace(/\{MONTHLY_RENT\}/g, property.rentAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    content = content.replace(/\{SECURITY_DEPOSIT\}/g, property.rentAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    
    // Current date
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    content = content.replace(/\{CURRENT_DATE\}/g, currentDate);
    
    // Create the lease
    const lease = await prisma.lease.create({
      data: {
        title: `Lease Agreement - ${tenant.name} - ${property.address}`,
        content,
        startDate,
        endDate,
        status: 'active',
        monthlyRent: property.rentAmount,
        securityDeposit: property.rentAmount,
        propertyId: property.id,
        tenantId: tenant.id,
        templateId: template.id,
      },
    });
    
    console.log(`Created test lease: ${lease.id}`);
    console.log('Test lease created successfully!');
    
  } catch (error) {
    console.error('Error creating test lease:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
