/*
  Warnings:

  - You are about to drop the column `variant` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_variant_idx";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "currency" SET DEFAULT 'VND';

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "currency" SET DEFAULT 'VND';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "variant";

-- DropEnum
DROP TYPE "ProductVariant";
