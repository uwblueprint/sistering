/*
  Warnings:

  - The primary key for the `user_invites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pid` on the `user_invites` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `user_invites` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `user_invites` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "user_invites" DROP CONSTRAINT "user_invites_pkey",
DROP COLUMN "pid",
ADD COLUMN     "uuid" TEXT NOT NULL,
ADD CONSTRAINT "user_invites_pkey" PRIMARY KEY ("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_invites_email_key" ON "user_invites"("email");
