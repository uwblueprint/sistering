/*
  Warnings:

  - The values [ARCHIVED] on the enum `PostingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostingStatus_new" AS ENUM ('DRAFT', 'PUBLISHED');
ALTER TABLE "postings" ALTER COLUMN "status" TYPE "PostingStatus_new" USING ("status"::text::"PostingStatus_new");
ALTER TYPE "PostingStatus" RENAME TO "PostingStatus_old";
ALTER TYPE "PostingStatus_new" RENAME TO "PostingStatus";
DROP TYPE "PostingStatus_old";
COMMIT;
