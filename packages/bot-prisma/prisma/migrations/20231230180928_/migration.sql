/*
  Warnings:

  - The values [BACHELOR,MASTER] on the enum `Degrees` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Degrees_new" AS ENUM ('BACHELORS', 'MASTERS');
ALTER TABLE "DegreeChanges" ALTER COLUMN "degree" TYPE "Degrees_new" USING ("degree"::text::"Degrees_new");
ALTER TYPE "Degrees" RENAME TO "Degrees_old";
ALTER TYPE "Degrees_new" RENAME TO "Degrees";
DROP TYPE "Degrees_old";
COMMIT;
