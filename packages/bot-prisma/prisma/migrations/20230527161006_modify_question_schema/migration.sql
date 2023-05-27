/*
  Warnings:

  - You are about to drop the column `configurationId` on the `AssociatesQuestions` table. All the data in the column will be lost.
  - You are about to drop the column `answer` on the `AssociatesResponses` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `AssociatesResponses` table. All the data in the column will be lost.
  - Added the required column `type` to the `AssociatesQuestions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `AssociatesResponses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `AssociatesResponses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssociatesQuestionTypes" AS ENUM ('MULTIPLE_CHOICE', 'SINGLE_CHOICE');

-- DropForeignKey
ALTER TABLE "AssociatesQuestions" DROP CONSTRAINT "AssociatesQuestions_id_fkey";

-- DropForeignKey
ALTER TABLE "AssociatesResponses" DROP CONSTRAINT "AssociatesResponses_questionId_fkey";

-- AlterTable
ALTER TABLE "AssociatesQuestions" DROP COLUMN "configurationId",
ADD COLUMN     "type" "AssociatesQuestionTypes" NOT NULL;

-- AlterTable
ALTER TABLE "AssociatesResponses" DROP COLUMN "answer",
DROP COLUMN "questionId",
ADD COLUMN     "channelId" BIGINT NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "QuestionChoice" (
    "id" BIGSERIAL NOT NULL,
    "choice" TEXT NOT NULL,
    "questionId" BIGINT NOT NULL,

    CONSTRAINT "QuestionChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociatesQuiz" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "questionId" BIGINT NOT NULL,

    CONSTRAINT "AssociatesQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AssociatesQuestionsToAssociatesQuiz" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionChoice_id_key" ON "QuestionChoice"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AssociatesQuiz_id_key" ON "AssociatesQuiz"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_AssociatesQuestionsToAssociatesQuiz_AB_unique" ON "_AssociatesQuestionsToAssociatesQuiz"("A", "B");

-- CreateIndex
CREATE INDEX "_AssociatesQuestionsToAssociatesQuiz_B_index" ON "_AssociatesQuestionsToAssociatesQuiz"("B");

-- AddForeignKey
ALTER TABLE "QuestionChoice" ADD CONSTRAINT "QuestionChoice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssociatesQuestions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssociatesQuestionsToAssociatesQuiz" ADD CONSTRAINT "_AssociatesQuestionsToAssociatesQuiz_A_fkey" FOREIGN KEY ("A") REFERENCES "AssociatesQuestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssociatesQuestionsToAssociatesQuiz" ADD CONSTRAINT "_AssociatesQuestionsToAssociatesQuiz_B_fkey" FOREIGN KEY ("B") REFERENCES "AssociatesQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
