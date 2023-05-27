/*
  Warnings:

  - Added the required column `quizId` to the `AssociatesQuestions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssociatesQuestions" DROP CONSTRAINT "AssociatesQuestions_id_fkey";

-- AlterTable
ALTER TABLE "AssociatesQuestions" ADD COLUMN     "quizId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "AssociatesQuestions" ADD CONSTRAINT "AssociatesQuestions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "AssociatesQuiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
