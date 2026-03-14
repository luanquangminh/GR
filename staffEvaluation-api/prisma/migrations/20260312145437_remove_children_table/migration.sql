/*
  Warnings:

  - You are about to drop the `children` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "children" DROP CONSTRAINT "children_staff_id_fkey";

-- DropTable
DROP TABLE "children";
