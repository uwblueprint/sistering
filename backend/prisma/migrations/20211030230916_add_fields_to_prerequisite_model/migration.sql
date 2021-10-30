/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `prerequisites` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `requires_admin_verification` to the `prerequisites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prerequisites" ADD COLUMN     "requires_admin_verification" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "prerequisites_name_key" ON "prerequisites"("name");
