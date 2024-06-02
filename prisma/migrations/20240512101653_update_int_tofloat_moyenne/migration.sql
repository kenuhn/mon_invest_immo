/*
  Warnings:

  - You are about to drop the column `moeynne` on the `City` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "City" DROP COLUMN "moeynne",
ADD COLUMN     "moyenne" DOUBLE PRECISION NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "Ratings" ALTER COLUMN "moyenne" SET DEFAULT 0.00,
ALTER COLUMN "moyenne" SET DATA TYPE DOUBLE PRECISION;
