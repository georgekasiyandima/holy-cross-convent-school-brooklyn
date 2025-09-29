/*
  Warnings:

  - You are about to drop the `weather_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "weather_logs";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_staff_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "grade" TEXT,
    "subjects" TEXT,
    "qualifications" TEXT,
    "experience" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'TEACHING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_staff_members" ("bio", "createdAt", "email", "experience", "grade", "id", "imageUrl", "isActive", "name", "order", "phone", "qualifications", "role", "subjects", "updatedAt") SELECT "bio", "createdAt", "email", "experience", "grade", "id", "imageUrl", "isActive", "name", "order", "phone", "qualifications", "role", "subjects", "updatedAt" FROM "staff_members";
DROP TABLE "staff_members";
ALTER TABLE "new_staff_members" RENAME TO "staff_members";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
