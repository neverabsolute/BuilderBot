/*
  Warnings:

  - Added the required column `staffId` to the `TicketBan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketBan" ADD COLUMN     "staffId" BIGINT NOT NULL;
