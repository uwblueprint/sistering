/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `skills` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");
