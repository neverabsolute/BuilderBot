-- DropForeignKey
ALTER TABLE "VoiceCalls" DROP CONSTRAINT "VoiceCalls_channelId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceCalls" DROP CONSTRAINT "VoiceCalls_userId_fkey";

-- AlterTable
ALTER TABLE "VoiceCalls" ALTER COLUMN "channelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "VoiceCalls" ADD CONSTRAINT "VoiceCalls_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceCalls" ADD CONSTRAINT "VoiceCalls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
