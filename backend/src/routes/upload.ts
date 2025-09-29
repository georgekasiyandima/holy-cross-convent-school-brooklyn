import express from 'express';
import { uploadImage, uploadDocument } from '../middleware/upload';
import { requireEditor, authMiddleware } from '../middleware/auth';
import uploadService from '../services/uploadService';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

/**
 * POST /api/upload/staff
 * Upload new staff member with image
 */
router.post('/staff', 
  authMiddleware,
  requireEditor,
  uploadImage.single('image'),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.file) {
        return next(createError('No image file provided', 400));
      }

      const staffData = {
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,
        phone: req.body.phone,
        bio: req.body.bio,
        grade: req.body.grade,
        subjects: req.body.subjects ? JSON.parse(req.body.subjects) : undefined,
        qualifications: req.body.qualifications,
        experience: req.body.experience,
        category: req.body.category,
        order: req.body.order ? parseInt(req.body.order) : undefined
      };

      const result = await uploadService.uploadStaffImage(req.file, staffData);

      if (!result.success) {
        return next(createError(result.error || 'Upload failed', 400));
      }

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/upload/staff/:id
 * Update existing staff member with new image
 */
router.put('/staff/:id',
  authMiddleware,
  requireEditor,
  uploadImage.single('image'),
  async (req: AuthRequest, res, next) => {
  try {
    console.log('🔍 Upload Route: Received request for staff ID:', req.params.id);
    console.log('🔍 Upload Route: File received:', req.file ? 'Yes' : 'No');
    if (req.file) {
      console.log('🔍 Upload Route: File details:', {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      });
    }
    
    if (!req.file) {
        return next(createError('No image file provided', 400));
      }

      const staffId = req.params.id;
      const staffData = {
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,
        phone: req.body.phone,
        bio: req.body.bio,
        grade: req.body.grade,
        subjects: req.body.subjects ? JSON.parse(req.body.subjects) : undefined,
        qualifications: req.body.qualifications,
        experience: req.body.experience,
        category: req.body.category,
        order: req.body.order ? parseInt(req.body.order) : undefined
      };

      const result = await uploadService.updateStaffImage(staffId, req.file, staffData);

      if (!result.success) {
        return next(createError(result.error || 'Update failed', 400));
      }

    res.json({
      success: true,
        message: result.message,
        data: result.data
      });

  } catch (error) {
    next(error);
  }
  }
);

/**
 * POST /api/upload/document
 * Upload document
 */
router.post('/document',
  authMiddleware,
  requireEditor,
  uploadDocument.single('file'),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.file) {
        return next(createError('No file provided', 400));
      }

      const documentData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        type: req.body.type,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        isPublished: req.body.isPublished === 'true'
      };

      const result = await uploadService.uploadDocument(
        req.file, 
        documentData, 
        req.user!.id
      );

      if (!result.success) {
        return next(createError(result.error || 'Upload failed', 400));
      }

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });

  } catch (error) {
    next(error);
  }
  }
);

/**
 * GET /api/upload/stats
 * Get upload statistics
 */
router.get('/stats',
  authMiddleware,
  requireEditor,
  async (req: AuthRequest, res, next) => {
    try {
      const result = await uploadService.getUploadStats();

      if (!result.success) {
        return next(createError(result.error || 'Failed to get stats', 500));
      }

    res.json({
      success: true,
        data: result.data
      });

  } catch (error) {
    next(error);
  }
  }
);

/**
 * POST /api/upload/validate
 * Validate file before upload
 */
router.post('/validate',
  requireEditor,
  async (req: AuthRequest, res, next) => {
    try {
      const { fileType, fileSize } = req.body;

      if (!fileType || !fileSize) {
        return next(createError('File type and size are required', 400));
      }

      // Basic validation
      const allowedImageTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
      ];
      const allowedDocumentTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv'
      ];

      const isImage = allowedImageTypes.includes(fileType);
      const isDocument = allowedDocumentTypes.includes(fileType);
      const maxSize = isImage ? 5 * 1024 * 1024 : 20 * 1024 * 1024; // 5MB for images, 20MB for documents

      if (!isImage && !isDocument) {
        return res.json({
          success: false,
          error: `File type ${fileType} is not allowed`
        });
      }

      if (fileSize > maxSize) {
        return res.json({
          success: false,
          error: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`
        });
      }

    res.json({
      success: true,
        message: 'File validation passed',
        data: {
          fileType,
          fileSize,
          isImage,
          isDocument,
          maxAllowedSize: maxSize
        }
      });

  } catch (error) {
    next(error);
  }
  }
);

export default router; 