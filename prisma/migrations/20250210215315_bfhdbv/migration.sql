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
    CONSTRAINT "PhotoPrediction_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PhotoPrediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PhotoPrediction" ("createdAt", "deletedAt", "id", "modelId", "requestId", "status", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "id", "modelId", "requestId", "status", "updatedAt", "userId" FROM "PhotoPrediction";
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
    CONSTRAINT "VideoPrediction_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VideoPrediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VideoPrediction" ("createdAt", "deletedAt", "id", "photoId", "requestId", "status", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "id", "photoId", "requestId", "status", "updatedAt", "userId" FROM "VideoPrediction";
DROP TABLE "VideoPrediction";
ALTER TABLE "new_VideoPrediction" RENAME TO "VideoPrediction";
CREATE UNIQUE INDEX "VideoPrediction_requestId_key" ON "VideoPrediction"("requestId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
