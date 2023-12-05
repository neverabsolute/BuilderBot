-- CreateTable
CREATE TABLE "Channel" (
    "id" BIGINT NOT NULL,
    "name" TEXT,
    "guildId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_id_key" ON "Channel"("id");

-- Identify orphan channelId values and store them in a temporary table
CREATE TEMP TABLE orphan_channel_ids AS
SELECT DISTINCT "channelId"
FROM "Message"
WHERE "channelId" NOT IN (SELECT "id" FROM "Channel");

-- Create missing Channel records for each orphan channelId
INSERT INTO "Channel" ("id", "name", "guildId", "createdAt", "updatedAt")
SELECT "channelId", 'deleted-channel', -1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM orphan_channel_ids;

-- Drop the temporary table after use
DROP TABLE orphan_channel_ids;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
