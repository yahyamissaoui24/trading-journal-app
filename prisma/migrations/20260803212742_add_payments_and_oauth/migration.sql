/*
  Warnings:

  - You are about to drop the column `plan` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCurrentPeriodEnd` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripePriceId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('WAITING', 'CONFIRMING', 'CONFIRMED', 'FINISHED', 'FAILED', 'EXPIRED');

-- AlterEnum
ALTER TYPE "AssetClass" ADD VALUE 'INDICES';

-- DropIndex
DROP INDEX "User_stripeCustomerId_key";

-- DropIndex
DROP INDEX "User_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "plan",
DROP COLUMN "stripeCurrentPeriodEnd",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripePriceId",
DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "premiumUntil" TIMESTAMP(3),
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- DropEnum
DROP TYPE "Plan";

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'nowpayments',
    "paymentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'WAITING',
    "priceAmount" DOUBLE PRECISION NOT NULL,
    "priceCurrency" TEXT NOT NULL DEFAULT 'usd',
    "payCurrency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentId_key" ON "Payment"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
