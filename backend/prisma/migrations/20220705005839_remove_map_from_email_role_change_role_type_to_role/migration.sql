/*
  Warnings:

  - You are about to drop the column `branch_id` on the `user_invites` table. All the data in the column will be lost.
  - Added the required column `role` to the `user_invites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_invites" DROP COLUMN "branch_id",
ADD COLUMN     "role" "Role" NOT NULL;
