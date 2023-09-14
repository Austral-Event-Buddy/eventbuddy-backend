/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `Guest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Guest_userId_eventId_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Guest_userId_eventId_key" ON "Guest"("userId", "eventId");
