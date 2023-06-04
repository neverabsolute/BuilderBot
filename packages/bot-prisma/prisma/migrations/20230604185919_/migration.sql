/*
  Warnings:

  - You are about to drop the column `durationDays` on the `TicketBan` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `TicketBan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketBan" DROP COLUMN "durationDays",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
