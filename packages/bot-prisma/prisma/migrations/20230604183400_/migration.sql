-- CreateTable
CREATE TABLE "TicketBan" (
    "id" SERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "reason" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketBan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TicketBan_id_key" ON "TicketBan"("id");

-- AddForeignKey
ALTER TABLE "TicketBan" ADD CONSTRAINT "TicketBan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
