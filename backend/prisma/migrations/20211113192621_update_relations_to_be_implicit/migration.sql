/*
  Warnings:

  - You are about to drop the column `userId` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `responsibilitie` on the `postings` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `volunteers` table. All the data in the column will be lost.
  - You are about to drop the `volunteers_on_prerequisites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `volunteers_on_skills` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `volunteers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `responsibilities` to the `postings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_userId_fkey";

-- DropForeignKey
ALTER TABLE "volunteers" DROP CONSTRAINT "volunteers_userId_fkey";

-- DropForeignKey
ALTER TABLE "volunteers_on_prerequisites" DROP CONSTRAINT "volunteers_on_prerequisites_prerequisites_id_fkey";

-- DropForeignKey
ALTER TABLE "volunteers_on_prerequisites" DROP CONSTRAINT "volunteers_on_prerequisites_volunteers_id_fkey";

-- DropForeignKey
ALTER TABLE "volunteers_on_skills" DROP CONSTRAINT "volunteers_on_skills_skills_id_fkey";

-- DropForeignKey
ALTER TABLE "volunteers_on_skills" DROP CONSTRAINT "volunteers_on_skills_volunteer_id_fkey";

-- DropIndex
DROP INDEX "employees_userId_key";

-- DropIndex
DROP INDEX "volunteers_userId_key";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "userId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "employees_id_seq";

-- AlterTable
ALTER TABLE "postings" DROP COLUMN "responsibilitie",
ADD COLUMN     "responsibilities" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "volunteers" DROP COLUMN "userId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "volunteers_id_seq";

-- DropTable
DROP TABLE "volunteers_on_prerequisites";

-- DropTable
DROP TABLE "volunteers_on_skills";

-- CreateTable
CREATE TABLE "_SkillToVolunteer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SkillToVolunteer_AB_unique" ON "_SkillToVolunteer"("A", "B");

-- CreateIndex
CREATE INDEX "_SkillToVolunteer_B_index" ON "_SkillToVolunteer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "employees_id_key" ON "employees"("id");

-- CreateIndex
CREATE UNIQUE INDEX "volunteers_id_key" ON "volunteers"("id");

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToVolunteer" ADD FOREIGN KEY ("A") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToVolunteer" ADD FOREIGN KEY ("B") REFERENCES "volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
