/*
  Warnings:

  - You are about to drop the column `userId` on the `employees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_branch_id_fkey";

-- DropIndex
DROP INDEX "employees_id_key";

-- DropIndex
DROP INDEX "employees_userId_key";

-- DropIndex
DROP INDEX "volunteers_id_key";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE;
