/*
  Warnings:

  - You are about to drop the `AssociatesQuestionChoice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssociatesQuestionChoice" DROP CONSTRAINT "AssociatesQuestionChoice_questionId_fkey";

-- DropTable
DROP TABLE "AssociatesQuestionChoice";

-- CreateTable
CREATE TABLE "AssociatesQuestionChoices" (
    "id" BIGSERIAL NOT NULL,
    "choice" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "questionId" BIGINT NOT NULL,

    CONSTRAINT "AssociatesQuestionChoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssociatesQuestionChoices_id_key" ON "AssociatesQuestionChoices"("id");

-- AddForeignKey
ALTER TABLE "AssociatesQuestionChoices" ADD CONSTRAINT "AssociatesQuestionChoices_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssociatesQuestions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
