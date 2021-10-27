/*
  Warnings:

  - Added the required column `hire_date` to the `volunteers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "volunteers" ADD COLUMN     "hire_date" TIMESTAMP(3) NOT NULL;
