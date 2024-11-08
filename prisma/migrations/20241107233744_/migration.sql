/*
  Warnings:

  - You are about to drop the column `formula` on the `Formula` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Formula" DROP COLUMN "formula",
ADD COLUMN     "outline" BOOLEAN;
