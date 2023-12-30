-- CreateEnum
CREATE TYPE "Degrees" AS ENUM ('BACHELOR', 'MASTER');

-- CreateEnum
CREATE TYPE "Actions" AS ENUM ('ADD', 'REMOVE');

-- CreateTable
CREATE TABLE "DegreeChanges" (
    "id" SERIAL NOT NULL,
    "action" "Actions" NOT NULL,
    "degree" "Degrees" NOT NULL,
    "fromId" BIGINT NOT NULL,
    "toId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DegreeChanges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DegreeChanges_id_key" ON "DegreeChanges"("id");

-- AddForeignKey
ALTER TABLE "DegreeChanges" ADD CONSTRAINT "DegreeChanges_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DegreeChanges" ADD CONSTRAINT "DegreeChanges_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
