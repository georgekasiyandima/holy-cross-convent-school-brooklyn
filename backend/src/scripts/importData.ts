#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

interface ExportPayload {
  exportedAt: string;
  counts: Record<string, number>;
  data: Record<string, any[]>;
}

const prisma = new PrismaClient();
const prismaAny = prisma as any;

function resolveInputPath(): string {
  const argPath = process.argv[2];
  if (argPath) {
    return path.resolve(process.cwd(), argPath);
  }
  return path.resolve(__dirname, '../../prisma/data-transfer/latest-import.json');
}

async function safeDeleteMany(model: string) {
  const modelClient = prismaAny[model];
  if (!modelClient || typeof modelClient.deleteMany !== 'function') {
    return;
  }
  await modelClient.deleteMany();
}

async function safeCreateMany(model: string, items: any[]) {
  if (!items || items.length === 0) {
    return;
  }

  const modelClient = prismaAny[model];
  if (!modelClient || typeof modelClient.createMany !== 'function') {
    console.warn(`⚠️  Skipping import for ${model} (model not found in Prisma client).`);
    return;
  }

  await modelClient.createMany({ data: items, skipDuplicates: true });
}

async function resetSequence(table: string, column: string) {
  try {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"${table}"', '${column}'), COALESCE((SELECT MAX("${column}") FROM "${table}"), 0) + 1, false);`
    );
  } catch (error) {
    console.warn(`⚠️  Could not reset sequence for ${table}.${column}:`, error instanceof Error ? error.message : error);
  }
}

async function main() {
  const inputPath = resolveInputPath();
  console.log(`📥 Importing data from ${inputPath}`);

  const raw = await fs.readFile(inputPath, 'utf8');
  const payload = JSON.parse(raw) as ExportPayload;
  const data = payload.data;

  const totalRecords = Object.values(payload.counts || {}).reduce(
    (sum, value) => sum + (typeof value === 'number' ? value : 0),
    0
  );

  if (totalRecords === 0) {
    console.warn('⚠️  Import file contains zero records. Aborting to avoid wiping the database.');
    console.warn('⚠️  Generate a fresh export from your source database and try again.');
    return;
  }

  console.log('🧹 Clearing existing records...');
  // Remove dependents first
  await safeDeleteMany('applicationDocument');
  await safeDeleteMany('application');
  await safeDeleteMany('galleryItem');
  await safeDeleteMany('album');
  await safeDeleteMany('newsArticle');
  await safeDeleteMany('event');
  await safeDeleteMany('academicCalendar');
  await safeDeleteMany('term');
  await safeDeleteMany('boardMember');
  await safeDeleteMany('staffMember');
  await safeDeleteMany('newsletter');
  await safeDeleteMany('policy');
  await safeDeleteMany('vacancy');
  await safeDeleteMany('report');
  await safeDeleteMany('schoolStatistics');
  await safeDeleteMany('documentType');
  if ((data.users ?? []).length > 0) {
    await safeDeleteMany('user');
  }

  console.log('⬆️  Inserting records...');

  const albums = data.albums ?? [];
  const albumCoverMap = new Map<string, string | null>();
  for (const album of albums) {
    albumCoverMap.set(album.id, album.coverImageId ?? null);
    album.coverImageId = null;
  }

  if ((data.users ?? []).length > 0) {
    await safeCreateMany('user', data.users ?? []);
  }
  await safeCreateMany('staffMember', data.staffMembers ?? []);
  await safeCreateMany('boardMember', data.boardMembers ?? []);
  await safeCreateMany('newsArticle', data.newsArticles ?? []);
  await safeCreateMany('event', data.events ?? []);
  await safeCreateMany('academicCalendar', data.academicCalendar ?? []);
  await safeCreateMany('term', data.terms ?? []);
  await safeCreateMany('policy', data.policies ?? []);
  await safeCreateMany('vacancy', data.vacancies ?? []);
  await safeCreateMany('newsletter', data.newsletters ?? []);
  await safeCreateMany('report', data.reports ?? []);
  await safeCreateMany('documentType', data.documentTypes ?? []);
  await safeCreateMany('schoolStatistics', data.schoolStatistics ?? []);
  await safeCreateMany('album', albums);
  await safeCreateMany('galleryItem', data.galleryItems ?? []);
  await safeCreateMany('application', data.applications ?? []);
  await safeCreateMany('applicationDocument', data.applicationDocuments ?? []);

  // Restore album cover references
  if (albumCoverMap.size > 0) {
    console.log('🎨 Restoring album cover references...');
    for (const [albumId, coverId] of albumCoverMap.entries()) {
      if (!coverId) continue;
      try {
        await prisma.album.update({
          where: { id: albumId },
          data: { coverImageId: coverId }
        });
      } catch (error) {
        console.warn(`⚠️  Unable to set cover image for album ${albumId}:`, error instanceof Error ? error.message : error);
      }
    }
  }

  await resetSequence('applications', 'id');
  await resetSequence('application_documents', 'id');

  console.log('✅ Import completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Failed to import data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
