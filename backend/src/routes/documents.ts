import { Router, Request, Response } from 'express';
import { DocumentService } from '../services/documentService';
import { authMiddleware } from '../middleware/auth';
import { requireEditor } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const documentService = DocumentService.getInstance();

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'documents');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, and document files are allowed.'));
    }
  }
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
    const { id } = req.params;
    const document = await documentService.getDocumentById(id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }
    
    return res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch document'
    });
  }
});

// Upload document (protected)
router.post('/upload', 
  authMiddleware,
  requireEditor,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: 'No file uploaded'
          });
        }
        
      const { title, description, category, isPublished, authorId, authorName } = req.body;
      
      if (!title || !category) {
        return res.status(400).json({
          success: false,
          error: 'Title and category are required'
        });
      }

      const documentData = {
            title,
        description: description || '',
        fileName: req.file.filename,
        fileUrl: `/uploads/documents/${req.file.filename}`,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        category,
        tags: [],
            isPublished: isPublished === 'true',
        authorId: authorId || 'system',
        authorName: authorName || 'System'
          };
          
      const document = await documentService.createDocument(documentData);
          
      return res.json({
            success: true,
        data: document,
            message: 'Document uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to upload document'
      });
    }
  }
);

// Update document (protected)
router.put('/:category/:id',
  authMiddleware,
  requireEditor,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const document = await documentService.updateDocument(id, updates);
      
      res.json({
        success: true,
        data: document,
        message: 'Document updated successfully'
      });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update document'
      });
    }
  }
);

// Delete document (protected)
router.delete('/:category/:id',
  authMiddleware,
  requireEditor,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await documentService.deleteDocument(id);
      
      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete document'
      });
    }
  }
);

// Get document statistics (protected)
router.get('/stats',
  authMiddleware,
  requireEditor,
  async (req: Request, res: Response) => {
    try {
      const stats = await documentService.getDocumentStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching document stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch document statistics'
      });
    }
  }
);

export default router;