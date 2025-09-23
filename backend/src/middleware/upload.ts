import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const createUploadDirectories = () => {
  const directories = [
    'uploads',
    'uploads/policies',
    'uploads/forms',
    'uploads/gallery',
    'uploads/staff',
    'uploads/news',
    'uploads/events',
    'uploads/newsletters',
    'uploads/reports'
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirectories();

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Determine upload path based on route or file type
    if (req.baseUrl.includes('policies')) {
      uploadPath += 'policies/';
    } else if (req.baseUrl.includes('forms')) {
      uploadPath += 'forms/';
    } else if (req.baseUrl.includes('gallery')) {
      uploadPath += 'gallery/';
    } else if (req.baseUrl.includes('staff')) {
      uploadPath += 'staff/';
    } else if (req.baseUrl.includes('news')) {
      uploadPath += 'news/';
    } else if (req.baseUrl.includes('events')) {
      uploadPath += 'events/';
    } else if (req.baseUrl.includes('newsletters')) {
      uploadPath += 'newsletters/';
    } else if (req.baseUrl.includes('reports')) {
      uploadPath += 'reports/';
    } else {
      uploadPath += 'general/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    
    // Sanitize filename
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
    
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Define allowed file types
  const allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
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

  const allowedTypes = [...allowedImageTypes, ...allowedDocumentTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

// Configure multer with different options for different use cases
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB default
    files: 1 // Single file upload
  }
});

// Specific upload configurations for different file types
export const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for images
    files: 1
  }
});

export const uploadDocument = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
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
      cb(new Error('Only document files are allowed'));
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB for documents
    files: 1
  }
});

export const uploadPDF = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB for PDFs
    files: 1
  }
});

// Multiple file upload for gallery
export const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10 // Maximum 10 files
  }
});

// Error handling middleware for multer
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'The uploaded file exceeds the maximum allowed size'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Too many files were uploaded'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected file field',
        message: 'An unexpected file field was found'
      });
    }
  }

  if (error.message.includes('File type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: error.message
    });
  }

  // Default error
  return res.status(500).json({
    error: 'File upload failed',
    message: 'An error occurred during file upload'
  });
};

// Helper function to delete uploaded files
export const deleteUploadedFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to get file info
export const getFileInfo = (file: Express.Multer.File) => {
  return {
    originalName: file.originalname,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    url: `/uploads/${file.filename}`
  };
};

// Helper function to validate file dimensions (for images)
export const validateImageDimensions = (file: Express.Multer.File, maxWidth: number, maxHeight: number) => {
  return new Promise((resolve, reject) => {
    if (!file.mimetype.startsWith('image/')) {
      resolve(true); // Not an image, skip validation
      return;
    }

    const sharp = require('sharp');
    sharp(file.path)
      .metadata()
      .then((metadata: any) => {
        if (metadata.width > maxWidth || metadata.height > maxHeight) {
          reject(new Error(`Image dimensions must be ${maxWidth}x${maxHeight} or smaller`));
        } else {
          resolve(true);
        }
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

// Helper function to resize image
export const resizeImage = (file: Express.Multer.File, width: number, height: number, quality: number = 80) => {
  return new Promise((resolve, reject) => {
    if (!file.mimetype.startsWith('image/')) {
      resolve(file.path); // Not an image, return original path
      return;
    }

    const sharp = require('sharp');
    const resizedPath = file.path.replace(/\.[^/.]+$/, '_resized.jpg');

    sharp(file.path)
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality })
      .toFile(resizedPath)
      .then(() => {
        // Delete original file
        deleteUploadedFile(file.path);
        resolve(resizedPath);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

// Helper function to create thumbnail
export const createThumbnail = (file: Express.Multer.File, size: number = 150) => {
  return new Promise((resolve, reject) => {
    if (!file.mimetype.startsWith('image/')) {
      resolve(null); // Not an image, no thumbnail
      return;
    }

    const sharp = require('sharp');
    const thumbnailPath = file.path.replace(/\.[^/.]+$/, '_thumb.jpg');

    sharp(file.path)
      .resize(size, size, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath)
      .then(() => {
        resolve(thumbnailPath);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};
