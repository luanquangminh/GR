/*
  Warnings:

  - You are about to drop the column `number_of_children` on the `staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "staff" DROP COLUMN "number_of_children";

-- CreateTable
CREATE TABLE "children" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birth_year" INTEGER,
    "staff_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "children_staff_id_idx" ON "children"("staff_id");

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
