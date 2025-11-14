import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, requireEditor, authMiddleware } from '../middleware/auth';
import { validateStaffMember } from '../middleware/validation';
import { uploadImage } from '../middleware/upload';
import uploadService from '../services/uploadService';
import multer from 'multer';

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
  } catch (error: any) {
    // Enhanced error logging for debugging
    console.error('❌ Error fetching staff:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      name: error?.name,
      stack: error?.stack
    });
    
    // Return more detailed error in development
    if (process.env.NODE_ENV === 'development') {
      return res.status(500).json({
        success: false,
        error: error?.message || 'Failed to fetch staff',
        details: error?.meta || error?.stack
      });
    }
    
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
  authMiddleware,
  requireEditor,
  uploadImage.single("image"),
  validateStaffMember,
  async (req: AuthRequest, res, next) => {
    try {
      const staffData = {
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,
        phone: req.body.phone,
        grade: req.body.grade,
        subjects: req.body.subjects ? JSON.parse(req.body.subjects) : undefined,
        category: req.body.category,
        order: req.body.order ? parseInt(req.body.order) : undefined,
        favoriteQuote: typeof req.body.favoriteQuote === 'string' ? req.body.favoriteQuote.trim() : undefined
      };

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
 * Middleware: requireEditor, uploadImage
 * Note: Validation is done inline to allow flexible updates (image-only or full update)
 */
router.put(
  "/:id",
  authMiddleware,
  requireEditor,
  uploadImage.single("image"),
  // Handle multer errors
  (err: any, req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 5MB'
        });
      }
      return res.status(400).json({
        success: false,
        error: `Upload error: ${err.message}`
      });
    }
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    }
    next();
  },
  async (req: AuthRequest, res, next) => {
    try {
      console.log('🔍 Staff PUT route: Starting request');
      console.log('🔍 Staff PUT route: Params:', req.params);
      console.log('🔍 Staff PUT route: Body:', req.body);
      console.log('🔍 Staff PUT route: File:', req.file ? 'Yes' : 'No');
      console.log('🔍 Staff PUT route: User:', req.user);
      
      const { id } = req.params;
      
      // Get existing staff member to use as fallback for missing fields
      const existingStaff = await prisma.staffMember.findUnique({
        where: { id }
      });

      if (!existingStaff) {
        return next(createError('Staff member not found', 404));
      }

      const {
        name,
        role,
        email,
        phone,
        grade,
        order,
        category,
        subjects,
        isActive,
        favoriteQuote
      } = req.body;

      // ✅ Safe subjects parsing
      const parsedSubjects = parseSubjects(subjects);
      if (subjects && !parsedSubjects) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid subjects format" 
        });
      }

      // Use existing values as fallback if not provided
      const staffData = {
        name: name || existingStaff.name,
        role: role || existingStaff.role || '',
        email: email !== undefined ? email : existingStaff.email,
        phone: phone !== undefined ? phone : existingStaff.phone,
        grade: grade !== undefined ? grade : existingStaff.grade,
        subjects: parsedSubjects ? JSON.parse(parsedSubjects) : (existingStaff.subjects ? JSON.parse(existingStaff.subjects) : null),
        category: category || existingStaff.category,
        order: order !== undefined ? parseInt(order, 10) : existingStaff.order,
        favoriteQuote: favoriteQuote !== undefined
          ? (typeof favoriteQuote === 'string' ? favoriteQuote.trim() : favoriteQuote)
          : existingStaff.favoriteQuote
      };

      // Basic validation for required fields
      if (!staffData.name || staffData.name.trim().length < 2) {
        return res.status(400).json({ 
          success: false, 
          error: "Name must be at least 2 characters" 
        });
      }

      if (!staffData.role || staffData.role.trim().length < 2) {
        return res.status(400).json({ 
          success: false, 
          error: "Role must be at least 2 characters" 
        });
      }

      // Use enhanced upload service if image is provided
      if (req.file) {
        console.log('🔍 Staff PUT route: Processing image upload');
        console.log('🔍 Staff PUT route: File details:', {
          originalname: req.file.originalname,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype
        });
        console.log('🔍 Staff PUT route: StaffData being sent to upload service:', staffData);

        // Verify file exists before processing
        if (!req.file.path || !require('fs').existsSync(req.file.path)) {
          console.error('❌ Staff PUT route: File path does not exist:', req.file.path);
          return res.status(400).json({
            success: false,
            error: 'Uploaded file not found on server'
          });
        }

        const result = await uploadService.updateStaffImage(id, req.file, staffData);

        if (!result.success) {
          console.error('❌ Staff PUT route: Upload service failed:', result.error);
          return next(createError(result.error || 'Staff update failed', 400));
        }

        console.log('✅ Staff PUT route: Upload successful');
        console.log('🔗 Image URL:', result.data.staff?.imageUrl);

        return res.json({
          success: true,
          message: result.message,
          data: {
            ...result.data,
            // Ensure imageUrl is easily accessible
            imageUrl: result.data.staff?.imageUrl,
            staff: result.data.staff
          }
        });
      }

      // Update without image - only update fields that are provided
      const updateData: any = {};
      
      if (name !== undefined) updateData.name = name;
      if (role !== undefined) updateData.role = role;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (grade !== undefined) updateData.grade = grade;
      if (order !== undefined) updateData.order = parseInt(order, 10);
      if (parsedSubjects !== null) updateData.subjects = parsedSubjects;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (category !== undefined) updateData.category = category;
      if (favoriteQuote !== undefined) {
        const trimmedQuote = typeof favoriteQuote === 'string' ? favoriteQuote.trim() : '';
        updateData.favoriteQuote = trimmedQuote.length > 0 ? trimmedQuote : null;
      }

      // Only update if there's data to update
      if (Object.keys(updateData).length === 0) {
        return res.json({ 
          success: true, 
          message: 'No changes provided',
          data: { staff: existingStaff } 
        });
      }

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
      console.error('🔍 Staff PUT route error:', error);
      console.error('🔍 Staff PUT route error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return next(error);
    }
  }
);

/**
 * DELETE /api/staff/:id
 * Delete staff member (soft delete by setting isActive to false)
 * Middleware: requireEditor
 */
router.delete('/:id', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
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
router.patch('/:id/status', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
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
router.patch('/:id/order', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
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