/*
  Warnings:

  - Added the required column `status` to the `postings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostingStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "postings" ADD COLUMN     "status" "PostingStatus" NOT NULL;
