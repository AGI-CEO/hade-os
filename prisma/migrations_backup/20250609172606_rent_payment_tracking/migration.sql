/*
  Warnings:

  - You are about to drop the column `amount` on the `RentPayment` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `RentPayment` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `RentPayment` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `RentPayment` table. All the data in the column will be lost.
  - The `status` column on the `RentPayment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[transactionId]` on the table `RentPayment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amountDue` to the `RentPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `RentPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaseId` to the `RentPayment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RentPaymentStatus" AS ENUM ('UPCOMING', 'UNPAID', 'PAID', 'LATE');

-- DropIndex
DROP INDEX "RentPayment_date_idx";

-- DropIndex
DROP INDEX "RentPayment_status_idx";

-- AlterTable
ALTER TABLE "RentPayment" DROP COLUMN "amount",
DROP COLUMN "date",
DROP COLUMN "method",
DROP COLUMN "notes",
ADD COLUMN     "amountDue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "leaseId" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "RentPaymentStatus" NOT NULL DEFAULT 'UPCOMING';

-- CreateIndex
CREATE UNIQUE INDEX "RentPayment_transactionId_key" ON "RentPayment"("transactionId");

-- CreateIndex
CREATE INDEX "RentPayment_leaseId_idx" ON "RentPayment"("leaseId");

-- AddForeignKey
ALTER TABLE "RentPayment" ADD CONSTRAINT "RentPayment_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentPayment" ADD CONSTRAINT "RentPayment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
