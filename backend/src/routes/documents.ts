import { Router, Request, Response } from 'express';
import DocumentService from '../services/documentService';
import { authMiddleware } from '../middleware/auth';
import { requireEditor } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const documentService: InstanceType<typeof DocumentService> = DocumentService.getInstance();

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

// Get all published documents (public)
router.get('/all', async (req: Request, res: Response) => {
  try {
    const documents = await documentService.getAllPublishedDocuments();
    
    res.json({
      success: true,
      data: documents,
      count: documents.length
    });
  } catch (error) {
    console.error('Error fetching all documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch documents'
    });
  }
});

// Get all documents by category (public)
// IMPORTANT: This route must come AFTER /all to avoid route conflicts
router.get('/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    
    // Guard: prevent /all from being matched as a category
    if (category === 'all') {
      return res.status(404).json({
        success: false,
        error: 'Route not found. Use /api/documents/all to get all documents.'
      });
    }
    
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
  (req: Request, res: Response, next: any) => {
    upload.single('file')(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              error: 'File too large. Maximum size is 10MB'
            });
          }
          return res.status(400).json({
            success: false,
            error: err.message || 'File upload error'
          });
        }
        return res.status(400).json({
          success: false,
          error: err.message || 'File upload error'
        });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      // Handle multer errors
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }
        
      const { title, description, category, isPublished, authorId, authorName } = req.body;
      
      if (!title || !category) {
        // Clean up uploaded file if validation fails
        if (req.file.path) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (unlinkError) {
            console.error('Error deleting file after validation failure:', unlinkError);
          }
        }
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
        fileSize: Number(req.file.size) || 0, // Ensure it's a number
        mimeType: req.file.mimetype,
        category,
        tags: [],
        // Default to published if not explicitly set to false
        isPublished: isPublished === 'false' ? false : true,
        authorId: authorId || 'system',
        authorName: authorName || 'System'
      };
      
      console.log('Document data being created:', documentData);
          
      const document = await documentService.createDocument(documentData);
          
      return res.json({
        success: true,
        data: document,
        message: 'Document uploaded successfully'
      });
    } catch (error: any) {
      console.error('Error uploading document:', error);
      console.error('Error details:', {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        stack: error?.stack
      });
      
      // Clean up uploaded file if database operation fails
      if (req.file?.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file after upload failure:', unlinkError);
        }
      }
      
      // Return more detailed error message
      const errorMessage = error?.message || 'Failed to upload document';
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return res.status(500).json({
        success: false,
        error: errorMessage,
        ...(isDevelopment && {
          details: error?.stack,
          errorName: error?.name,
          errorCode: error?.code
        })
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