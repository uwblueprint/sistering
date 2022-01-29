/*
  Warnings:

  - The primary key for the `signups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `signups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "signups" DROP CONSTRAINT "signups_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "signups_pkey" PRIMARY KEY ("shifts_id", "userId");
