/*
  Warnings:

  - You are about to drop the column `category` on the `AssociatesConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `AssociatesQuiz` table. All the data in the column will be lost.
  - Added the required column `correct` to the `QuestionChoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssociatesConfiguration" DROP COLUMN "category",
ADD COLUMN     "associatesRoleId" BIGINT,
ADD COLUMN     "categoryId" BIGINT;

-- AlterTable
ALTER TABLE "AssociatesQuiz" DROP COLUMN "questionId";

-- AlterTable
ALTER TABLE "QuestionChoice" ADD COLUMN     "correct" BOOLEAN NOT NULL;
