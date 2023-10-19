-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_userId_fkey";

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
