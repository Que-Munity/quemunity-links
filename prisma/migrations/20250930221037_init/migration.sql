/*
  Warnings:

  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "profiles_userId_key";

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN "sauce" TEXT;
ALTER TABLE "recipes" ADD COLUMN "seasoningRub" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "profiles";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "name" TEXT,
    "image" TEXT,
    "emailVerified" DATETIME,
    "bio" TEXT,
    "location" TEXT,
    "smokerType" TEXT,
    "experienceLevel" TEXT DEFAULT 'beginner',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionStatus" TEXT DEFAULT 'free',
    "subscriptionTier" TEXT DEFAULT 'free',
    "subscriptionEnds" DATETIME,
    "adFree" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_users" ("email", "emailVerified", "id", "image", "name", "username") SELECT "email", "emailVerified", "id", "image", "name", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
