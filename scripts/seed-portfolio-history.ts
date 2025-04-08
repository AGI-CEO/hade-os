const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

interface Property {
  value: number;
  occupancy: string;
  rentAmount?: number | null;
}

async function main() {
  // Get current portfolio stats
  const properties = (await prisma.property.findMany()) as Property[];

  // Calculate current values
  const currentTotalValue = properties.reduce(
    (sum: number, property: Property) => sum + property.value,
    0
  );
  const currentMonthlyIncome = properties
    .filter(
      (property: Property) =>
        property.occupancy === "occupied" && property.rentAmount
    )
    .reduce(
      (sum: number, property: Property) => sum + (property.rentAmount || 0),
      0
    );

  // Create historical snapshots with slightly lower values to show growth
  // 30 days ago (about -5% from current)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await prisma.portfolioSnapshot.create({
    data: {
      totalValue: currentTotalValue * 0.95,
      monthlyIncome: currentMonthlyIncome * 0.95,
      snapshotDate: thirtyDaysAgo,
    },
  });

  // 60 days ago (about -8% from current)
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  await prisma.portfolioSnapshot.create({
    data: {
      totalValue: currentTotalValue * 0.92,
      monthlyIncome: currentMonthlyIncome * 0.92,
      snapshotDate: sixtyDaysAgo,
    },
  });

  // 90 days ago (about -12% from current)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  await prisma.portfolioSnapshot.create({
    data: {
      totalValue: currentTotalValue * 0.88,
      monthlyIncome: currentMonthlyIncome * 0.88,
      snapshotDate: ninetyDaysAgo,
    },
  });

  console.log("Seeded historical portfolio data");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
