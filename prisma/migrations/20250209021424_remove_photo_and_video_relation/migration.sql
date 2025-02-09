/*
  Warnings:

  - You are about to drop the column `photoId` on the `VideoPrediction` table. All the data in the column will be lost.
  - Made the column `videoPredictionId` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "deletedAt" DATETIME,
    "videoPredictionId" TEXT NOT NULL,
    CONSTRAINT "Video_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Video_videoPredictionId_fkey" FOREIGN KEY ("videoPredictionId") REFERENCES "VideoPrediction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("createdAt", "deletedAt", "id", "photoId", "url", "userId", "videoPredictionId") SELECT "createdAt", "deletedAt", "id", "photoId", "url", "userId", "videoPredictionId" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE UNIQUE INDEX "Video_videoPredictionId_key" ON "Video"("videoPredictionId");
CREATE TABLE "new_VideoPrediction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "status" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "VideoPrediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VideoPrediction" ("createdAt", "deletedAt", "id", "requestId", "status", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "id", "requestId", "status", "updatedAt", "userId" FROM "VideoPrediction";
DROP TABLE "VideoPrediction";
ALTER TABLE "new_VideoPrediction" RENAME TO "VideoPrediction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
