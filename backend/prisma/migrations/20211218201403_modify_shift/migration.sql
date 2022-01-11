/*
  Warnings:

  - You are about to drop the column `repeat_end` on the `shifts` table. All the data in the column will be lost.
  - You are about to drop the column `repeat_interval` on the `shifts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shifts" DROP COLUMN "repeat_end",
DROP COLUMN "repeat_interval";
