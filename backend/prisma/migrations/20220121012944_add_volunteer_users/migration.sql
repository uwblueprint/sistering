/*
  Warnings:

  - The values [User,Admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `default_branch_id` on the `volunteers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `volunteers` table. All the data in the column will be lost.
  - You are about to drop the `volunteers_on_prerequisites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `volunteers_on_skills` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `volunteers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'VOLUNTEER', 'EMPLOYEE');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "volunteers" DROP CONSTRAINT "volunteers_default_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "volunteers_on_prerequisites" DROP CONSTRAINT "volunteers_on_prerequisites_prerequisites_id_fkey";

-- DropForeignKey
ALTER TABLE "volunteers_on_prerequisites" DROP CONSTRAINT "volunteers_on_prerequisites_volunteers_id_fkey";

-- DropForeignKey
ALTER TABLE "volunteers_on_skills" DROP CONSTRAINT "volunteers_on_skills_skills_id_fkey";

-- DropForeignKey
ALTER TABLE "volunteers_on_skills" DROP CONSTRAINT "volunteers_on_skills_volunteer_id_fkey";

-- DropIndex
DROP INDEX "volunteers_userId_key";

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "employees_id_seq";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone_number" TEXT;

-- AlterTable
ALTER TABLE "volunteers" DROP COLUMN "default_branch_id",
DROP COLUMN "userId",
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

-- CreateTable
CREATE TABLE "_PrerequisiteToVolunteer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BranchToVolunteer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SkillToVolunteer_AB_unique" ON "_SkillToVolunteer"("A", "B");

-- CreateIndex
CREATE INDEX "_SkillToVolunteer_B_index" ON "_SkillToVolunteer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PrerequisiteToVolunteer_AB_unique" ON "_PrerequisiteToVolunteer"("A", "B");

-- CreateIndex
CREATE INDEX "_PrerequisiteToVolunteer_B_index" ON "_PrerequisiteToVolunteer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BranchToVolunteer_AB_unique" ON "_BranchToVolunteer"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchToVolunteer_B_index" ON "_BranchToVolunteer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "employees_id_key" ON "employees"("id");

-- CreateIndex
CREATE UNIQUE INDEX "volunteers_id_key" ON "volunteers"("id");

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToVolunteer" ADD FOREIGN KEY ("A") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToVolunteer" ADD FOREIGN KEY ("B") REFERENCES "volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrerequisiteToVolunteer" ADD FOREIGN KEY ("A") REFERENCES "prerequisites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrerequisiteToVolunteer" ADD FOREIGN KEY ("B") REFERENCES "volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToVolunteer" ADD FOREIGN KEY ("A") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToVolunteer" ADD FOREIGN KEY ("B") REFERENCES "volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
