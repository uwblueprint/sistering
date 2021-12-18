-- DropForeignKey
ALTER TABLE "shifts" DROP CONSTRAINT "shifts_posting_id_fkey";

-- DropIndex
DROP INDEX "skills_name_key";

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_posting_id_fkey" FOREIGN KEY ("posting_id") REFERENCES "postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
