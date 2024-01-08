-- AlterTable
ALTER TABLE "AssociatesResponses" ADD COLUMN     "cdSkippedById" BIGINT;

-- AddForeignKey
ALTER TABLE "AssociatesResponses" ADD CONSTRAINT "AssociatesResponses_cdSkippedById_fkey" FOREIGN KEY ("cdSkippedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
