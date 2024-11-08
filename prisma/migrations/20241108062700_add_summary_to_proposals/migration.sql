/*
  Warnings:

  - Added the required column `summary` to the `proposals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "proposals" ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];
