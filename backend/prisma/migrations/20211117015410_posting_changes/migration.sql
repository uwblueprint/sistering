/*
  Warnings:

  - You are about to drop the column `benefits` on the `postings` table. All the data in the column will be lost.
  - You are about to drop the column `desired_qualities` on the `postings` table. All the data in the column will be lost.
  - You are about to drop the column `mandatory_activities` on the `postings` table. All the data in the column will be lost.
  - You are about to drop the column `purpose` on the `postings` table. All the data in the column will be lost.
  - You are about to drop the column `responsibilitie` on the `postings` table. All the data in the column will be lost.
  - You are about to drop the column `tasks` on the `postings` table. All the data in the column will be lost.
  - You are about to drop the column `working_conditions` on the `postings` table. All the data in the column will be lost.
  - You are about to drop the `postings_on_prerequisites` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `auto_closing_date` to the `postings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `postings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `postings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `postings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "postings_on_prerequisites" DROP CONSTRAINT "postings_on_prerequisites_postings_id_fkey";

-- DropForeignKey
ALTER TABLE "postings_on_prerequisites" DROP CONSTRAINT "postings_on_prerequisites_prerequisites_id_fkey";

-- AlterTable
ALTER TABLE "postings" DROP COLUMN "benefits",
DROP COLUMN "desired_qualities",
DROP COLUMN "mandatory_activities",
DROP COLUMN "purpose",
DROP COLUMN "responsibilitie",
DROP COLUMN "tasks",
DROP COLUMN "working_conditions",
ADD COLUMN     "auto_closing_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "postings_on_prerequisites";
