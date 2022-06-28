-- CreateTable
CREATE TABLE "user_invites" (
    "pid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,

    CONSTRAINT "user_invites_pkey" PRIMARY KEY ("pid")
);
