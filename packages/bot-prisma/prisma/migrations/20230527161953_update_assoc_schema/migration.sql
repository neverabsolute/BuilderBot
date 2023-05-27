/*
  Warnings:

  - You are about to drop the `_AssociatesQuestionsToAssociatesQuiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AssociatesQuestionsToAssociatesQuiz" DROP CONSTRAINT "_AssociatesQuestionsToAssociatesQuiz_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssociatesQuestionsToAssociatesQuiz" DROP CONSTRAINT "_AssociatesQuestionsToAssociatesQuiz_B_fkey";

-- DropTable
DROP TABLE "_AssociatesQuestionsToAssociatesQuiz";

-- AddForeignKey
ALTER TABLE "AssociatesQuestions" ADD CONSTRAINT "AssociatesQuestions_id_fkey" FOREIGN KEY ("id") REFERENCES "AssociatesQuiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
