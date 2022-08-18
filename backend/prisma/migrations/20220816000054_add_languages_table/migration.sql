/*
  Warnings:

  - You are about to drop the column `languages` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "languages";

-- DropEnum
DROP TYPE "Language";

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LanguageToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "languages_name_key" ON "languages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageToUser_AB_unique" ON "_LanguageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LanguageToUser_B_index" ON "_LanguageToUser"("B");

-- AddForeignKey
ALTER TABLE "_LanguageToUser" ADD FOREIGN KEY ("A") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageToUser" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
