/*
  Warnings:

  - Added the required column `title` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "title" TEXT NOT NULL;
