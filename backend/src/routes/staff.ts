import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, requireEditor } from '../middleware/auth';
import { validateStaffMember } from '../middleware/validation';
import { uploadImage } from '../middleware/upload';
import uploadService from '../services/uploadService';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * ========================================
 * ENHANCED UPLOAD SERVICE INTEGRATION
 * ========================================
 * Using the new uploadService for robust file handling
 */

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

// Old processStaffImage function removed - now using uploadService

/**
 * Group staff members by category for frontend consumption
 * @param staff - Array of staff members
 * @returns Grouped staff object
 */
const groupStaffByCategory = (staff: any[]) => ({
  leadership: staff.filter(s => s.category === 'LEADERSHIP'),
  teaching: staff.filter(s => s.category === 'TEACHING'),
  admin: staff.filter(s => s.category === 'ADMIN'),
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
 * Create new staff member with photo upload using enhanced upload service
 * Middleware: requireEditor, validateStaffMember, uploadImage
 */
router.post(
  "/",
  requireEditor,
  uploadImage.single("image"),
  validateStaffMember,
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.file) {
        return next(createError('Image file is required', 400));
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

      // Use enhanced upload service
      const result = await uploadService.uploadStaffImage(req.file, staffData);

      if (!result.success) {
        return next(createError(result.error || 'Staff creation failed', 400));
      }

      return res.status(201).json({ 
        success: true, 
        message: result.message,
        data: result.data
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

      // Use enhanced upload service if image is provided
      if (req.file) {
        const staffData = {
          name,
          role,
          email,
          phone,
          bio,
          grade,
          subjects: parsedSubjects ? JSON.parse(parsedSubjects) : undefined,
          qualifications,
          experience,
          category,
          order: order ? parseInt(order, 10) : undefined
        };

        const result = await uploadService.updateStaffImage(id, req.file, staffData);

        if (!result.success) {
          return next(createError(result.error || 'Staff update failed', 400));
        }

        return res.json({
          success: true,
          message: result.message,
          data: result.data
        });
      }

      // Update without image
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
    const validCategories = ['LEADERSHIP', 'TEACHING', 'ADMIN', 'SUPPORT'];
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