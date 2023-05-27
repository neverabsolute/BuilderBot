/*
  Warnings:

  - You are about to drop the column `retryDelay` on the `AssociatesConfiguration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssociatesConfiguration" DROP COLUMN "retryDelay",
ADD COLUMN     "retryDelayDays" INTEGER;
