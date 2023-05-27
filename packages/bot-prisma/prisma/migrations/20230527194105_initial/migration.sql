-- CreateEnum
CREATE TYPE "AssociatesQuestionTypes" AS ENUM ('MULTIPLE_CHOICE', 'SINGLE_CHOICE');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "username" TEXT,
    "discriminator" INTEGER,
    "nickname" TEXT,
    "joinedServerAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "channelId" BIGINT NOT NULL,
    "guildId" BIGINT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociatesConfiguration" (
    "id" SERIAL NOT NULL,
    "categoryId" BIGINT,
    "associatesRoleId" BIGINT,
    "retryDelayDays" INTEGER,

    CONSTRAINT "AssociatesConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociatesQuiz" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssociatesQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociatesQuestions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "type" "AssociatesQuestionTypes" NOT NULL,
    "quizId" INTEGER NOT NULL,

    CONSTRAINT "AssociatesQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociatesQuestionChoices" (
    "id" SERIAL NOT NULL,
    "choice" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "AssociatesQuestionChoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociatesResponses" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "answerDict" JSONB NOT NULL DEFAULT '{}',
    "userId" BIGINT NOT NULL,
    "channelId" BIGINT NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssociatesResponses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AssociatesConfiguration_id_key" ON "AssociatesConfiguration"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AssociatesQuiz_id_key" ON "AssociatesQuiz"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AssociatesQuestions_id_key" ON "AssociatesQuestions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AssociatesQuestionChoices_id_key" ON "AssociatesQuestionChoices"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AssociatesResponses_id_key" ON "AssociatesResponses"("id");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociatesQuestions" ADD CONSTRAINT "AssociatesQuestions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "AssociatesQuiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociatesQuestionChoices" ADD CONSTRAINT "AssociatesQuestionChoices_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssociatesQuestions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociatesResponses" ADD CONSTRAINT "AssociatesResponses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
