-- CreateEnum
CREATE TYPE "SignupStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PostingType" AS ENUM ('INDIVIDUAL', 'GROUP');

-- CreateTable
CREATE TABLE "postings" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" "PostingType" NOT NULL,
    "purpose" TEXT NOT NULL,
    "responsibilitie" TEXT NOT NULL,
    "tasks" TEXT NOT NULL,
    "desired_qualities" TEXT NOT NULL,
    "mandatory_activities" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "working_conditions" TEXT NOT NULL,
    "num_volunteers" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "postings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prerequisites" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,

    CONSTRAINT "prerequisites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shifts" (
    "id" SERIAL NOT NULL,
    "posting_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "repeat_interval" INTEGER,
    "repeat_end" TIMESTAMP(3),

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signups" (
    "id" SERIAL NOT NULL,
    "shifts_id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "SignupStatus" NOT NULL,
    "num_volunteers" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "signups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availabilities" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "repeat_interval" INTEGER,
    "repeat_end" TIMESTAMP(3),

    CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "default_branch_id" INTEGER NOT NULL,
    "hire_date" TIMESTAMP(3) NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "pronouns" TEXT NOT NULL,

    CONSTRAINT "volunteers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "branch_id" INTEGER NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postings_on_skills" (
    "postings_id" INTEGER NOT NULL,
    "skills_id" INTEGER NOT NULL,

    CONSTRAINT "postings_on_skills_pkey" PRIMARY KEY ("postings_id","skills_id")
);

-- CreateTable
CREATE TABLE "postings_on_prerequisites" (
    "postings_id" INTEGER NOT NULL,
    "prerequisites_id" INTEGER NOT NULL,

    CONSTRAINT "postings_on_prerequisites_pkey" PRIMARY KEY ("postings_id","prerequisites_id")
);

-- CreateTable
CREATE TABLE "postings_on_employees_pocs" (
    "posting_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "postings_on_employees_pocs_pkey" PRIMARY KEY ("posting_id","employee_id")
);

-- CreateTable
CREATE TABLE "volunteers_on_skills" (
    "volunteer_id" INTEGER NOT NULL,
    "skills_id" INTEGER NOT NULL,

    CONSTRAINT "volunteers_on_skills_pkey" PRIMARY KEY ("volunteer_id","skills_id")
);

-- CreateTable
CREATE TABLE "volunteers_on_prerequisites" (
    "volunteers_id" INTEGER NOT NULL,
    "prerequisites_id" INTEGER NOT NULL,

    CONSTRAINT "volunteers_on_prerequisites_pkey" PRIMARY KEY ("volunteers_id","prerequisites_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "volunteers_userId_key" ON "volunteers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "employees_userId_key" ON "employees"("userId");

-- AddForeignKey
ALTER TABLE "postings" ADD CONSTRAINT "postings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_posting_id_fkey" FOREIGN KEY ("posting_id") REFERENCES "postings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signups" ADD CONSTRAINT "signups_shifts_id_fkey" FOREIGN KEY ("shifts_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_default_branch_id_fkey" FOREIGN KEY ("default_branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postings_on_skills" ADD CONSTRAINT "postings_on_skills_postings_id_fkey" FOREIGN KEY ("postings_id") REFERENCES "postings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postings_on_skills" ADD CONSTRAINT "postings_on_skills_skills_id_fkey" FOREIGN KEY ("skills_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postings_on_prerequisites" ADD CONSTRAINT "postings_on_prerequisites_postings_id_fkey" FOREIGN KEY ("postings_id") REFERENCES "postings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postings_on_prerequisites" ADD CONSTRAINT "postings_on_prerequisites_prerequisites_id_fkey" FOREIGN KEY ("prerequisites_id") REFERENCES "prerequisites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postings_on_employees_pocs" ADD CONSTRAINT "postings_on_employees_pocs_posting_id_fkey" FOREIGN KEY ("posting_id") REFERENCES "postings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postings_on_employees_pocs" ADD CONSTRAINT "postings_on_employees_pocs_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers_on_skills" ADD CONSTRAINT "volunteers_on_skills_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "volunteers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers_on_skills" ADD CONSTRAINT "volunteers_on_skills_skills_id_fkey" FOREIGN KEY ("skills_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers_on_prerequisites" ADD CONSTRAINT "volunteers_on_prerequisites_volunteers_id_fkey" FOREIGN KEY ("volunteers_id") REFERENCES "volunteers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers_on_prerequisites" ADD CONSTRAINT "volunteers_on_prerequisites_prerequisites_id_fkey" FOREIGN KEY ("prerequisites_id") REFERENCES "prerequisites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
