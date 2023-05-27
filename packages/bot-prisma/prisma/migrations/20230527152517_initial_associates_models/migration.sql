-- CreateTable
CREATE TABLE "AssociatesConfiguration" (
    "id" BIGSERIAL NOT NULL,
    "category" BIGINT,
    "retryDelay" INTEGER,

    CONSTRAINT "AssociatesConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociatesQuestions" (
    "id" BIGSERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "configurationId" BIGINT NOT NULL,

    CONSTRAINT "AssociatesQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociatesResponses" (
    "id" BIGSERIAL NOT NULL,
    "answer" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "questionId" BIGINT NOT NULL,

    CONSTRAINT "AssociatesResponses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssociatesConfiguration_id_key" ON "AssociatesConfiguration"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AssociatesQuestions_id_key" ON "AssociatesQuestions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AssociatesResponses_id_key" ON "AssociatesResponses"("id");

-- AddForeignKey
ALTER TABLE "AssociatesQuestions" ADD CONSTRAINT "AssociatesQuestions_id_fkey" FOREIGN KEY ("id") REFERENCES "AssociatesConfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociatesResponses" ADD CONSTRAINT "AssociatesResponses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociatesResponses" ADD CONSTRAINT "AssociatesResponses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssociatesQuestions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
