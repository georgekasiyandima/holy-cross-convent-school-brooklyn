import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { AssetOptimizationService } from '../services/assetOptimization';
import { authMiddleware } from '../middleware/auth';
import { validatePolicy } from '../middleware/validation';
import * as yup from 'yup';
import { PrismaClient } from '@prisma/client';

const router = Router();
const assetOptimization = AssetOptimizationService.getInstance();
const prisma = new PrismaClient();

// Configure multer for temporary uploads
const upload = multer({
  dest: 'temp/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images (JPEG, PNG, WebP) and PDFs are allowed.'));
    }
  }
});

// Validation schemas
const staffUploadSchema = yup.object().shape({
  name: yup.string().required('Staff name is required').max(100),
  role: yup.string().required('Staff role is required').max(100),
  email: yup.string().email('Invalid email format').optional(),
  phone: yup.string().optional(),
  bio: yup.string().max(500).optional(),
  grade: yup.string().optional(),
  subjects: yup.array().of(yup.string()).optional(),
  qualifications: yup.string().max(500).optional(),
  experience: yup.string().max(500).optional()
});

const galleryUploadSchema = yup.object().shape({
  title: yup.string().required('Image title is required').max(200),
  description: yup.string().max(1000).optional(),
  category: yup.string().required('Category is required').max(50),
  tags: yup.string().optional()
});

const documentUploadSchema = yup.object().shape({
  title: yup.string().required('Document title is required').max(200),
  description: yup.string().max(1000).optional(),
  category: yup.string().required('Category is required'),
  isPublished: yup.boolean().default(true)
});

// Upload staff photo with optimization
router.post('/staff/upload', 
  authMiddleware,
  upload.single('photo'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No photo uploaded'
        });
      }

      // Validate image
      const validation = assetOptimization.validateImage(req.file);
      if (!validation.valid) {
        // Clean up uploaded file
        if (req.file.path) {
          require('fs').unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          error: validation.error
        });
      }

      // Validate staff information
      const { name, role, email, phone, bio, grade, subjects, qualifications, experience } = req.body;
      
      try {
        await staffUploadSchema.validate({
          name,
          role,
          email,
          phone,
          bio,
          grade,
          subjects: subjects ? JSON.parse(subjects) : [],
          qualifications,
          experience
        });
      } catch (validationError) {
        // Clean up uploaded file
        if (req.file.path) {
          require('fs').unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          error: validationError.message
        });
      }

      // Optimize and save image
      const optimizedImage = await assetOptimization.optimizeStaffPhoto(req.file, { name, role });

      // Save staff member to database
      const staffMember = await prisma.staffMember.create({
        data: {
          name,
          role,
          email,
          phone,
          bio,
          grade,
          subjects: subjects ? JSON.stringify(JSON.parse(subjects)) : null,
          qualifications,
          experience,
          imageUrl: optimizedImage.original,
          isActive: true,
          order: 0
        }
      });

      res.status(201).json({
        success: true,
        data: {
          staffMember,
          image: optimizedImage
        },
        message: 'Staff photo uploaded and optimized successfully'
      });

    } catch (error) {
      console.error('Staff upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload staff photo'
      });
    }
  }
);

// Upload gallery image with optimization
router.post('/gallery/upload',
  authMiddleware,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No image uploaded'
        });
      }

      // Validate image
      const validation = assetOptimization.validateImage(req.file);
      if (!validation.valid) {
        // Clean up uploaded file
        if (req.file.path) {
          require('fs').unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          error: validation.error
        });
      }

      // Validate gallery information
      const { title, description, category, tags } = req.body;
      
      try {
        await galleryUploadSchema.validate({
          title,
          description,
          category,
          tags
        });
      } catch (validationError) {
        // Clean up uploaded file
        if (req.file.path) {
          require('fs').unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          error: validationError.message
        });
      }

      // Optimize and save image
      const optimizedImage = await assetOptimization.optimizeGalleryImage(req.file, { title, category });

      // Save gallery image to database
      const galleryImage = await prisma.galleryImage.create({
        data: {
          title,
          description,
          imageUrl: optimizedImage.original,
          thumbnailUrl: optimizedImage.thumbnail,
          category,
          tags,
          isPublished: true,
          order: 0
        }
      });

      res.status(201).json({
        success: true,
        data: {
          galleryImage,
          image: optimizedImage
        },
        message: 'Gallery image uploaded and optimized successfully'
      });

    } catch (error) {
      console.error('Gallery upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload gallery image'
      });
    }
  }
);

// Upload document
router.post('/documents/upload',
  authMiddleware,
  upload.single('document'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No document uploaded'
        });
      }

      // Validate document information
      const { title, description, category, isPublished } = req.body;
      
      try {
        await documentUploadSchema.validate({
          title,
          description,
          category,
          isPublished: isPublished === 'true'
        });
      } catch (validationError) {
        // Clean up uploaded file
        if (req.file.path) {
          require('fs').unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          error: validationError.message
        });
      }

      // Process document
      const processedDoc = await assetOptimization.processDocument(req.file, {
        title,
        category,
        type: category as 'policy' | 'form' | 'report' | 'newsletter'
      });

      // Save document to appropriate table
      let record;
      const authorId = (req as any).user.id;

      switch (category) {
        case 'policy':
          record = await prisma.policy.create({
            data: {
              title,
              description,
              content: '',
              category: 'ADMINISTRATIVE',
              pdfUrl: processedDoc.url,
              isPublished: isPublished === 'true',
              authorId
            }
          });
          break;

        case 'form':
          record = await prisma.form.create({
            data: {
              title,
              description,
              category: 'ADMISSION',
              pdfUrl: processedDoc.url,
              isActive: isPublished === 'true'
            }
          });
          break;

        case 'report':
          record = await prisma.report.create({
            data: {
              title,
              description,
              type: 'ACADEMIC',
              pdfUrl: processedDoc.url,
              isPublished: isPublished === 'true',
              authorId
            }
          });
          break;

        case 'newsletter':
          record = await prisma.newsletter.create({
            data: {
              title,
              content: description || '',
              authorId
            }
          });
          break;

        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid document category'
          });
      }

      res.status(201).json({
        success: true,
        data: {
          document: record,
          fileInfo: {
            url: processedDoc.url,
            fileSize: processedDoc.fileSize,
            originalName: processedDoc.originalName
          }
        },
        message: 'Document uploaded successfully'
      });

    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload document'
      });
    }
  }
);

// Bulk upload staff photos
router.post('/staff/bulk-upload',
  authMiddleware,
  upload.array('photos', 10),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No photos uploaded'
        });
      }

      const results = [];
      const errors = [];

      for (let i = 0; i < files.length; i++) {
        try {
          const file = files[i];
          const staffData = req.body[`staff_${i}`];
          
          if (!staffData) {
            errors.push(`Missing staff data for photo ${i + 1}`);
            continue;
          }

          const { name, role, email, phone, bio, grade, subjects, qualifications, experience } = JSON.parse(staffData);

          // Validate image
          const validation = assetOptimization.validateImage(file);
          if (!validation.valid) {
            errors.push(`Photo ${i + 1}: ${validation.error}`);
            continue;
          }

          // Optimize and save image
          const optimizedImage = await assetOptimization.optimizeStaffPhoto(file, { name, role });

          // Save staff member
          const staffMember = await prisma.staffMember.create({
            data: {
              name,
              role,
              email,
              phone,
              bio,
              grade,
              subjects: subjects ? JSON.stringify(subjects) : null,
              qualifications,
              experience,
              imageUrl: optimizedImage.original,
              isActive: true,
              order: i
            }
          });

          results.push({
            staffMember,
            image: optimizedImage
          });

        } catch (error) {
          errors.push(`Photo ${i + 1}: ${error.message}`);
        }
      }

      res.status(201).json({
        success: true,
        data: {
          successful: results,
          errors
        },
        message: `${results.length} staff photos uploaded successfully`
      });

    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process bulk upload'
      });
    }
  }
);

// Get optimization statistics
router.get('/optimization/stats',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const stats = await assetOptimization.getOptimizationStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch optimization statistics'
      });
    }
  }
);

// Cleanup orphaned files
router.post('/cleanup',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const result = await assetOptimization.cleanupOrphanedFiles();
      
      res.json({
        success: true,
        data: result,
        message: `Cleaned up ${result.deleted} orphaned files`
      });
    } catch (error) {
      console.error('Cleanup error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cleanup files'
      });
    }
  }
);

// Get supported file formats and requirements
router.get('/formats', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      images: {
        supportedFormats: ['JPEG', 'PNG', 'WebP'],
        maxSize: '10MB',
        recommendedDimensions: {
          staff: '1200x1200px (square)',
          gallery: '1920x1080px (16:9)',
          thumbnails: 'Auto-generated'
        },
        optimization: {
          webp: 'Automatic WebP conversion with JPEG fallback',
          compression: '85-90% quality for optimal size/quality balance',
          thumbnails: '300x300px for staff, 400x300px for gallery'
        }
      },
      documents: {
        supportedFormats: ['PDF'],
        maxSize: '10MB',
        categories: ['Policies', 'Forms', 'Reports', 'Newsletters'],
        optimization: {
          searchable: 'Text-based PDFs (not scanned images)',
          compression: 'Optimized for web delivery'
        }
      }
    }
  });
});

export default router;
