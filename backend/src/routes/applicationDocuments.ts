import express from 'express';
import { uploadDocument } from '../middleware/upload';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Document types for application
const DOCUMENT_TYPES = [
  'BIRTH_CERTIFICATE',
  'BAPTISM_CERTIFICATE', 
  'SCHOOL_REPORT',
  'ID_COPY_MOTHER',
  'ID_COPY_FATHER',
  'PROOF_OF_RESIDENCE',
  'IMMUNIZATION_CERTIFICATE',
  'SALARY_SLIP_MOTHER',
  'SALARY_SLIP_FATHER',
  'BANK_STATEMENT',
  'TAX_CLEARANCE',
  'VISA_DOCUMENT',
  'OTHER'
];

/**
 * GET /api/application-documents/types
 * Get available document types - MUST come before /:applicationId route
 */
router.get('/types', (req, res) => {
  res.json({
    success: true,
    data: DOCUMENT_TYPES.map(type => ({
      value: type,
      label: type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }))
  });
});

/**
 * POST /api/application-documents/upload
 * Upload document for an application
 */
router.post('/upload', 
  uploadDocument.single('document'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return next(createError('No document file provided', 400));
      }

      const { applicationId, documentType } = req.body;

      if (!applicationId || !documentType) {
        return next(createError('Application ID and document type are required', 400));
      }

      if (!DOCUMENT_TYPES.includes(documentType)) {
        return next(createError(`Invalid document type. Allowed types: ${DOCUMENT_TYPES.join(', ')}`, 400));
      }

      // Verify application exists
      const application = await prisma.application.findUnique({
        where: { id: parseInt(applicationId) }
      });

      if (!application) {
        return next(createError('Application not found', 404));
      }

      // Create document record
      const document = await prisma.applicationDocument.create({
        data: {
          applicationId: parseInt(applicationId),
          fileName: req.file.filename,
          originalName: req.file.originalname,
          filePath: req.file.path,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
          documentType: documentType
        }
      });

      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          id: document.id,
          fileName: document.fileName,
          originalName: document.originalName,
          fileType: document.fileType,
          fileSize: document.fileSize,
          documentType: document.documentType,
          uploadedAt: document.uploadedAt
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/application-documents/:applicationId
 * Get all documents for an application
 */
router.get('/:applicationId', async (req, res, next) => {
  try {
    const applicationId = parseInt(req.params.applicationId);

    if (isNaN(applicationId)) {
      return next(createError('Invalid application ID', 400));
    }

    const documents = await prisma.applicationDocument.findMany({
      where: { applicationId },
      orderBy: { uploadedAt: 'desc' }
    });

    res.json({
      success: true,
      data: documents.map(doc => ({
        id: doc.id,
        fileName: doc.fileName,
        originalName: doc.originalName,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        documentType: doc.documentType,
        uploadedAt: doc.uploadedAt,
        downloadUrl: `/api/application-documents/download/${doc.id}`
      }))
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/application-documents/download/:documentId
 * Download a specific document
 */
router.get('/download/:documentId', async (req, res, next) => {
  try {
    const documentId = parseInt(req.params.documentId);

    if (isNaN(documentId)) {
      return next(createError('Invalid document ID', 400));
    }

    const document = await prisma.applicationDocument.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return next(createError('Document not found', 404));
    }

    const filePath = path.join(process.cwd(), document.filePath);
    
    if (!fs.existsSync(filePath)) {
      return next(createError('File not found on server', 404));
    }

    res.download(filePath, document.originalName);

  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/application-documents/:documentId
 * Delete a document
 */
router.delete('/:documentId', async (req, res, next) => {
  try {
    const documentId = parseInt(req.params.documentId);

    if (isNaN(documentId)) {
      return next(createError('Invalid document ID', 400));
    }

    const document = await prisma.applicationDocument.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return next(createError('Document not found', 404));
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), document.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete record from database
    await prisma.applicationDocument.delete({
      where: { id: documentId }
    });

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

export default router;
