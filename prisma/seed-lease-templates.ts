import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting lease template creation...");

    // Get all users to debug
    const allUsers = await prisma.user.findMany();
    console.log(`Found ${allUsers.length} users:`);
    allUsers.forEach((user) => {
      console.log(
        `- ${user.name || "No name"} (${user.id}), userType: ${user.userType}`
      );
    });

    // Get the first landlord user
    const landlord = await prisma.user.findFirst({
      where: {
        userType: "landlord",
      },
    });

    if (!landlord) {
      console.error(
        "No landlord user found. Please create a landlord user first."
      );
      return;
    }

    console.log(
      `Using landlord user: ${landlord.name || "No name"} (${landlord.id})`
    );

    // Create residential lease template
    const residentialTemplate = await prisma.leaseTemplate.create({
      data: {
        name: "Standard Residential Lease Agreement",
        description:
          "A comprehensive lease agreement for residential properties",
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

    console.log(
      `Created residential lease template: ${residentialTemplate.id}`
    );

    // Create month-to-month lease template
    const monthToMonthTemplate = await prisma.leaseTemplate.create({
      data: {
        name: "Month-to-Month Rental Agreement",
        description: "A flexible lease agreement with monthly renewal",
        userId: landlord.id,
        content: `# MONTH-TO-MONTH RENTAL AGREEMENT

This Month-to-Month Rental Agreement ("Agreement") is made and entered into on {CURRENT_DATE}, by and between the Landlord and Tenant as specified below.

## 1. PARTIES

**Landlord**: [Landlord Name]
**Tenant**: {TENANT_NAME}

## 2. PROPERTY

The Landlord hereby leases to the Tenant, and the Tenant hereby leases from the Landlord, the residential property located at:

{PROPERTY_ADDRESS}
{PROPERTY_CITY}, {PROPERTY_STATE} {PROPERTY_ZIP}

Hereinafter referred to as the "Premises".

## 3. TERM

This Agreement shall commence on {LEASE_START_DATE} and continue on a month-to-month basis until terminated by either party with at least 30 days' written notice.

## 4. RENT

Tenant agrees to pay {MONTHLY_RENT} per month as rent, payable in advance on the 1st day of each month.

## 5. SECURITY DEPOSIT

Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of {SECURITY_DEPOSIT} as a security deposit.

## 6. UTILITIES

Tenant shall be responsible for payment of all utilities and services.

## 7. USE OF PREMISES

The Premises shall be used and occupied by Tenant exclusively as a private residence.

## 8. MAINTENANCE AND REPAIRS

Tenant shall maintain the Premises in a clean and sanitary condition and shall promptly notify Landlord of any damage or necessary repairs.

## 9. TERMINATION

Either party may terminate this Agreement by providing at least 30 days' written notice to the other party.

## 10. GOVERNING LAW

This Agreement shall be governed by the laws of the state of {PROPERTY_STATE}.

## 11. SIGNATURES

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.

Landlord: _________________________ Date: _____________

Tenant: __________________________ Date: _____________`,
      },
    });

    console.log(
      `Created month-to-month lease template: ${monthToMonthTemplate.id}`
    );

    // Create commercial lease template
    const commercialTemplate = await prisma.leaseTemplate.create({
      data: {
        name: "Commercial Property Lease",
        description: "Lease agreement for commercial properties",
        userId: landlord.id,
        content: `# COMMERCIAL PROPERTY LEASE AGREEMENT

This Commercial Property Lease Agreement ("Agreement") is made and entered into on {CURRENT_DATE}, by and between the Landlord and Tenant as specified below.

## 1. PARTIES

**Landlord**: [Landlord Name]
**Tenant**: {TENANT_NAME}

## 2. PROPERTY

The Landlord hereby leases to the Tenant, and the Tenant hereby leases from the Landlord, the commercial property located at:

{PROPERTY_ADDRESS}
{PROPERTY_CITY}, {PROPERTY_STATE} {PROPERTY_ZIP}

Hereinafter referred to as the "Premises".

## 3. TERM

This Agreement shall commence on {LEASE_START_DATE} and shall continue until {LEASE_END_DATE} ("Lease Term").

## 4. RENT

Tenant agrees to pay {MONTHLY_RENT} per month as rent, payable in advance on the 1st day of each month during the Lease Term.

## 5. SECURITY DEPOSIT

Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of {SECURITY_DEPOSIT} as a security deposit.

## 6. USE OF PREMISES

The Premises shall be used for commercial purposes only, specifically for: [Commercial Purpose].

## 7. MAINTENANCE AND REPAIRS

Tenant shall be responsible for all maintenance and repairs to the Premises, except for structural repairs which shall be the responsibility of the Landlord.

## 8. INSURANCE

Tenant shall maintain commercial general liability insurance with coverage of at least $1,000,000 per occurrence.

## 9. TERMINATION

At the expiration of the Lease Term, this Agreement shall terminate without the necessity of notice from either party.

## 10. GOVERNING LAW

This Agreement shall be governed by the laws of the state of {PROPERTY_STATE}.

## 11. SIGNATURES

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.

Landlord: _________________________ Date: _____________

Tenant: __________________________ Date: _____________`,
      },
    });

    console.log(`Created commercial lease template: ${commercialTemplate.id}`);

    console.log("Lease templates created successfully!");
  } catch (error) {
    console.error("Error creating lease templates:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
