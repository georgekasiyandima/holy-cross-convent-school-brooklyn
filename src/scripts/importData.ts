  await safeDeleteMany('vacancy');
  await safeDeleteMany('report');
  await safeDeleteMany('schoolStatistics');
  await safeDeleteMany('document');
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
  await safeCreateMany('document', data.documents ?? []);
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
