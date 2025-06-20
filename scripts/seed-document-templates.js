const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding document templates...");

  // First, find a landlord user to associate with system templates
  const landlord = await prisma.user.findFirst({
    where: { userType: "landlord" },
  });

  let systemUserId;
  if (!landlord) {
    console.log("No landlord user found. Creating one...");
    const newLandlord = await prisma.user.create({
      data: {
        email: "system@landlord.com",
        name: "System Administrator",
        userType: "landlord",
      },
    });
    console.log(`Created system landlord: ${newLandlord.id}`);
    systemUserId = newLandlord.id;
  } else {
    systemUserId = landlord.id;
  }

  // Document templates to create
  const templates = [
    {
      name: "Rent Increase Notice",
      description: "Standard notice for rent increases with required legal language",
      category: "notice",
      content: `# NOTICE OF RENT INCREASE

**TO:** {TENANT_NAME}
**PROPERTY:** {PROPERTY_FULL_ADDRESS}
**DATE:** {CURRENT_DATE}

Dear {TENANT_NAME},

This notice is to inform you that your monthly rent will be increased from {CURRENT_RENT} to {NEW_RENT}, effective {EFFECTIVE_DATE}.

This rent increase complies with all applicable laws and your lease agreement. The new rent amount will be due on {NEXT_DUE_DATE}.

Please contact us if you have any questions regarding this notice.

Sincerely,

{LANDLORD_NAME}
{LANDLORD_EMAIL}

---
*This notice is given in accordance with state and local laws. Please retain this notice for your records.*`,
    },
    {
      name: "Lease Violation Notice",
      description: "Notice for lease violations requiring tenant action",
      category: "notice",
      content: `# NOTICE OF LEASE VIOLATION

**TO:** {TENANT_NAME}
**PROPERTY:** {PROPERTY_FULL_ADDRESS}
**DATE:** {CURRENT_DATE}

Dear {TENANT_NAME},

This notice is to inform you that you are in violation of your lease agreement for the following reason(s):

**VIOLATION DETAILS:**
{VIOLATION_DETAILS}

**REQUIRED ACTION:**
You are required to correct this violation within {CURE_PERIOD} days from the date of this notice. Failure to correct this violation may result in termination of your tenancy.

If you have any questions about this notice or need assistance in correcting the violation, please contact us immediately.

Sincerely,

{LANDLORD_NAME}
{LANDLORD_EMAIL}

---
*This notice is served in accordance with your lease agreement and applicable laws.*`,
    },
    {
      name: "Maintenance Entry Notice",
      description: "Notice of entry for maintenance or repairs",
      category: "notice",
      content: `# NOTICE OF ENTRY FOR MAINTENANCE

**TO:** {TENANT_NAME}
**PROPERTY:** {PROPERTY_FULL_ADDRESS}
**DATE:** {CURRENT_DATE}

Dear {TENANT_NAME},

This notice is to inform you that we need to enter your rental unit for the following reason:

**PURPOSE OF ENTRY:**
{MAINTENANCE_PURPOSE}

**SCHEDULED DATE AND TIME:**
Date: {ENTRY_DATE}
Time: {ENTRY_TIME}

We will make every effort to complete the work as quickly as possible and with minimal disruption to you. If this time is not convenient, please contact us immediately to schedule an alternative time.

If you have any questions, please don't hesitate to contact us.

Sincerely,

{LANDLORD_NAME}
{LANDLORD_EMAIL}

---
*This notice is given in accordance with state law requiring advance notice of entry.*`,
    },
    {
      name: "Late Rent Notice",
      description: "Notice for late rent payment with fees and consequences",
      category: "notice",
      content: `# NOTICE OF LATE RENT

**TO:** {TENANT_NAME}
**PROPERTY:** {PROPERTY_FULL_ADDRESS}
**DATE:** {CURRENT_DATE}

Dear {TENANT_NAME},

This notice is to inform you that your rent payment for {RENT_PERIOD} was due on {DUE_DATE} and has not been received.

**OUTSTANDING AMOUNT:**
Monthly Rent: {MONTHLY_RENT}
Late Fee: {LATE_FEE}
**TOTAL DUE: {TOTAL_AMOUNT}**

Please remit payment immediately to avoid further action. If payment is not received within {GRACE_PERIOD} days from the date of this notice, we may begin eviction proceedings.

If you have already made payment, please disregard this notice and provide us with proof of payment.

Sincerely,

{LANDLORD_NAME}
{LANDLORD_EMAIL}

---
*Late fees are assessed in accordance with your lease agreement.*`,
    },
    {
      name: "Lease Renewal Offer",
      description: "Formal offer to renew lease with terms",
      category: "letter",
      content: `# LEASE RENEWAL OFFER

**TO:** {TENANT_NAME}
**PROPERTY:** {PROPERTY_FULL_ADDRESS}
**DATE:** {CURRENT_DATE}

Dear {TENANT_NAME},

We hope you have enjoyed living at {PROPERTY_ADDRESS}. Your current lease expires on {LEASE_END_DATE}, and we would like to offer you the opportunity to renew your lease.

**PROPOSED RENEWAL TERMS:**
- New Lease Term: {NEW_LEASE_TERM}
- Monthly Rent: {NEW_RENT_AMOUNT}
- Lease Start Date: {NEW_START_DATE}
- Lease End Date: {NEW_END_DATE}

Please let us know by {RESPONSE_DEADLINE} if you would like to renew your lease under these terms. If you choose not to renew, please ensure you provide proper notice in accordance with your current lease agreement.

We value you as a tenant and hope you will choose to stay with us.

Sincerely,

{LANDLORD_NAME}
{LANDLORD_EMAIL}`,
    },
    {
      name: "Welcome Letter for New Tenants",
      description: "Welcome letter with important information for new tenants",
      category: "letter",
      content: `# WELCOME TO YOUR NEW HOME

**TO:** {TENANT_NAME}
**PROPERTY:** {PROPERTY_FULL_ADDRESS}
**DATE:** {CURRENT_DATE}

Dear {TENANT_NAME},

Welcome to your new home at {PROPERTY_ADDRESS}! We're excited to have you as our tenant and want to ensure your move-in goes smoothly.

**IMPORTANT INFORMATION:**

**Rent Payment:**
- Monthly Rent: {MONTHLY_RENT}
- Due Date: {RENT_DUE_DATE}
- Payment Methods: {PAYMENT_METHODS}

**Emergency Contacts:**
- Landlord: {LANDLORD_NAME} - {LANDLORD_EMAIL}
- Emergency Maintenance: {EMERGENCY_CONTACT}

**Important Reminders:**
- Please review your lease agreement carefully
- Document any existing issues within 48 hours
- Renters insurance is recommended/required
- Quiet hours are from {QUIET_HOURS}

If you have any questions or concerns, please don't hesitate to contact us. We want to make your tenancy as pleasant as possible.

Welcome home!

{LANDLORD_NAME}
{LANDLORD_EMAIL}`,
    },
    {
      name: "Move-Out Instructions",
      description: "Instructions for tenants moving out including cleaning requirements",
      category: "letter",
      content: `# MOVE-OUT INSTRUCTIONS

**TO:** {TENANT_NAME}
**PROPERTY:** {PROPERTY_FULL_ADDRESS}
**DATE:** {CURRENT_DATE}

Dear {TENANT_NAME},

Thank you for providing notice of your intent to vacate. To ensure a smooth move-out process and the return of your security deposit, please follow these instructions:

**MOVE-OUT DATE:** {MOVE_OUT_DATE}

**CLEANING REQUIREMENTS:**
- All rooms must be thoroughly cleaned
- Appliances cleaned inside and out
- Carpets professionally cleaned (receipt required)
- All personal belongings removed
- All keys and remotes returned

**INSPECTION:**
A move-out inspection will be conducted on {INSPECTION_DATE} at {INSPECTION_TIME}. You are welcome to attend.

**SECURITY DEPOSIT:**
Your security deposit of {SECURITY_DEPOSIT} will be returned within {RETURN_PERIOD} days, minus any deductions for damages or cleaning.

**FORWARDING ADDRESS:**
Please provide your forwarding address for deposit return and any future correspondence.

Thank you for being our tenant. We wish you well in your new home.

Sincerely,

{LANDLORD_NAME}
{LANDLORD_EMAIL}`,
    },
    {
      name: "Property Inspection Notice",
      description: "Notice for routine property inspections",
      category: "notice",
      content: `# NOTICE OF PROPERTY INSPECTION

**TO:** {TENANT_NAME}
**PROPERTY:** {PROPERTY_FULL_ADDRESS}
**DATE:** {CURRENT_DATE}

Dear {TENANT_NAME},

This notice is to inform you that we will be conducting a routine inspection of your rental unit.

**INSPECTION DETAILS:**
- Date: {INSPECTION_DATE}
- Time: {INSPECTION_TIME}
- Duration: Approximately {INSPECTION_DURATION}
- Inspector: {INSPECTOR_NAME}

**PURPOSE:**
This inspection is for general property maintenance, safety checks, and to ensure compliance with lease terms.

**WHAT TO EXPECT:**
- Review of overall property condition
- Check of safety equipment (smoke detectors, etc.)
- Assessment of any maintenance needs
- Documentation with photos if necessary

Please ensure the property is accessible and in reasonable condition for inspection. If this time is not convenient, please contact us to schedule an alternative time.

Thank you for your cooperation.

Sincerely,

{LANDLORD_NAME}
{LANDLORD_EMAIL}`,
    }
  ];

  // Create templates
  for (const templateData of templates) {
    try {
      const existingTemplate = await prisma.documentTemplate.findFirst({
        where: {
          name: templateData.name,
          isSystem: true,
        },
      });

      if (existingTemplate) {
        console.log(`Template "${templateData.name}" already exists, skipping...`);
        continue;
      }

      const template = await prisma.documentTemplate.create({
        data: {
          ...templateData,
          isSystem: true,
          userId: systemUserId,
        },
      });

      console.log(`Created template: ${template.name} (${template.id})`);
    } catch (error) {
      console.error(`Error creating template "${templateData.name}":`, error);
    }
  }

  console.log("Document template seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 