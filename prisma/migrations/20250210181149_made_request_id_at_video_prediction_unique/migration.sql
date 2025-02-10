/*
  Warnings:

  - A unique constraint covering the columns `[requestId]` on the table `Training` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Training_requestId_key" ON "Training"("requestId");
