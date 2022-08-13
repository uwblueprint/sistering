/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `volunteers` table. All the data in the column will be lost.
  - You are about to drop the column `pronouns` on the `volunteers` table. All the data in the column will be lost.
  - Added the required column `pronouns` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "pronouns" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "volunteers" DROP COLUMN "date_of_birth",
DROP COLUMN "pronouns";
