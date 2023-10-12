/*
  Warnings:

  - The values [HOST] on the enum `confirmationStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `isHost` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "confirmationStatus_new" AS ENUM ('PENDING', 'ATTENDING', 'NOT_ATTENDING');
ALTER TABLE "Guest" ALTER COLUMN "confirmationStatus" TYPE "confirmationStatus_new" USING ("confirmationStatus"::text::"confirmationStatus_new");
ALTER TYPE "confirmationStatus" RENAME TO "confirmationStatus_old";
ALTER TYPE "confirmationStatus_new" RENAME TO "confirmationStatus";
DROP TYPE "confirmationStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_eventId_fkey";

-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "isHost" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
