import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface OptimizedImage {
  original: string;
  webp: string;
  thumbnail: string;
  dimensions: {
    width: number;
    height: number;
  };
  fileSize: {
    original: number;
    webp: number;
    thumbnail: number;
  };
}

export class AssetOptimizationService {
  private static instance: AssetOptimizationService;
  private uploadPath: string;
  private supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];
  private maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor() {
    this.uploadPath = path.join(process.cwd(), 'uploads');
    this.ensureDirectories();
  }

  public static getInstance(): AssetOptimizationService {
    if (!AssetOptimizationService.instance) {
      AssetOptimizationService.instance = new AssetOptimizationService();
    }
    return AssetOptimizationService.instance;
  }

  private ensureDirectories(): void {
    const directories = [
      'staff/original',
      'staff/webp',
      'staff/thumbnails',
      'gallery/original',
      'gallery/webp',
      'gallery/thumbnails',
      'documents',
      'policies',
      'forms',
      'reports'
    ];

    directories.forEach(dir => {
      const dirPath = path.join(this.uploadPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  public validateImage(file: Express.Multer.File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxFileSize) {
      return { valid: false, error: `File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit` };
    }

    // Check file type
    const extension = path.extname(file.originalname).toLowerCase().slice(1);
    if (!this.supportedFormats.includes(extension)) {
      return { valid: false, error: `Unsupported format. Supported: ${this.supportedFormats.join(', ')}` };
    }

    // Check MIME type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return { valid: false, error: 'Invalid file type' };
    }

    return { valid: true };
  }

  public async optimizeStaffPhoto(file: Express.Multer.File, staffInfo: {
    name: string;
    role: string;
  }): Promise<OptimizedImage> {
    const timestamp = Date.now();
    const baseName = this.sanitizeFileName(`${staffInfo.name}-${staffInfo.role}-${timestamp}`);
    
    try {
      // Get image metadata
      const metadata = await sharp(file.path).metadata();
      
      // Optimize original (resize to 1200x1200 if larger)
      const optimizedOriginal = path.join(this.uploadPath, 'staff', 'original', `${baseName}.jpg`);
      await sharp(file.path)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .jpeg({ quality: 90, progressive: true })
        .toFile(optimizedOriginal);

      // Create WebP version
      const webpPath = path.join(this.uploadPath, 'staff', 'webp', `${baseName}.webp`);
      await sharp(file.path)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);

      // Create thumbnail (300x300)
      const thumbnailPath = path.join(this.uploadPath, 'staff', 'thumbnails', `${baseName}-thumb.jpg`);
      await sharp(file.path)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      // Get file sizes
      const originalSize = fs.statSync(optimizedOriginal).size;
      const webpSize = fs.statSync(webpPath).size;
      const thumbnailSize = fs.statSync(thumbnailPath).size;

      // Clean up original uploaded file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

      return {
        original: `${baseUrl}/uploads/staff/original/${baseName}.jpg`,
        webp: `${baseUrl}/uploads/staff/webp/${baseName}.webp`,
        thumbnail: `${baseUrl}/uploads/staff/thumbnails/${baseName}-thumb.jpg`,
        dimensions: {
          width: metadata.width || 0,
          height: metadata.height || 0
        },
        fileSize: {
          original: originalSize,
          webp: webpSize,
          thumbnail: thumbnailSize
        }
      };

    } catch (error) {
      console.error('Error optimizing staff photo:', error);
      throw new Error('Failed to optimize staff photo');
    }
  }

  public async optimizeGalleryImage(file: Express.Multer.File, galleryInfo: {
    title: string;
    category: string;
  }): Promise<OptimizedImage> {
    const timestamp = Date.now();
    const baseName = this.sanitizeFileName(`${galleryInfo.category}-${galleryInfo.title}-${timestamp}`);
    
    try {
      // Get image metadata
      const metadata = await sharp(file.path).metadata();
      
      // Optimize original (resize to 1920x1080 if larger)
      const optimizedOriginal = path.join(this.uploadPath, 'gallery', 'original', `${baseName}.jpg`);
      await sharp(file.path)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(optimizedOriginal);

      // Create WebP version
      const webpPath = path.join(this.uploadPath, 'gallery', 'webp', `${baseName}.webp`);
      await sharp(file.path)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .webp({ quality: 80, effort: 6 })
        .toFile(webpPath);

      // Create thumbnail (400x300)
      const thumbnailPath = path.join(this.uploadPath, 'gallery', 'thumbnails', `${baseName}-thumb.jpg`);
      await sharp(file.path)
        .resize(400, 300, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      // Get file sizes
      const originalSize = fs.statSync(optimizedOriginal).size;
      const webpSize = fs.statSync(webpPath).size;
      const thumbnailSize = fs.statSync(thumbnailPath).size;

      // Clean up original uploaded file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

      return {
        original: `${baseUrl}/uploads/gallery/original/${baseName}.jpg`,
        webp: `${baseUrl}/uploads/gallery/webp/${baseName}.webp`,
        thumbnail: `${baseUrl}/uploads/gallery/thumbnails/${baseName}-thumb.jpg`,
        dimensions: {
          width: metadata.width || 0,
          height: metadata.height || 0
        },
        fileSize: {
          original: originalSize,
          webp: webpSize,
          thumbnail: thumbnailSize
        }
      };

    } catch (error) {
      console.error('Error optimizing gallery image:', error);
      throw new Error('Failed to optimize gallery image');
    }
  }

  public async processDocument(file: Express.Multer.File, documentInfo: {
    title: string;
    category: string;
    type: 'policy' | 'form' | 'report' | 'newsletter';
  }): Promise<{ url: string; fileSize: number; originalName: string }> {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const baseName = this.sanitizeFileName(`${documentInfo.type}-${documentInfo.title}-${timestamp}${extension}`);
    
    try {
      const destinationPath = path.join(this.uploadPath, documentInfo.type, baseName);
      
      // Move and rename file
      fs.renameSync(file.path, destinationPath);
      
      const fileSize = fs.statSync(destinationPath).size;
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

      return {
        url: `${baseUrl}/uploads/${documentInfo.type}/${baseName}`,
        fileSize: fileSize,
        originalName: file.originalname
      };

    } catch (error) {
      console.error('Error processing document:', error);
      throw new Error('Failed to process document');
    }
  }

  public async getOptimizationStats(): Promise<{
    totalImages: number;
    totalSize: number;
    webpSavings: number;
    averageSize: number;
  }> {
    try {
      const staffImages = await prisma.staffMember.findMany({
        where: { imageUrl: { not: null } }
      });

      const galleryImages = await prisma.galleryImage.findMany();

      const totalImages = staffImages.length + galleryImages.length;
      let totalSize = 0;
      let webpSavings = 0;

      // Calculate sizes (this would need to be stored in database for accuracy)
      // For now, return estimated values
      totalSize = totalImages * 500000; // Estimated 500KB average
      webpSavings = totalSize * 0.3; // Estimated 30% savings with WebP

      return {
        totalImages,
        totalSize,
        webpSavings,
        averageSize: totalImages > 0 ? totalSize / totalImages : 0
      };

    } catch (error) {
      console.error('Error getting optimization stats:', error);
      return {
        totalImages: 0,
        totalSize: 0,
        webpSavings: 0,
        averageSize: 0
      };
    }
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  public async cleanupOrphanedFiles(): Promise<{ deleted: number; errors: string[] }> {
    let deleted = 0;
    const errors: string[] = [];

    try {
      const directories = [
        'staff/original',
        'staff/webp',
        'staff/thumbnails',
        'gallery/original',
        'gallery/webp',
        'gallery/thumbnails'
      ];

      for (const dir of directories) {
        const dirPath = path.join(this.uploadPath, dir);
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          
          for (const file of files) {
            const filePath = path.join(dirPath, file);
            
            // Check if file is referenced in database
            const isReferenced = await this.isFileReferenced(filePath);
            
            if (!isReferenced) {
              try {
                fs.unlinkSync(filePath);
                deleted++;
              } catch (error) {
                errors.push(`Failed to delete ${filePath}: ${error}`);
              }
            }
          }
        }
      }

    } catch (error) {
      errors.push(`Cleanup error: ${error}`);
    }

    return { deleted, errors };
  }

  private async isFileReferenced(filePath: string): Promise<boolean> {
    const fileName = path.basename(filePath);
    
    // Check staff images
    const staffWithImage = await prisma.staffMember.findFirst({
      where: { imageUrl: { contains: fileName } }
    });

    // Check gallery images
    const galleryWithImage = await prisma.galleryImage.findFirst({
      where: { 
        OR: [
          { imageUrl: { contains: fileName } },
          { thumbnailUrl: { contains: fileName } }
        ]
      }
    });

    return !!(staffWithImage || galleryWithImage);
  }
}

export default AssetOptimizationService;



