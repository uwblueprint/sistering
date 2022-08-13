-- DropForeignKey
ALTER TABLE "signups" DROP CONSTRAINT "signups_userId_fkey";

-- AddForeignKey
ALTER TABLE "signups" ADD CONSTRAINT "signups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
