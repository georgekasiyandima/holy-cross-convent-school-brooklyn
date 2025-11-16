#!/usr/bin/env ts-node
/**
 * Upload all local images to Cloudinary and update database URLs
 * This is a one-time migration script
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

async function uploadImageToCloudinary(filePath: string, folder: string = 'holy-cross'): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
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

async function migrateStaffImages() {
  console.log('☁️  Migrating Staff Images to Cloudinary\n');

  // Verify Cloudinary config
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary credentials not set!');
    console.error('Set these environment variables:');
    console.error('  CLOUDINARY_CLOUD_NAME=your-cloud-name');
    console.error('  CLOUDINARY_API_KEY=your-api-key');
    console.error('  CLOUDINARY_API_SECRET=your-api-secret');
    process.exit(1);
  }

  console.log(`✅ Cloudinary configured: ${process.env.CLOUDINARY_CLOUD_NAME}\n`);

  // Get all staff members
  const staffMembers = await prisma.staffMember.findMany({
    where: { isActive: true }
  });

  console.log(`Found ${staffMembers.length} staff members\n`);

  // Get local images
  const uploadsDir = path.join(process.cwd(), 'uploads', 'staff');
  
  if (!fs.existsSync(uploadsDir)) {
    console.error('❌ Uploads directory not found:', uploadsDir);
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  const imageFiles = files.filter(f => 
    /\.(jpg|jpeg|png)$/i.test(f) && 
    !f.includes('_thumb') &&
    !f.includes('thumbnails') &&
    !fs.statSync(path.join(uploadsDir, f)).isDirectory()
  );

  console.log(`Found ${imageFiles.length} image files locally\n`);

  let uploaded = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  // Create a map of filename to staff member
  const staffImageMap = new Map<string, typeof staffMembers[0]>();
  
  for (const staff of staffMembers) {
    if (staff.imageUrl) {
      const filename = path.basename(staff.imageUrl);
      staffImageMap.set(filename, staff);
    }
  }

  // Upload images and update database
  for (const imageFile of imageFiles) {
    const imagePath = path.join(uploadsDir, imageFile);
    
    try {
      // Find matching staff member
      let matchingStaff = staffImageMap.get(imageFile);
      
      // If not found by exact match, try UUID prefix match
      if (!matchingStaff) {
        const uuidPrefix = imageFile.split('_')[0];
        for (const [filename, staff] of staffImageMap.entries()) {
          if (filename.startsWith(uuidPrefix)) {
            matchingStaff = staff;
            break;
          }
        }
      }

      if (!matchingStaff) {
        console.log(`⏭️  No matching staff for: ${imageFile}`);
        skipped++;
        continue;
      }

      // Upload to Cloudinary
      console.log(`📤 Uploading ${imageFile} for ${matchingStaff.name}...`);
      const result = await uploadImageToCloudinary(imagePath, 'holy-cross/staff');
      
      // Update database
      await prisma.staffMember.update({
        where: { id: matchingStaff.id },
        data: { imageUrl: result.secure_url }
      });

      console.log(`✅ Updated ${matchingStaff.name} → ${result.secure_url.substring(0, 50)}...`);
      uploaded++;
      updated++;
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error: any) {
      console.error(`❌ Error processing ${imageFile}:`, error.message);
      errors++;
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Uploaded to Cloudinary: ${uploaded}`);
  console.log(`   ✅ Database records updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);

  if (uploaded > 0) {
    console.log(`\n🎉 Success! ${uploaded} images are now on Cloudinary!`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Images are now using Cloudinary URLs`);
    console.log(`   2. Test your site - images should load!`);
    console.log(`   3. Future uploads can go directly to Cloudinary`);
  }
}

// Run migration
migrateStaffImages()
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

