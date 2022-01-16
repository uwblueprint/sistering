/*
  Warnings:

  - A unique constraint covering the columns `[shifts_id,userId]` on the table `signups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "signups_shifts_id_userId_key" ON "signups"("shifts_id", "userId");

-- AddForeignKey
ALTER TABLE "signups" ADD CONSTRAINT "signups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
