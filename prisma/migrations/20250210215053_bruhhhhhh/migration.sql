/*
  Warnings:

  - Added the required column `modelId` to the `PhotoPrediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photoId` to the `VideoPrediction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PhotoPrediction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "status" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "modelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "PhotoPrediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PhotoPrediction" ("createdAt", "deletedAt", "id", "requestId", "status", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "id", "requestId", "status", "updatedAt", "userId" FROM "PhotoPrediction";
DROP TABLE "PhotoPrediction";
ALTER TABLE "new_PhotoPrediction" RENAME TO "PhotoPrediction";
CREATE UNIQUE INDEX "PhotoPrediction_requestId_key" ON "PhotoPrediction"("requestId");
CREATE TABLE "new_VideoPrediction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "status" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "photoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "VideoPrediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VideoPrediction" ("createdAt", "deletedAt", "id", "requestId", "status", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "id", "requestId", "status", "updatedAt", "userId" FROM "VideoPrediction";
DROP TABLE "VideoPrediction";
ALTER TABLE "new_VideoPrediction" RENAME TO "VideoPrediction";
CREATE UNIQUE INDEX "VideoPrediction_requestId_key" ON "VideoPrediction"("requestId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
