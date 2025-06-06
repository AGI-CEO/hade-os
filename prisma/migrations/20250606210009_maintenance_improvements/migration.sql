/*
  Warnings:

  - You are about to drop the column `message` on the `MaintenanceMessage` table. All the data in the column will be lost.
  - You are about to drop the column `senderType` on the `MaintenanceMessage` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `MaintenanceRequest` table. All the data in the column will be lost.
  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Income` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `MaintenanceMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `MaintenanceMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storagePath` to the `PropertyImage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FinancialTransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceRequest" DROP CONSTRAINT "MaintenanceRequest_vendorId_fkey";

-- DropIndex
DROP INDEX "MaintenanceMessage_createdAt_idx";

-- DropIndex
DROP INDEX "MaintenanceRequest_vendorId_idx";

-- DropIndex
DROP INDEX "PortfolioSnapshot_snapshotDate_idx";

-- AlterTable
ALTER TABLE "MaintenanceMessage" DROP COLUMN "message",
DROP COLUMN "senderType",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MaintenanceRequest" DROP COLUMN "vendorId",
ADD COLUMN     "vendorContact" TEXT,
ADD COLUMN     "vendorName" TEXT;

-- AlterTable
ALTER TABLE "PropertyImage" ADD COLUMN     "storagePath" TEXT NOT NULL;

-- DropTable
DROP TABLE "Expense";

-- DropTable
DROP TABLE "Income";

-- DropTable
DROP TABLE "Vendor";

-- CreateTable
CREATE TABLE "FinancialCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FinancialTransactionType" NOT NULL,

    CONSTRAINT "FinancialCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "type" "FinancialTransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinancialCategory_name_type_key" ON "FinancialCategory"("name", "type");

-- CreateIndex
CREATE INDEX "Transaction_propertyId_idx" ON "Transaction"("propertyId");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_categoryId_idx" ON "Transaction"("categoryId");

-- CreateIndex
CREATE INDEX "MaintenanceMessage_userId_idx" ON "MaintenanceMessage"("userId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FinancialCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceMessage" ADD CONSTRAINT "MaintenanceMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
