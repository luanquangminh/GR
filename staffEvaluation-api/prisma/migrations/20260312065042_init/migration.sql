-- CreateEnum
CREATE TYPE "AppRole" AS ENUM ('admin', 'moderator', 'user');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "period_status" AS ENUM ('draft', 'active', 'closed');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "microsoft_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "staff_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "AppRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizationunits" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "organizationunits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "emailh" TEXT,
    "emails" TEXT,
    "staffcode" TEXT,
    "sex" "gender",
    "birthday" TIMESTAMP(3),
    "mobile" TEXT,
    "academicrank" TEXT,
    "academicdegree" TEXT,
    "position" TEXT,
    "is_party_member" BOOLEAN NOT NULL DEFAULT false,
    "organizationunitid" INTEGER,
    "bidv" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "organizationunitid" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff2groups" (
    "id" SERIAL NOT NULL,
    "staffid" INTEGER NOT NULL,
    "groupid" INTEGER NOT NULL,

    CONSTRAINT "staff2groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "subjectid" TEXT,
    "name" TEXT,
    "groupid" INTEGER,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_periods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "period_status" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluation_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" SERIAL NOT NULL,
    "reviewerid" INTEGER NOT NULL,
    "victimid" INTEGER NOT NULL,
    "groupid" INTEGER NOT NULL,
    "questionid" INTEGER NOT NULL,
    "periodid" INTEGER NOT NULL,
    "point" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieddate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_microsoft_id_key" ON "users"("microsoft_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_staff_id_key" ON "profiles"("staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_key" ON "user_roles"("user_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "staff_staffcode_key" ON "staff"("staffcode");

-- CreateIndex
CREATE INDEX "staff_organizationunitid_idx" ON "staff"("organizationunitid");

-- CreateIndex
CREATE INDEX "staff_emails_idx" ON "staff"("emails");

-- CreateIndex
CREATE INDEX "groups_organizationunitid_idx" ON "groups"("organizationunitid");

-- CreateIndex
CREATE INDEX "staff2groups_staffid_idx" ON "staff2groups"("staffid");

-- CreateIndex
CREATE INDEX "staff2groups_groupid_idx" ON "staff2groups"("groupid");

-- CreateIndex
CREATE UNIQUE INDEX "staff2groups_staffid_groupid_key" ON "staff2groups"("staffid", "groupid");

-- CreateIndex
CREATE INDEX "evaluations_reviewerid_idx" ON "evaluations"("reviewerid");

-- CreateIndex
CREATE INDEX "evaluations_victimid_idx" ON "evaluations"("victimid");

-- CreateIndex
CREATE INDEX "evaluations_groupid_idx" ON "evaluations"("groupid");

-- CreateIndex
CREATE INDEX "evaluations_questionid_idx" ON "evaluations"("questionid");

-- CreateIndex
CREATE INDEX "evaluations_periodid_idx" ON "evaluations"("periodid");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_reviewerid_victimid_groupid_questionid_periodid_key" ON "evaluations"("reviewerid", "victimid", "groupid", "questionid", "periodid");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_organizationunitid_fkey" FOREIGN KEY ("organizationunitid") REFERENCES "organizationunits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_organizationunitid_fkey" FOREIGN KEY ("organizationunitid") REFERENCES "organizationunits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff2groups" ADD CONSTRAINT "staff2groups_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff2groups" ADD CONSTRAINT "staff2groups_staffid_fkey" FOREIGN KEY ("staffid") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_questionid_fkey" FOREIGN KEY ("questionid") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_reviewerid_fkey" FOREIGN KEY ("reviewerid") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_victimid_fkey" FOREIGN KEY ("victimid") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_periodid_fkey" FOREIGN KEY ("periodid") REFERENCES "evaluation_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
