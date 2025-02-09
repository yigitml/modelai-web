/*
  Warnings:

  - Made the column `subscriptionId` on table `UserCredit` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserCredit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL DEFAULT 0,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "minimumBalance" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" DATETIME,
    CONSTRAINT "UserCredit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCredit_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserCredit" ("amount", "createdAt", "deletedAt", "id", "minimumBalance", "subscriptionId", "type", "updatedAt", "userId") SELECT "amount", "createdAt", "deletedAt", "id", "minimumBalance", "subscriptionId", "type", "updatedAt", "userId" FROM "UserCredit";
DROP TABLE "UserCredit";
ALTER TABLE "new_UserCredit" RENAME TO "UserCredit";
CREATE UNIQUE INDEX "UserCredit_userId_type_key" ON "UserCredit"("userId", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
