/*
  Warnings:

  - You are about to drop the `_PrerequisiteToVolunteer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `availabilities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prerequisites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PrerequisiteToVolunteer" DROP CONSTRAINT "_PrerequisiteToVolunteer_A_fkey";

-- DropForeignKey
ALTER TABLE "_PrerequisiteToVolunteer" DROP CONSTRAINT "_PrerequisiteToVolunteer_B_fkey";

-- DropForeignKey
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_userId_fkey";

-- DropTable
DROP TABLE "_PrerequisiteToVolunteer";

-- DropTable
DROP TABLE "availabilities";

-- DropTable
DROP TABLE "prerequisites";
