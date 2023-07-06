-- CreateTable
CREATE TABLE "Roles" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "persists" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_id_key" ON "Roles"("id");
