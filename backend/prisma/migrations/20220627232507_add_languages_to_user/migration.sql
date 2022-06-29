-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'FRENCH', 'ITALIAN', 'CHINESE', 'SPANISH', 'HINDI', 'RUSSIAN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "languages" TEXT[];
