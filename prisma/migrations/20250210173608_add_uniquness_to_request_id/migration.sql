/*
  Warnings:

  - A unique constraint covering the columns `[requestId]` on the table `PhotoPrediction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requestId]` on the table `Training` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requestId]` on the table `VideoPrediction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PhotoPrediction_requestId_key" ON "PhotoPrediction"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "Training_requestId_key" ON "Training"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoPrediction_requestId_key" ON "VideoPrediction"("requestId");
