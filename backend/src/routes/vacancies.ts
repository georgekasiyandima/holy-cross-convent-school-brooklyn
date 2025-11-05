import express from 'express';
import vacancyService from '../services/vacancyService';
import { AuthRequest, requireEditor, authMiddleware } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

/**
 * ========================================
 * PUBLIC ROUTES
 * ========================================
 */

/**
 * GET /api/vacancies
 * Get all published vacancies (public endpoint)
 */
router.get('/', async (req, res, next) => {
  try {
    const vacancies = await vacancyService.getPublishedVacancies();
    res.json({
      success: true,
      data: vacancies,
    });
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    next(createError('Failed to fetch vacancies', 500));
  }
});

/**
 * ========================================
 * PROTECTED ROUTES (Admin/Editor only)
 * IMPORTANT: Admin routes must be defined BEFORE /:id route
 * to avoid route conflicts
 * ========================================
 */

/**
 * GET /api/vacancies/admin/all
 * Get all vacancies (including unpublished) - Admin only
 */
router.get('/admin/all', authMiddleware, requireEditor, async (req, res, next) => {
  try {
    const { department, publishedOnly, isUrgent } = req.query;
    
    const options: any = {};
    if (publishedOnly === 'true') options.publishedOnly = true;
    if (department) options.department = department as string;
    if (isUrgent !== undefined) options.isUrgent = isUrgent === 'true';

    const vacancies = await vacancyService.getAllVacancies(options);
    res.json({
      success: true,
      data: vacancies,
    });
  } catch (error) {
    console.error('Error fetching all vacancies:', error);
    next(createError('Failed to fetch vacancies', 500));
  }
});

/**
 * GET /api/vacancies/admin/:id
 * Get a single vacancy by ID (admin) - includes unpublished
 */
router.get('/admin/:id', authMiddleware, requireEditor, async (req, res, next) => {
  try {
    const { id } = req.params;
    const vacancy = await vacancyService.getVacancyById(id);

    if (!vacancy) {
      return next(createError('Vacancy not found', 404));
    }

    res.json({
      success: true,
      data: vacancy,
    });
  } catch (error) {
    console.error('Error fetching vacancy:', error);
    next(createError('Failed to fetch vacancy', 500));
  }
});

/**
 * POST /api/vacancies/admin
 * Create a new vacancy
 */
router.post('/admin', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const vacancyData = req.body;
    const vacancy = await vacancyService.createVacancy(vacancyData);

    res.status(201).json({
      success: true,
      data: vacancy,
      message: 'Vacancy created successfully',
    });
  } catch (error) {
    console.error('Error creating vacancy:', error);
    next(createError('Failed to create vacancy', 500));
  }
});

/**
 * PUT /api/vacancies/admin/:id
 * Update a vacancy
 */
router.put('/admin/:id', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const vacancyData = req.body;

    const vacancy = await vacancyService.updateVacancy(id, vacancyData);

    res.json({
      success: true,
      data: vacancy,
      message: 'Vacancy updated successfully',
    });
  } catch (error) {
    console.error('Error updating vacancy:', error);
    if ((error as any).code === 'P2025') {
      return next(createError('Vacancy not found', 404));
    }
    next(createError('Failed to update vacancy', 500));
  }
});

/**
 * DELETE /api/vacancies/admin/:id
 * Delete a vacancy
 */
router.delete('/admin/:id', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    await vacancyService.deleteVacancy(id);

    res.json({
      success: true,
      message: 'Vacancy deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting vacancy:', error);
    if ((error as any).code === 'P2025') {
      return next(createError('Vacancy not found', 404));
    }
    next(createError('Failed to delete vacancy', 500));
  }
});

/**
 * ========================================
 * PUBLIC ROUTE (must come AFTER admin routes)
 * ========================================
 */

/**
 * GET /api/vacancies/:id
 * Get a single published vacancy by ID (public endpoint)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Prevent conflict with admin routes
    if (id === 'admin') {
      return next(createError('Vacancy not found', 404));
    }
    
    const vacancy = await vacancyService.getVacancyById(id);

    if (!vacancy) {
      return next(createError('Vacancy not found', 404));
    }

    if (!vacancy.isPublished) {
      return next(createError('Vacancy not found', 404));
    }

    // Check if vacancy is still open (if closing date is set)
    if (vacancy.closingDate && new Date(vacancy.closingDate) < new Date()) {
      return next(createError('This vacancy has closed', 404));
    }

    res.json({
      success: true,
      data: vacancy,
    });
  } catch (error) {
    console.error('Error fetching vacancy:', error);
    next(createError('Failed to fetch vacancy', 500));
  }
});

export default router;

