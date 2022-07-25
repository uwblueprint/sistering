-- DropForeignKey
ALTER TABLE "signups" DROP CONSTRAINT "signups_shifts_id_fkey";

-- AddForeignKey
ALTER TABLE "signups" ADD CONSTRAINT "signups_shifts_id_fkey" FOREIGN KEY ("shifts_id") REFERENCES "shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
