/*
  Warnings:

  - You are about to drop the column `christianName` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `vacancies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[coverImageId]` on the table `albums` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `learnerName` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applications" DROP COLUMN "christianName",
ADD COLUMN     "currentAssigneeId" TEXT,
ADD COLUMN     "currentAssigneeRole" TEXT,
ADD COLUMN     "currentStageKey" TEXT NOT NULL DEFAULT 'DOCUMENT_VERIFICATION',
ADD COLUMN     "currentStageStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "learnerName" TEXT NOT NULL,
ADD COLUMN     "nextActionDue" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "gallery_items" ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "vacancies" DROP COLUMN "isActive",
ADD COLUMN     "applicationEmail" TEXT,
ADD COLUMN     "applicationInstructions" TEXT,
ADD COLUMN     "closingDate" TIMESTAMP(3),
ADD COLUMN     "employmentType" TEXT DEFAULT 'FULL_TIME',
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isUrgent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT DEFAULT 'Brooklyn, Cape Town',
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "qualifications" TEXT,
ADD COLUMN     "responsibilities" TEXT,
ADD COLUMN     "salaryRange" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "application_stages" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "stageKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assignedRole" TEXT NOT NULL,
    "assignedUserId" TEXT,
    "sequence" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "payload" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_timeline" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "stageKey" TEXT,
    "eventType" TEXT NOT NULL,
    "performedById" TEXT,
    "performedByName" TEXT,
    "notes" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_communications" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "recipientType" TEXT NOT NULL,
    "recipientAddress" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "type" TEXT,
    "tags" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "filePath" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "authorId" TEXT,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_stage_stageKey_idx" ON "application_stages"("applicationId", "stageKey");

-- CreateIndex
CREATE INDEX "application_stage_role_status_idx" ON "application_stages"("assignedRole", "status");

-- CreateIndex
CREATE INDEX "application_timeline_applicationId_idx" ON "application_timeline"("applicationId");

-- CreateIndex
CREATE INDEX "application_communications_applicationId_idx" ON "application_communications"("applicationId");

-- CreateIndex
CREATE INDEX "application_communications_status_channel_idx" ON "application_communications"("status", "channel");

-- CreateIndex
CREATE UNIQUE INDEX "albums_coverImageId_key" ON "albums"("coverImageId");

-- AddForeignKey
ALTER TABLE "application_stages" ADD CONSTRAINT "application_stages_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_timeline" ADD CONSTRAINT "application_timeline_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_communications" ADD CONSTRAINT "application_communications_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
