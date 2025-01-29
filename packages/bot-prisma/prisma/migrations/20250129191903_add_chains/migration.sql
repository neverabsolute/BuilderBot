-- AlterTable
ALTER TABLE "_RolesToUser" ADD CONSTRAINT "_RolesToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_RolesToUser_AB_unique";

-- CreateTable
CREATE TABLE "Chain" (
    "id" SERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "givenBy" BIGINT NOT NULL,
    "removedBy" BIGINT,
    "reason" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chain_id_key" ON "Chain"("id");

-- AddForeignKey
ALTER TABLE "Chain" ADD CONSTRAINT "Chain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
