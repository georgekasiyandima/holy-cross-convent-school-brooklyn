-- CreateTable
CREATE TABLE "terms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "termNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_academic_calendar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "isHoliday" BOOLEAN NOT NULL DEFAULT false,
    "isExam" BOOLEAN NOT NULL DEFAULT false,
    "isPublicHoliday" BOOLEAN NOT NULL DEFAULT false,
    "grade" TEXT,
    "category" TEXT,
    "location" TEXT,
    "time" TEXT,
    "facebookLink" TEXT,
    "termId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "academic_calendar_termId_fkey" FOREIGN KEY ("termId") REFERENCES "terms" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_academic_calendar" ("createdAt", "description", "endDate", "grade", "id", "isExam", "isHoliday", "startDate", "title", "type", "updatedAt") SELECT "createdAt", "description", "endDate", "grade", "id", "isExam", "isHoliday", "startDate", "title", "type", "updatedAt" FROM "academic_calendar";
DROP TABLE "academic_calendar";
ALTER TABLE "new_academic_calendar" RENAME TO "academic_calendar";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "terms_year_termNumber_key" ON "terms"("year", "termNumber");
