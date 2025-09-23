import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, requireEditor } from '../middleware/auth';
import { validateStaffMember } from '../middleware/validation';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * ========================================
 * MULTER CONFIGURATION
 * ========================================
 * Configure multer for staff photo uploads with validation
 */
const uploadImage = multer({
  dest: 'temp/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  }
});

/**
 * ========================================
 * UTILITY FUNCTIONS
 * ========================================
 */

/**
 * Safely parse subjects JSON string or array
 * @param subjects - Subjects data (string or array)
 * @returns Parsed subjects as JSON string or null
 */
const parseSubjects = (subjects: any): string | null => {
  if (!subjects) return null;
  
  try {
    const parsed = typeof subjects === "string" ? JSON.parse(subjects) : subjects;
    if (Array.isArray(parsed)) {
      return JSON.stringify(parsed);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Process and optimize uploaded staff image
 * @param file - Multer file object
 * @param staffName - Staff member name for filename
 * @returns Optimized image URL
 */
const processStaffImage = async (file: Express.Multer.File, staffName: string): Promise<string> => {
  const timestamp = Date.now();
  const baseName = `${staffName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`;
  
  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads', 'staff');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Optimize and save image using Sharp
  const optimizedPath = path.join(uploadsDir, `${baseName}.jpg`);
  
  await sharp(file.path)
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .jpeg({ quality: 90, progressive: true })
    .toFile(optimizedPath);

  // Clean up temp file
  fs.unlinkSync(file.path);

  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/staff/${baseName}.jpg`;
};

/**
 * Group staff members by category for frontend consumption
 * @param staff - Array of staff members
 * @returns Grouped staff object
 */
const groupStaffByCategory = (staff: any[]) => ({
  leadership: staff.filter(s => s.category === 'LEADERSHIP'),
  teaching: staff.filter(s => s.category === 'TEACHING'),
  support: staff.filter(s => s.category === 'SUPPORT')
});

/**
 * ========================================
 * PUBLIC ROUTES
 * ========================================
 */

/**
 * GET /api/staff
 * Get all active staff members with optional filtering
 * Supports query parameters: grade, category
 */
router.get('/', async (req, res, next) => {
  try {
    const { grade, category } = req.query;

    // Build where clause for filtering
    const where: any = { isActive: true };
    
    if (grade) {
      where.grade = grade;
    }

    if (category) {
      where.category = category;
    }

    // Fetch staff members from database
    const staff = await prisma.staffMember.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    // Group staff by category for frontend
    const groupedStaff = groupStaffByCategory(staff);

    res.json({
      success: true,
      data: { 
        staff,
        groupedStaff
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/staff/:id
 * Get single staff member by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const staff = await prisma.staffMember.findFirst({
      where: { 
        id,
        isActive: true 
      }
    });

    if (!staff) {
      throw createError('Staff member not found', 404);
    }

    res.json({
      success: true,
      data: { staff }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * ========================================
 * PROTECTED ROUTES (Admin/Editor Only)
 * ========================================
 */

/**
 * POST /api/staff
 * Create new staff member with photo upload
 * Middleware: requireEditor, validateStaffMember, uploadImage
 */
router.post(
  "/",
  requireEditor,
  uploadImage.single("image"),
  validateStaffMember,
  async (req: AuthRequest, res, next) => {
    try {
      const {
        name,
        role,
        email,
        phone,
        bio,
        grade,
        order,
        category,
        subjects,
        qualifications,
        experience
      } = req.body;

      // ✅ Safe subjects parsing
      const parsedSubjects = parseSubjects(subjects);
      if (subjects && !parsedSubjects) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid subjects format" 
        });
      }

      // Process uploaded image if provided
      let imageUrl: string | undefined = undefined;
      if (req.file) {
        try {
          imageUrl = await processStaffImage(req.file, name);
        } catch (imageError) {
          console.error('Image processing error:', imageError);
          return res.status(500).json({
            success: false,
            error: 'Failed to process uploaded image'
          });
        }
      }

      // Create staff member in database
    const staff = await prisma.staffMember.create({
      data: {
          name,
          role,
          email,
          phone,
          bio,
          grade,
          order: order ? parseInt(order, 10) : 0,
          subjects: parsedSubjects,
          qualifications,
          experience,
          imageUrl,
          category: category || 'TEACHING',
        },
      });

      return res.status(201).json({ 
        success: true, 
        message: 'Staff member created successfully',
        data: { staff } 
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * PUT /api/staff/:id
 * Update existing staff member with optional photo upload
 * Middleware: requireEditor, uploadImage, validateStaffMember
 */
router.put(
  "/:id",
  requireEditor,
  uploadImage.single("image"),
  validateStaffMember,
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        role,
        email,
        phone,
        bio,
        grade,
        order,
        category,
        subjects,
        qualifications,
        experience,
        isActive
      } = req.body;

      // ✅ Safe subjects parsing
      const parsedSubjects = parseSubjects(subjects);
      if (subjects && !parsedSubjects) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid subjects format" 
        });
      }

      // Process uploaded image if provided
      let imageUrl: string | undefined = undefined;
      if (req.file) {
        try {
          imageUrl = await processStaffImage(req.file, name);
        } catch (imageError) {
          console.error('Image processing error:', imageError);
          return res.status(500).json({
            success: false,
            error: 'Failed to process uploaded image'
          });
        }
      }

      // Prepare update data
      const updateData: any = {
        name,
        role,
        email,
        phone,
        bio,
        grade,
        order: order ? parseInt(order, 10) : 0,
        subjects: parsedSubjects,
        qualifications,
        experience,
        isActive,
        category,
      };

      // ✅ Only update imageUrl if new image provided
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      // Update staff member in database
      const staff = await prisma.staffMember.update({
        where: { id },
        data: updateData,
      });

      return res.json({ 
        success: true, 
        message: 'Staff member updated successfully',
        data: { staff } 
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * DELETE /api/staff/:id
 * Delete staff member (soft delete by setting isActive to false)
 * Middleware: requireEditor
 */
router.delete('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    // Check if staff member exists
    const existingStaff = await prisma.staffMember.findUnique({
      where: { id }
    });

    if (!existingStaff) {
      throw createError('Staff member not found', 404);
    }

    // Soft delete by setting isActive to false
    await prisma.staffMember.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Staff member deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * ========================================
 * ADDITIONAL UTILITY ROUTES
 * ========================================
 */

/**
 * GET /api/staff/categories
 * Get staff members grouped by category
 */
router.get('/categories', async (req, res, next) => {
  try {
    const staff = await prisma.staffMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    const groupedStaff = groupStaffByCategory(staff);

    res.json({
      success: true,
      data: { groupedStaff }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/staff/category/:category
 * Get staff members by specific category
 */
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    
    // Validate category
    const validCategories = ['LEADERSHIP', 'TEACHING', 'SUPPORT'];
    if (!validCategories.includes(category.toUpperCase())) {
      throw createError('Invalid category', 400);
    }

    const staff = await prisma.staffMember.findMany({
      where: { 
        category: category.toUpperCase() as any,
        isActive: true 
      },
      orderBy: { order: 'asc' }
    });

    res.json({
      success: true,
      data: { staff }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/staff/:id/status
 * Toggle staff member active status
 * Middleware: requireEditor
 */
router.patch('/:id/status', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      throw createError('isActive must be a boolean value', 400);
    }

    const staff = await prisma.staffMember.update({
      where: { id },
      data: { isActive }
    });

    res.json({
      success: true,
      message: `Staff member ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { staff }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/staff/:id/order
 * Update staff member display order
 * Middleware: requireEditor
 */
router.patch('/:id/order', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    if (typeof order !== 'number' || order < 0) {
      throw createError('Order must be a non-negative number', 400);
    }

    const staff = await prisma.staffMember.update({
      where: { id },
      data: { order }
    });

    res.json({
      success: true,
      message: 'Staff member order updated successfully',
      data: { staff }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 