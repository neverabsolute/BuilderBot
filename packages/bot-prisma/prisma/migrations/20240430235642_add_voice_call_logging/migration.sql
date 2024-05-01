-- CreateTable
CREATE TABLE "VoiceCalls" (
    "id" SERIAL NOT NULL,
    "channelId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceCalls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VoiceCalls_id_key" ON "VoiceCalls"("id");

-- AddForeignKey
ALTER TABLE "VoiceCalls" ADD CONSTRAINT "VoiceCalls_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceCalls" ADD CONSTRAINT "VoiceCalls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
