/*
  Warnings:

  - Added the required column `finished` to the `AssociatesResponses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssociatesResponses" ADD COLUMN     "finished" BOOLEAN NOT NULL;
