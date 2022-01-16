/*
  Warnings:

  - Added the required column `note` to the `signups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "signups" ADD COLUMN     "note" TEXT NOT NULL;
