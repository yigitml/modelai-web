/*
  Warnings:

  - You are about to drop the `_PhotoToPhotoPrediction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `videoId` on the `VideoPrediction` table. All the data in the column will be lost.
  - Added the required column `photoPredictionId` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoPredictionId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_PhotoToPhotoPrediction_B_index";

-- DropIndex
DROP INDEX "_PhotoToPhotoPrediction_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PhotoToPhotoPrediction";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deletedAt" DATETIME,
    "photoPredictionId" TEXT NOT NULL,
    CONSTRAINT "Photo_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Photo_photoPredictionId_fkey" FOREIGN KEY ("photoPredictionId") REFERENCES "PhotoPrediction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("createdAt", "deletedAt", "id", "modelId", "url", "userId") SELECT "createdAt", "deletedAt", "id", "modelId", "url", "userId" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
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
INSERT INTO "new_Video" ("createdAt", "deletedAt", "id", "photoId", "url", "userId") SELECT "createdAt", "deletedAt", "id", "photoId", "url", "userId" FROM "Video";
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
CREATE UNIQUE INDEX "VideoPrediction_requestId_key" ON "VideoPrediction"("requestId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
