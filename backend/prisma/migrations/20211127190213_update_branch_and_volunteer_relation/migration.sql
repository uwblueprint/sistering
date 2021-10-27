/*
  Warnings:

  - You are about to drop the column `default_branch_id` on the `volunteers` table. All the data in the column will be lost.
  - You are about to drop the column `hire_date` on the `volunteers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "volunteers" DROP CONSTRAINT "volunteers_default_branch_id_fkey";

-- AlterTable
ALTER TABLE "volunteers" DROP COLUMN "default_branch_id",
DROP COLUMN "hire_date";

-- CreateTable
CREATE TABLE "_BranchToVolunteer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BranchToVolunteer_AB_unique" ON "_BranchToVolunteer"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchToVolunteer_B_index" ON "_BranchToVolunteer"("B");

-- AddForeignKey
ALTER TABLE "_BranchToVolunteer" ADD FOREIGN KEY ("A") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToVolunteer" ADD FOREIGN KEY ("B") REFERENCES "volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
