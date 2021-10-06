-- CreateEnum
CREATE TYPE "Letters" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "entities" (
    "id" SERIAL NOT NULL,
    "string_field" TEXT NOT NULL,
    "int_field" INTEGER NOT NULL,
    "enum_field" "Letters" NOT NULL,
    "string_array_field" TEXT[],
    "bool_field" BOOLEAN NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_content" TEXT NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "auth_id" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_id_key" ON "users"("auth_id");
