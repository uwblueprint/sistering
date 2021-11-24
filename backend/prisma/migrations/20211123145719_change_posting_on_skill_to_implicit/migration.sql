/*
  Warnings:

  - You are about to drop the `postings_on_skills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "postings_on_skills" DROP CONSTRAINT "postings_on_skills_postings_id_fkey";

-- DropForeignKey
ALTER TABLE "postings_on_skills" DROP CONSTRAINT "postings_on_skills_skills_id_fkey";

-- DropTable
DROP TABLE "postings_on_skills";

-- CreateTable
CREATE TABLE "_PostingToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostingToSkill_AB_unique" ON "_PostingToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_PostingToSkill_B_index" ON "_PostingToSkill"("B");

-- AddForeignKey
ALTER TABLE "_PostingToSkill" ADD FOREIGN KEY ("A") REFERENCES "postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostingToSkill" ADD FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
