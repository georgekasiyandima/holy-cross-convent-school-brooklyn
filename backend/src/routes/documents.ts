import { Router, Request, Response } from 'express';
import { DocumentService } from '../services/documentService';
import { authMiddleware } from '../middleware/auth';
import { validatePolicy } from '../middleware/validation';
import * as yup from 'yup';
import { PrismaClient } from '@prisma/client';

const router = Router();
const documentService = DocumentService.getInstance();
const prisma = new PrismaClient();

// Validation schemas
const uploadDocumentSchema = yup.object().shape({
  title: yup.string().required('Title is required').max(200),
  description: yup.string().max(1000),
  isPublished: yup.boolean(),
  tags: yup.array().of(yup.string())
});

const updateDocumentSchema = yup.object().shape({
  title: yup.string().max(200),
  description: yup.string().max(1000),
  isPublished: yup.boolean(),
  tags: yup.array().of(yup.string())
});

// Get all documents by category (public)
router.get('/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { published } = req.query;
    
    const isPublished = published === 'false' ? false : true;
    const documents = await documentService.getDocumentsByCategory(category, isPublished);
    
    res.json({
      success: true,
      data: documents,
      count: documents.length
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch documents'
    });
  }
});

// Get document by ID
router.get('/:category/:id', async (req: Request, res: Response) => {
  try {
    const { category, id } = req.params;
    const documents = await documentService.getDocumentsByCategory(category, true);
    const document = documents.find(doc => doc.id === id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }
    
    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch document'
    });
  }
});

// Download document
router.get('/:category/:id/download', async (req: Request, res: Response) => {
  try {
    const { category, id } = req.params;
    await documentService.downloadDocument(id, category, res);
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to download document'
      });
    }
  }
});

// Upload document (admin only)
router.post('/:category/upload', 
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const upload = documentService.configureMulter(category);
      
      upload.single('file')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            error: err.message
          });
        }
        
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: 'No file uploaded'
          });
        }
        
        try {
          const { title, description, isPublished, tags } = req.body;
          
          // Validate input
          await uploadDocumentSchema.validate({
            title,
            description,
            isPublished: isPublished === 'true',
            tags: tags ? JSON.parse(tags) : []
          });
          
          const metadata = {
            title,
            description,
            authorId: (req as any).user.id,
            isPublished: isPublished === 'true',
            tags: tags ? JSON.parse(tags) : []
          };
          
          const result = await documentService.saveDocumentRecord(req.file, category, metadata);
          
          res.status(201).json({
            success: true,
            data: result,
            message: 'Document uploaded successfully'
          });
        } catch (validationError) {
          // Delete uploaded file if validation fails
          const fs = require('fs');
          const path = require('path');
          const filePath = req.file.path;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          
          res.status(400).json({
            success: false,
            error: validationError.message
          });
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload document'
      });
    }
  }
);

// Update document (admin only)
router.put('/:category/:id',
  authMiddleware,
  validationMiddleware(updateDocumentSchema),
  async (req: Request, res: Response) => {
    try {
      const { category, id } = req.params;
      const { title, description, isPublished, tags } = req.body;
      
      let record;
      
      switch (category) {
        case 'policies':
          record = await prisma.policy.update({
            where: { id },
            data: { title, description, isPublished }
          });
          break;
          
        case 'forms':
          record = await prisma.form.update({
            where: { id },
            data: { title, description, isActive: isPublished }
          });
          break;
          
        case 'reports':
          record = await prisma.report.update({
            where: { id },
            data: { title, description, isPublished }
          });
          break;
          
        case 'newsletters':
          record = await prisma.newsletter.update({
            where: { id },
            data: { title, content: description, isPublished }
          });
          break;
          
        case 'gallery':
          record = await prisma.galleryImage.update({
            where: { id },
            data: { 
              title, 
              description, 
              isPublished,
              tags: tags ? tags.join(',') : undefined
            }
          });
          break;
          
        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid category'
          });
      }
      
      res.json({
        success: true,
        data: record,
        message: 'Document updated successfully'
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update document'
      });
    }
  }
);

// Delete document (admin only)
router.delete('/:category/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { category, id } = req.params;
      
      await documentService.deleteDocument(id, category);
      
      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete document'
      });
    }
  }
);

// Get document statistics (admin only)
router.get('/admin/stats',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const stats = await documentService.getDocumentStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics'
      });
    }
  }
);

// Bulk upload documents (admin only)
router.post('/:category/bulk-upload',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const upload = documentService.configureMulter(category);
      
      upload.array('files', 10)(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            error: err.message
          });
        }
        
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
          return res.status(400).json({
            success: false,
            error: 'No files uploaded'
          });
        }
        
        try {
          const files = req.files as Express.Multer.File[];
          const results = [];
          
          for (const file of files) {
            const metadata = {
              title: file.originalname.replace(/\.[^/.]+$/, ""), // Remove extension
              description: '',
              authorId: (req as any).user.id,
              isPublished: true,
              tags: []
            };
            
            const result = await documentService.saveDocumentRecord(file, category, metadata);
            results.push(result);
          }
          
          res.status(201).json({
            success: true,
            data: results,
            message: `${files.length} documents uploaded successfully`
          });
        } catch (error) {
          // Clean up uploaded files on error
          const fs = require('fs');
          const files = req.files as Express.Multer.File[];
          files.forEach(file => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
          
          res.status(500).json({
            success: false,
            error: 'Failed to process bulk upload'
          });
        }
      });
    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload documents'
      });
    }
  }
);

// Search documents
router.get('/search/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { q, limit = '20', offset = '0' } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const searchLimit = parseInt(limit as string);
    const searchOffset = parseInt(offset as string);
    
    let documents;
    
    switch (category) {
      case 'policies':
        documents = await prisma.policy.findMany({
          where: {
            AND: [
              { isPublished: true },
              {
                OR: [
                  { title: { contains: q as string, mode: 'insensitive' } },
                  { description: { contains: q as string, mode: 'insensitive' } }
                ]
              }
            ]
          },
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: searchLimit,
          skip: searchOffset
        });
        break;
        
      case 'forms':
        documents = await prisma.form.findMany({
          where: {
            AND: [
              { isActive: true },
              {
                OR: [
                  { title: { contains: q as string, mode: 'insensitive' } },
                  { description: { contains: q as string, mode: 'insensitive' } }
                ]
              }
            ]
          },
          orderBy: { order: 'asc' },
          take: searchLimit,
          skip: searchOffset
        });
        break;
        
      case 'reports':
        documents = await prisma.report.findMany({
          where: {
            AND: [
              { isPublished: true },
              {
                OR: [
                  { title: { contains: q as string, mode: 'insensitive' } },
                  { description: { contains: q as string, mode: 'insensitive' } }
                ]
              }
            ]
          },
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: searchLimit,
          skip: searchOffset
        });
        break;
        
      case 'newsletters':
        documents = await prisma.newsletter.findMany({
          where: {
            AND: [
              { isPublished: true },
              {
                OR: [
                  { title: { contains: q as string, mode: 'insensitive' } },
                  { content: { contains: q as string, mode: 'insensitive' } }
                ]
              }
            ]
          },
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: searchLimit,
          skip: searchOffset
        });
        break;
        
      case 'gallery':
        documents = await prisma.galleryImage.findMany({
          where: {
            AND: [
              { isPublished: true },
              {
                OR: [
                  { title: { contains: q as string, mode: 'insensitive' } },
                  { description: { contains: q as string, mode: 'insensitive' } },
                  { tags: { contains: q as string, mode: 'insensitive' } }
                ]
              }
            ]
          },
          orderBy: { order: 'asc' },
          take: searchLimit,
          skip: searchOffset
        });
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid category'
        });
    }
    
    res.json({
      success: true,
      data: documents,
      count: documents.length,
      query: q,
      limit: searchLimit,
      offset: searchOffset
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search documents'
    });
  }
});

export default router;





