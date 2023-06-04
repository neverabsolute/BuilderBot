/*
  Warnings:

  - You are about to drop the column `staffId` on the `TicketBan` table. All the data in the column will be lost.
  - Added the required column `givenBy` to the `TicketBan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketBan" DROP COLUMN "staffId",
ADD COLUMN     "givenBy" BIGINT NOT NULL,
ADD COLUMN     "removedBy" BIGINT;
