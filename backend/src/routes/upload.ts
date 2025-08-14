import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and document files are allowed'));
    }
  }
});

// Upload single file
router.post('/single', upload.single('file'), async (req: AuthRequest, res, next) => {
  try {
    if (!req.file) {
      throw createError('No file uploaded', 400);
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Save file record to database
    const fileRecord = await prisma.fileUpload.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        uploadedBy: req.user!.id
      }
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        file: fileRecord,
        url: fileUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), async (req: AuthRequest, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw createError('No files uploaded', 400);
    }

    const files = req.files as Express.Multer.File[];
    const uploadedFiles = [];

    for (const file of files) {
      const fileUrl = `/uploads/${file.filename}`;

      const fileRecord = await prisma.fileUpload.create({
        data: {
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: fileUrl,
          uploadedBy: req.user!.id
        }
      });

      uploadedFiles.push({
        file: fileRecord,
        url: fileUrl
      });
    }

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: { files: uploadedFiles }
    });
  } catch (error) {
    next(error);
  }
});

// Get uploaded files (admin only)
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [files, total] = await Promise.all([
      prisma.fileUpload.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.fileUpload.count()
    ]);

    res.json({
      success: true,
      data: {
        files,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete uploaded file (admin only)
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const fileRecord = await prisma.fileUpload.findUnique({
      where: { id }
    });

    if (!fileRecord) {
      throw createError('File not found', 404);
    }

    // Delete physical file
    const filePath = path.join(uploadsDir, fileRecord.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await prisma.fileUpload.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 