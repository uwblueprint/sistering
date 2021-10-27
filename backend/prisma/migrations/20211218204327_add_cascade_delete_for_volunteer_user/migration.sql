-- DropForeignKey
ALTER TABLE "volunteers" DROP CONSTRAINT "volunteers_id_fkey";

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
