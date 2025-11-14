#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const prismaAny = prisma as any;

async function safeFindMany(model: string) {
  const modelClient = prismaAny[model];
  if (!modelClient || typeof modelClient.findMany !== 'function') {
    return [];
  }

  try {
    return await modelClient.findMany();
  } catch (error) {
    console.warn(`⚠️  Skipping model ${model}:`, error instanceof Error ? error.message : error);
    return [];
  }
}

async function main() {
  const exportDir = path.resolve(__dirname, '../../prisma/data-transfer');
  await fs.mkdir(exportDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').replace(/\..+/, '');
  const filePath = path.join(exportDir, `export-${timestamp}.json`);
  const latestPath = path.join(exportDir, 'latest-import.json');

  console.log('📦 Collecting data from local database...');

  const [
    users,
    staffMembers,
    boardMembers,
    newsArticles,
    events,
    academicCalendar,
    terms,
    applications,
    applicationDocuments,
    documentTypes,
    schoolStatistics,
    albums,
    galleryItems,
    newsletters,
    policies,
    vacancies,
    reports
  ] = await Promise.all([
    safeFindMany('user'),
    safeFindMany('staffMember'),
    safeFindMany('boardMember'),
    safeFindMany('newsArticle'),
    safeFindMany('event'),
    safeFindMany('academicCalendar'),
    safeFindMany('term'),
    safeFindMany('application'),
    safeFindMany('applicationDocument'),
    safeFindMany('documentType'),
    safeFindMany('schoolStatistics'),
    safeFindMany('album'),
    safeFindMany('galleryItem'),
    safeFindMany('newsletter'),
    safeFindMany('policy'),
    safeFindMany('vacancy'),
    safeFindMany('report')
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    counts: {
      users: users.length,
      staffMembers: staffMembers.length,
      boardMembers: boardMembers.length,
      newsArticles: newsArticles.length,
      events: events.length,
      academicCalendar: academicCalendar.length,
      terms: terms.length,
      applications: applications.length,
      applicationDocuments: applicationDocuments.length,
      documentTypes: documentTypes.length,
      schoolStatistics: schoolStatistics.length,
      albums: albums.length,
      galleryItems: galleryItems.length,
      newsletters: newsletters.length,
      policies: policies.length,
      vacancies: vacancies.length,
      reports: reports.length
    },
    data: {
      users,
      staffMembers,
      boardMembers,
      newsArticles,
      events,
      academicCalendar,
      terms,
      applications,
      applicationDocuments,
      documentTypes,
      schoolStatistics,
      albums,
      galleryItems,
      newsletters,
      policies,
      vacancies,
      reports
    }
  };

  await fs.writeFile(filePath, JSON.stringify(payload, null, 2));
  await fs.writeFile(latestPath, JSON.stringify(payload, null, 2));

  console.log(`✅ Data exported to ${filePath}`);
  console.log(`🔁 Latest export copied to ${latestPath}`);
  console.log('ℹ️  Remember to keep these files secure and avoid committing them to git.');
}

main()
  .catch((error) => {
    console.error('❌ Failed to export data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
