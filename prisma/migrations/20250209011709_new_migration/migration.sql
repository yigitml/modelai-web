/*
  Warnings:

  - A unique constraint covering the columns `[modelId]` on the table `Training` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Model" ADD COLUMN "trainingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Training_modelId_key" ON "Training"("modelId");
