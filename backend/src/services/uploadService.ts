import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import DocumentService from './documentService';

const prisma = new PrismaClient();

// Types for upload operations
export interface UploadResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface StaffUploadData {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  grade?: string;
  subjects?: string[];
  category?: string;
  order?: number;
}

export interface DocumentUploadData {
  title: string;
  description?: string;
  category: string;
  type?: string;
  tags?: string[];
  isPublished?: boolean;
}

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  createThumbnail?: boolean;
  thumbnailSize?: number;
}

export interface ProcessedFile {
  originalPath: string;
  optimizedPath?: string;
  thumbnailPath?: string;
  url: string;
  thumbnailUrl?: string;
  metadata: {
    originalName: string;
    filename: string;
    mimetype: string;
    size: number;
    optimizedSize?: number;
    dimensions?: { width: number; height: number };
  };
}

class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly maxFileSize = 20 * 1024 * 1024; // 20MB
  private readonly allowedImageTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ];
  private readonly allowedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    const directories = [
      'uploads',
      'uploads/staff',
      'uploads/documents',
      'uploads/gallery',
      'uploads/general',
      'uploads/thumbnails',
      'uploads/temp'
    ];

    directories.forEach(dir => {
      const fullPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  /**
   * Validate file before processing
   */
  private validateFile(file: Express.Multer.File, allowedTypes: string[]): UploadResult {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        success: false,
        error: `File size exceeds maximum allowed size of ${this.maxFileSize / (1024 * 1024)}MB`
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      return {
        success: false,
        error: `File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check if file exists
    if (!fs.existsSync(file.path)) {
      return {
        success: false,
        error: 'Uploaded file not found on server'
      };
    }

    return { success: true };
  }

  /**
   * Optimize image using Sharp
   */
  private async optimizeImage(
    filePath: string, 
    options: ImageOptimizationOptions = {}
  ): Promise<ProcessedFile> {
    const {
      width = 1200,
      height = 1200,
      quality = 85,
      format = 'jpeg',
      createThumbnail = true,
      thumbnailSize = 300
    } = options;

    console.log('🔍 optimizeImage: Processing file:', filePath);
    console.log('🔍 optimizeImage: Upload directory:', this.uploadDir);
    
    const fileInfo = await sharp(filePath).metadata();
    const originalName = path.basename(filePath);
    const filename = `${uuidv4()}.${format}`;
    const optimizedPath = path.join(this.uploadDir, 'staff', filename);
    
    console.log('🔍 optimizeImage: Target path:', optimizedPath);
    
    // Optimize main image
    await sharp(filePath)
      .resize(width, height, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .toFormat(format, { quality })
      .toFile(optimizedPath);

    let thumbnailPath: string | undefined;
    let thumbnailUrl: string | undefined;

    // Create thumbnail if requested
    if (createThumbnail && fileInfo.width && fileInfo.height) {
      const thumbFilename = `${uuidv4()}_thumb.${format}`;
      thumbnailPath = path.join(this.uploadDir, 'staff', thumbFilename);
      
      await sharp(filePath)
        .resize(thumbnailSize, thumbnailSize, { 
          fit: 'cover' 
        })
        .toFormat(format, { quality: 80 })
        .toFile(thumbnailPath);

      thumbnailUrl = `/uploads/staff/${thumbFilename}`;
    }

    // Get optimized file size
    const optimizedStats = await fs.promises.stat(optimizedPath);

    return {
      originalPath: filePath,
      optimizedPath,
      thumbnailPath,
      url: `/uploads/staff/${filename}`,
      thumbnailUrl,
      metadata: {
        originalName: path.basename(filePath),
        filename,
        mimetype: `image/${format}`,
        size: fileInfo.size || 0,
        optimizedSize: optimizedStats.size,
        dimensions: {
          width: fileInfo.width || 0,
          height: fileInfo.height || 0
        }
      }
    };
  }

  /**
   * Process document upload
   */
  private async processDocument(file: Express.Multer.File): Promise<ProcessedFile> {
    const filename = `${uuidv4()}_${file.originalname}`;
    const destinationPath = path.join(this.uploadDir, 'documents', filename);
    
    // Copy file to documents directory
    await fs.promises.copyFile(file.path, destinationPath);

    // Clean up temporary file
    await this.cleanupFile(file.path);

    return {
      originalPath: destinationPath,
      url: `/uploads/documents/${filename}`,
      metadata: {
        originalName: file.originalname,
        filename,
        mimetype: file.mimetype,
        size: file.size
      }
    };
  }

  /**
   * Upload and process staff image
   */
  async uploadStaffImage(
    file: Express.Multer.File, 
    staffData: StaffUploadData
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file, this.allowedImageTypes);
      if (!validation.success) {
        await this.cleanupFile(file.path);
        return validation;
      }

      // Optimize image
      const processedFile = await this.optimizeImage(file.path, {
        width: 800,
        height: 800,
        quality: 90,
        createThumbnail: true,
        thumbnailSize: 200
      });

      // Save staff member to database
      const staffMember = await prisma.staffMember.create({
        data: {
          name: staffData.name,
          role: staffData.role,
          email: staffData.email,
          phone: staffData.phone,
          grade: staffData.grade,
          subjects: staffData.subjects ? JSON.stringify(staffData.subjects) : null,
          category: (staffData.category as any) || 'TEACHING',
          order: staffData.order || 0,
          imageUrl: processedFile.url
        }
      });

      // Clean up original file
      await this.cleanupFile(file.path);

      return {
        success: true,
        data: {
          staff: staffMember,
          image: {
            url: processedFile.url,
            thumbnailUrl: processedFile.thumbnailUrl,
            metadata: processedFile.metadata
          }
        },
        message: 'Staff member created successfully with optimized image'
      };

    } catch (error) {
      console.error('Staff upload error:', error);
      await this.cleanupFile(file.path);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload staff image'
      };
    }
  }

  /**
   * Update existing staff member with new image
   */
  async updateStaffImage(
    staffId: string,
    file: Express.Multer.File,
    staffData: Partial<StaffUploadData>
  ): Promise<UploadResult> {
    try {
      console.log('🔍 updateStaffImage: Starting with staffId:', staffId);
      console.log('🔍 updateStaffImage: File info:', { path: file.path, size: file.size, mimetype: file.mimetype });
      console.log('🔍 updateStaffImage: Staff data:', staffData);
      
      // Validate file
      const validation = this.validateFile(file, this.allowedImageTypes);
      if (!validation.success) {
        console.log('🔍 updateStaffImage: File validation failed:', validation.error);
        await this.cleanupFile(file.path);
        return validation;
      }
      console.log('🔍 updateStaffImage: File validation passed');

      // Get existing staff member
      console.log('🔍 updateStaffImage: Looking for staff member with ID:', staffId);
      const existingStaff = await prisma.staffMember.findUnique({
        where: { id: staffId }
      });
      console.log('🔍 updateStaffImage: Found staff member:', existingStaff ? 'Yes' : 'No');

      if (!existingStaff) {
        console.log('🔍 updateStaffImage: Staff member not found, cleaning up file');
        await this.cleanupFile(file.path);
        return {
          success: false,
          error: 'Staff member not found'
        };
      }

      // Clean up old image if it exists
      if (existingStaff.imageUrl) {
        await this.cleanupImage(existingStaff.imageUrl);
      }

      // Optimize new image
      console.log('🔍 updateStaffImage: Starting image optimization for file:', file.path);
      const processedFile = await this.optimizeImage(file.path, {
        width: 800,
        height: 800,
        quality: 90,
        createThumbnail: true,
        thumbnailSize: 200
      });
      console.log('🔍 updateStaffImage: Image optimization completed:', processedFile);

      // Update staff member
      console.log('🔍 updateStaffImage: Updating staff member in database');
      const updatedStaff = await prisma.staffMember.update({
        where: { id: staffId },
        data: {
          ...(staffData.name && { name: staffData.name }),
          ...(staffData.role && { role: staffData.role }),
          ...(staffData.email !== undefined && { email: staffData.email }),
          ...(staffData.phone !== undefined && { phone: staffData.phone }),
          ...(staffData.grade !== undefined && { grade: staffData.grade }),
          ...(staffData.subjects ? { subjects: JSON.stringify(staffData.subjects) } : { subjects: null }),
          ...(staffData.category !== undefined && { category: staffData.category as any }),
          ...(staffData.order !== undefined && { order: staffData.order }),
          imageUrl: processedFile.url
        }
      });
      console.log('🔍 updateStaffImage: Database update completed');

      // Clean up original file
      await this.cleanupFile(file.path);

      return {
        success: true,
        data: {
          staff: updatedStaff,
          image: {
            url: processedFile.url,
            thumbnailUrl: processedFile.thumbnailUrl,
            metadata: processedFile.metadata
          }
        },
        message: 'Staff member updated successfully with new image'
      };

    } catch (error) {
      console.error('Staff image update error:', error);
      await this.cleanupFile(file.path);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update staff image'
      };
    }
  }

  /**
   * Upload document
   */
  async uploadDocument(
    file: Express.Multer.File,
    documentData: DocumentUploadData,
    userId: string
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file, this.allowedDocumentTypes);
      if (!validation.success) {
        await this.cleanupFile(file.path);
        return validation;
      }

      // Process document
      const processedFile = await this.processDocument(file);

      // Save document record to database using DocumentService
      const documentService = DocumentService.getInstance();
      
      const documentRecord = await documentService.createDocument({
        title: documentData.title,
        description: documentData.description || '',
        fileName: processedFile.metadata.filename,
        fileUrl: processedFile.url,
        fileSize: processedFile.metadata.size,
        mimeType: processedFile.metadata.mimetype,
        category: documentData.category,
        tags: documentData.tags || [],
        isPublished: documentData.isPublished || false,
        authorId: userId,
        authorName: 'System Administrator' // TODO: Get actual user name
      });

      return {
        success: true,
        data: {
          document: {
            id: documentRecord.id,
            title: documentRecord.title,
            description: documentRecord.description,
            category: documentRecord.category,
            tags: documentRecord.tags,
            isPublished: documentRecord.isPublished,
            fileUrl: documentRecord.fileUrl,
            fileName: documentRecord.fileName,
            fileSize: documentRecord.fileSize,
            uploadedAt: documentRecord.createdAt
          }
        },
        message: 'Document uploaded successfully'
      };

    } catch (error) {
      console.error('Document upload error:', error);
      await this.cleanupFile(file.path);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload document'
      };
    }
  }

  /**
   * Clean up uploaded file
   */
  private async cleanupFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }
  }

  /**
   * Clean up image files (original and thumbnail)
   */
  private async cleanupImage(imageUrl: string): Promise<void> {
    try {
      const filename = path.basename(imageUrl);
      const imagePath = path.join(this.uploadDir, 'staff', filename);
      
      // Remove main image
      await this.cleanupFile(imagePath);
      
      // Try to remove thumbnail (same name with _thumb suffix)
      const thumbFilename = filename.replace(/(\.[^.]+)$/, '_thumb$1');
      const thumbPath = path.join(this.uploadDir, 'staff', thumbFilename);
      await this.cleanupFile(thumbPath);
    } catch (error) {
      console.error('Error cleaning up image:', error);
    }
  }

  /**
   * Get upload statistics
   */
  async getUploadStats(): Promise<UploadResult> {
    try {
      const [staffCount, documentCount] = await Promise.all([
        prisma.staffMember.count(),
        prisma.applicationDocument.count()
      ]);

      // Calculate total upload directory size
      const uploadDirSize = await this.getDirectorySize(this.uploadDir);

      return {
        success: true,
        data: {
          staffMembers: staffCount,
          documents: documentCount,
          totalUploads: staffCount + documentCount,
          uploadDirectorySize: uploadDirSize
        }
      };
    } catch (error) {
      console.error('Error getting upload stats:', error);
      return {
        success: false,
        error: 'Failed to get upload statistics'
      };
    }
  }

  /**
   * Calculate directory size recursively
   */
  private async getDirectorySize(dirPath: string): Promise<number> {
    try {
      const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
      let totalSize = 0;

      for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          totalSize += await this.getDirectorySize(filePath);
        } else {
          const stats = await fs.promises.stat(filePath);
          totalSize += stats.size;
        }
      }

      return totalSize;
    } catch (error) {
      return 0;
    }
  }
}

export default new UploadService();
