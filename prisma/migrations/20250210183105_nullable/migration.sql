/*
  Warnings:

  - Made the column `photoId` on table `VideoPrediction` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VideoPrediction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "status" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    CONSTRAINT "VideoPrediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VideoPrediction_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VideoPrediction" ("createdAt", "deletedAt", "id", "photoId", "requestId", "status", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "id", "photoId", "requestId", "status", "updatedAt", "userId" FROM "VideoPrediction";
DROP TABLE "VideoPrediction";
ALTER TABLE "new_VideoPrediction" RENAME TO "VideoPrediction";
CREATE UNIQUE INDEX "VideoPrediction_requestId_key" ON "VideoPrediction"("requestId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
