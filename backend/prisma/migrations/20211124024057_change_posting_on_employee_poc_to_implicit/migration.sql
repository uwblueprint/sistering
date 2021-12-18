/*
  Warnings:

  - You are about to drop the `postings_on_employees_pocs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "postings_on_employees_pocs" DROP CONSTRAINT "postings_on_employees_pocs_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "postings_on_employees_pocs" DROP CONSTRAINT "postings_on_employees_pocs_posting_id_fkey";

-- DropTable
DROP TABLE "postings_on_employees_pocs";

-- CreateTable
CREATE TABLE "_EmployeeToPosting" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToPosting_AB_unique" ON "_EmployeeToPosting"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToPosting_B_index" ON "_EmployeeToPosting"("B");

-- AddForeignKey
ALTER TABLE "_EmployeeToPosting" ADD FOREIGN KEY ("A") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToPosting" ADD FOREIGN KEY ("B") REFERENCES "postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
