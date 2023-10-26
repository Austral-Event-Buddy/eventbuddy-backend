-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "isHost" BOOLEAN NOT NULL DEFAULT false;

/*
  Warnings:

  - The values [HOST] on the enum `confirmationStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `isHost` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "confirmationStatus_new" AS ENUM ('PENDING', 'ATTENDING', 'NOT_ATTENDING');

-- Update rows where confirmationStatus is "HOST" and set isHost to true
UPDATE "Guest"
  SET "isHost" = true
  WHERE "confirmationStatus" = 'HOST';

ALTER TABLE "Guest" ALTER COLUMN "confirmationStatus" TYPE "confirmationStatus_new" USING (
  CASE
    WHEN "confirmationStatus" = 'HOST' THEN 'ATTENDING'
    ELSE "confirmationStatus"
  END::text::"confirmationStatus_new"
);

ALTER TYPE "confirmationStatus" RENAME TO "confirmationStatus_old";
ALTER TYPE "confirmationStatus_new" RENAME TO "confirmationStatus";
DROP TYPE "confirmationStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_eventId_fkey";

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
