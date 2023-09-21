/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId,id]` on the table `Guest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Guest_userId_eventId_id_key" ON "Guest"("userId", "eventId", "id");
