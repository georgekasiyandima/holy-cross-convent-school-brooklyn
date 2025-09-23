#!/usr/bin/env node

/**
 * Holy Cross School - Asset Upload Script
 * 
 * This script helps upload assets to the school website system.
 * Run with: node upload-assets.js
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const JWT_TOKEN = process.env.JWT_TOKEN || 'your-jwt-token-here';

class AssetUploader {
  constructor() {
    this.baseUrl = BASE_URL;
    this.token = JWT_TOKEN;
    this.uploadedCount = 0;
    this.errors = [];
  }

  async uploadStaffPhoto(imagePath, staffData) {
    try {
      const form = new FormData();
      form.append('photo', fs.createReadStream(imagePath));
      form.append('name', staffData.name);
      form.append('role', staffData.role);
      form.append('email', staffData.email || '');
      form.append('phone', staffData.phone || '');
      form.append('bio', staffData.bio || '');

      const response = await axios.post(`${this.baseUrl}/api/assets/staff/upload`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${this.token}`
        }
      });

      console.log(`✅ Uploaded staff photo: ${staffData.name} (${staffData.role})`);
      this.uploadedCount++;
      return response.data;

    } catch (error) {
      const errorMsg = `❌ Failed to upload ${staffData.name}: ${error.response?.data?.error || error.message}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
    }
  }

  async uploadDocument(docPath, docData) {
    try {
      const form = new FormData();
      form.append('document', fs.createReadStream(docPath));
      form.append('title', docData.title);
      form.append('description', docData.description || '');
      form.append('category', docData.category);
      form.append('isPublished', docData.isPublished || 'true');

      const response = await axios.post(`${this.baseUrl}/api/assets/documents/upload`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${this.token}`
        }
      });

      console.log(`✅ Uploaded document: ${docData.title} (${docData.category})`);
      this.uploadedCount++;
      return response.data;

    } catch (error) {
      const errorMsg = `❌ Failed to upload ${docData.title}: ${error.response?.data?.error || error.message}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
    }
  }

  async uploadGalleryImage(imagePath, galleryData) {
    try {
      const form = new FormData();
      form.append('image', fs.createReadStream(imagePath));
      form.append('title', galleryData.title);
      form.append('description', galleryData.description || '');
      form.append('category', galleryData.category);
      form.append('tags', galleryData.tags || '');

      const response = await axios.post(`${this.baseUrl}/api/assets/gallery/upload`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${this.token}`
        }
      });

      console.log(`✅ Uploaded gallery image: ${galleryData.title} (${galleryData.category})`);
      this.uploadedCount++;
      return response.data;

    } catch (error) {
      const errorMsg = `❌ Failed to upload ${galleryData.title}: ${error.response?.data?.error || error.message}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
    }
  }

  async getSupportedFormats() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/assets/formats`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get supported formats:', error.message);
      return null;
    }
  }

  async getStats() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/assets/optimization/stats`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to get stats:', error.message);
      return null;
    }
  }

  printSummary() {
    console.log('\n📊 UPLOAD SUMMARY');
    console.log('==================');
    console.log(`✅ Successfully uploaded: ${this.uploadedCount} assets`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🚨 ERRORS:');
      this.errors.forEach(error => console.log(`  ${error}`));
    }
  }

  // Helper method to scan directory and upload assets
  async uploadFromDirectory(directoryPath, type = 'staff') {
    if (!fs.existsSync(directoryPath)) {
      console.error(`❌ Directory not found: ${directoryPath}`);
      return;
    }

    const files = fs.readdirSync(directoryPath);
    const supportedExtensions = type === 'staff' ? ['.jpg', '.jpeg', '.png'] : ['.pdf'];

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const ext = path.extname(file).toLowerCase();

      if (!supportedExtensions.includes(ext)) {
        console.log(`⏭️  Skipping ${file} (unsupported format)`);
        continue;
      }

      const fileName = path.basename(file, ext);
      const nameParts = fileName.split('-');

      if (type === 'staff') {
        await this.uploadStaffPhoto(filePath, {
          name: nameParts.slice(0, -1).join(' '),
          role: nameParts[nameParts.length - 1] || 'Staff Member'
        });
      } else if (type === 'documents') {
        await this.uploadDocument(filePath, {
          title: fileName.replace(/-/g, ' '),
          category: 'policy'
        });
      }
    }
  }
}

// Main execution
async function main() {
  console.log('🏫 Holy Cross School - Asset Uploader');
  console.log('=====================================\n');

  const uploader = new AssetUploader();

  // Check if JWT token is set
  if (uploader.token === 'your-jwt-token-here') {
    console.log('❌ Please set your JWT token:');
    console.log('   export JWT_TOKEN="your-actual-jwt-token"');
    console.log('   or edit the script to include your token\n');
    return;
  }

  try {
    // Get supported formats
    console.log('📋 Getting supported formats...');
    const formats = await uploader.getSupportedFormats();
    if (formats) {
      console.log('✅ Supported formats retrieved');
    }

    // Example usage - customize based on your needs
    console.log('\n🚀 Starting uploads...\n');

    // Upload staff photos (example)
    // await uploader.uploadStaffPhoto('./assets/staff/john-smith-principal.jpg', {
    //   name: 'John Smith',
    //   role: 'Principal',
    //   email: 'john.smith@holycrossbrooklyn.edu',
    //   phone: '(021) 511 4337',
    //   bio: 'Dedicated educator with 15 years of experience'
    // });

    // Upload documents (example)
    // await uploader.uploadDocument('./assets/documents/academic-policy-2024.pdf', {
    //   title: 'Academic Policy 2024',
    //   description: 'Comprehensive academic policies and procedures',
    //   category: 'policy',
    //   isPublished: true
    // });

    // Upload gallery images (example)
    // await uploader.uploadGalleryImage('./assets/gallery/sports-day-2024.jpg', {
    //   title: 'Sports Day 2024',
    //   description: 'Annual sports day celebration',
    //   category: 'Events',
    //   tags: 'sports,celebration,students,2024'
    // });

    // Bulk upload from directory (example)
    // await uploader.uploadFromDirectory('./assets/staff', 'staff');
    // await uploader.uploadFromDirectory('./assets/documents', 'documents');

    console.log('\n📊 Getting current statistics...');
    const stats = await uploader.getStats();
    if (stats) {
      console.log(`📈 Total images: ${stats.totalImages}`);
      console.log(`💾 Total size: ${Math.round(stats.totalSize / 1024 / 1024)}MB`);
      console.log(`🎯 WebP savings: ${Math.round(stats.webpSavings / 1024 / 1024)}MB`);
    }

  } catch (error) {
    console.error('❌ Upload process failed:', error.message);
  }

  uploader.printSummary();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AssetUploader;



