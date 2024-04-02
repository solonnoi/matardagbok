/*
  Warnings:

  - You are about to drop the column `date` on the `FoodEntry` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FoodEntry" DROP COLUMN "date",
ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
