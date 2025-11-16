#!/usr/bin/env ts-node
/**
 * Upload gallery items and documents to Cloudinary
 * Migrates local files to Cloudinary and updates database URLs
 */
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
}

async function uploadFileToCloudinary(
  filePath: string, 
  folder: string = 'holy-cross',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: folder,
        resource_type: resourceType,
        transformation: resourceType === 'image' ? [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ] : undefined
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url
          });
        } else {
          reject(new Error('Upload failed'));
        }
      }
    );
  });
}

async function migrateGalleryItems() {
  console.log('🖼️  Migrating Gallery Items to Cloudinary\n');

  // Verify Cloudinary config
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary credentials not set!');
    process.exit(1);
  }

  console.log(`✅ Cloudinary configured: ${process.env.CLOUDINARY_CLOUD_NAME}\n`);

  // Get all gallery items
  const galleryItems = await prisma.galleryItem.findMany({
    where: { isPublished: true }
  });

  console.log(`Found ${galleryItems.length} gallery items\n`);

  const uploadsDir = path.join(process.cwd(), 'uploads', 'gallery');
  
  if (!fs.existsSync(uploadsDir)) {
    console.error('❌ Gallery uploads directory not found:', uploadsDir);
    return { uploaded: 0, updated: 0, skipped: 0, errors: 0 };
  }

  let uploaded = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of galleryItems) {
    try {
      // Extract filename from filePath
      const filename = path.basename(item.filePath);
      const localFilePath = path.join(uploadsDir, filename);

      if (!fs.existsSync(localFilePath)) {
        console.log(`⚠️  File not found for ${item.title}: ${filename}`);
        skipped++;
        continue;
      }

      // Determine resource type
      const isVideo = item.type === 'VIDEO' || /\.(mp4|mov|avi|webm)$/i.test(filename);
      const resourceType = isVideo ? 'video' : 'image';

      // Upload to Cloudinary
      console.log(`📤 Uploading ${filename} (${item.title})...`);
      const result = await uploadFileToCloudinary(
        localFilePath, 
        'holy-cross/gallery',
        resourceType
      );

      // Update database
      await prisma.galleryItem.update({
        where: { id: item.id },
        data: { 
          filePath: result.secure_url,
          fileName: path.basename(result.secure_url)
        }
      });

      console.log(`✅ Updated ${item.title}`);
      uploaded++;
      updated++;

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      console.error(`❌ Error processing ${item.title}:`, error.message);
      errors++;
    }
  }

  return { uploaded, updated, skipped, errors };
}

async function migrateDocuments() {
  console.log('\n📄 Migrating Documents to Cloudinary\n');

  // Get all documents
  const documents = await prisma.document.findMany({
    where: { isPublished: true }
  });

  console.log(`Found ${documents.length} documents\n`);

  const uploadsDir = path.join(process.cwd(), 'uploads', 'documents');
  
  if (!fs.existsSync(uploadsDir)) {
    console.error('❌ Documents uploads directory not found:', uploadsDir);
    return { uploaded: 0, updated: 0, skipped: 0, errors: 0 };
  }

  let uploaded = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const doc of documents) {
    try {
      if (!doc.filePath && !doc.fileUrl) {
        console.log(`⏭️  Skipping ${doc.title} - no file path`);
        skipped++;
        continue;
      }

      // Get filename from filePath or fileUrl
      const filePath = doc.filePath || doc.fileUrl || '';
      const filename = path.basename(filePath);
      const localFilePath = path.join(uploadsDir, filename);

      if (!fs.existsSync(localFilePath)) {
        console.log(`⚠️  File not found for ${doc.title}: ${filename}`);
        skipped++;
        continue;
      }

      // Determine resource type (PDFs and other docs are 'raw')
      const resourceType = /\.(pdf|doc|docx|txt)$/i.test(filename) ? 'raw' : 'image';

      // Upload to Cloudinary
      console.log(`📤 Uploading ${filename} (${doc.title})...`);
      const result = await uploadFileToCloudinary(
        localFilePath,
        'holy-cross/documents',
        resourceType
      );

      // Update database
      await prisma.document.update({
        where: { id: doc.id },
        data: {
          filePath: result.secure_url,
          fileUrl: result.secure_url,
          fileName: path.basename(result.secure_url)
        }
      });

      console.log(`✅ Updated ${doc.title}`);
      uploaded++;
      updated++;

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      console.error(`❌ Error processing ${doc.title}:`, error.message);
      errors++;
    }
  }

  return { uploaded, updated, skipped, errors };
}

async function main() {
  console.log('☁️  Migrating Gallery Items and Documents to Cloudinary\n');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Migrate gallery items
    const galleryResults = await migrateGalleryItems();

    // Migrate documents
    const docResults = await migrateDocuments();

    // Summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 Migration Summary:\n');
    console.log('Gallery Items:');
    console.log(`   ✅ Uploaded: ${galleryResults.uploaded}`);
    console.log(`   ✅ Updated: ${galleryResults.updated}`);
    console.log(`   ⏭️  Skipped: ${galleryResults.skipped}`);
    console.log(`   ❌ Errors: ${galleryResults.errors}\n`);
    
    console.log('Documents:');
    console.log(`   ✅ Uploaded: ${docResults.uploaded}`);
    console.log(`   ✅ Updated: ${docResults.updated}`);
    console.log(`   ⏭️  Skipped: ${docResults.skipped}`);
    console.log(`   ❌ Errors: ${docResults.errors}\n`);

    const totalUploaded = galleryResults.uploaded + docResults.uploaded;
    
    if (totalUploaded > 0) {
      console.log(`🎉 Success! ${totalUploaded} files uploaded to Cloudinary!`);
      console.log('\n📝 Next steps:');
      console.log('   1. Gallery images and documents now use Cloudinary URLs');
      console.log('   2. Test your site - everything should load!');
      console.log('   3. Files are permanent - never lost on redeploy');
    }

  } catch (error: any) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run migration
main()
  .then(() => {
    console.log('\n✨ Migration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

