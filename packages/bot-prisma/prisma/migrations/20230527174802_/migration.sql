/*
  Warnings:

  - You are about to drop the column `answer` on the `AssociatesQuestions` table. All the data in the column will be lost.
  - You are about to drop the `QuestionChoice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuestionChoice" DROP CONSTRAINT "QuestionChoice_questionId_fkey";

-- AlterTable
ALTER TABLE "AssociatesQuestions" DROP COLUMN "answer";

-- DropTable
DROP TABLE "QuestionChoice";

-- CreateTable
CREATE TABLE "AssociatesQuestionChoice" (
    "id" BIGSERIAL NOT NULL,
    "choice" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "questionId" BIGINT NOT NULL,

    CONSTRAINT "AssociatesQuestionChoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssociatesQuestionChoice_id_key" ON "AssociatesQuestionChoice"("id");

-- AddForeignKey
ALTER TABLE "AssociatesQuestionChoice" ADD CONSTRAINT "AssociatesQuestionChoice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssociatesQuestions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
