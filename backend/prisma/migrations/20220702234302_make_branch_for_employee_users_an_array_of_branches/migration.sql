/*
  Warnings:

  - You are about to drop the column `branch_id` on the `employees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_branch_id_fkey";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "branch_id";

-- CreateTable
CREATE TABLE "_BranchToEmployee" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BranchToEmployee_AB_unique" ON "_BranchToEmployee"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchToEmployee_B_index" ON "_BranchToEmployee"("B");

-- AddForeignKey
ALTER TABLE "_BranchToEmployee" ADD FOREIGN KEY ("A") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToEmployee" ADD FOREIGN KEY ("B") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
