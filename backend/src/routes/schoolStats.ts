import { Router } from 'express';
import { SchoolStatsService } from '../services/schoolStatsService';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/auth';

const router = Router();
const schoolStatsService = SchoolStatsService.getInstance();

/**
 * GET /api/school-stats
 * Get all visible statistics for public display
 */
router.get('/', async (req, res) => {
  try {
    const stats = await schoolStatsService.getVisibleStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching school statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch school statistics'
    });
  }
});

/**
 * GET /api/school-stats/admin
 * Get all statistics for admin management
 */
router.get('/admin',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const stats = await schoolStatsService.getAllStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching admin school statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch school statistics'
      });
    }
  }
);

/**
 * POST /api/school-stats
 * Create or update a school statistic
 */
router.post('/',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { key, value, label, icon, type, order, isVisible } = req.body;

      // Validate required fields
      if (!key || !value) {
        return res.status(400).json({
          success: false,
          error: 'Key and value are required'
        });
      }

      const stat = await schoolStatsService.upsertStatistic({
        key,
        value,
        label,
        icon,
        type,
        order,
        isVisible
      });

      return res.status(201).json({
        success: true,
        data: stat,
        message: 'School statistic saved successfully'
      });
    } catch (error) {
      console.error('Error saving school statistic:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to save school statistic'
      });
    }
  }
);

/**
 * PUT /api/school-stats/:key
 * Update a specific school statistic
 */
router.put('/:key',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { key } = req.params;
      const { value, label, icon, type, order, isVisible } = req.body;

      if (!value) {
        return res.status(400).json({
          success: false,
          error: 'Value is required'
        });
      }

      const stat = await schoolStatsService.upsertStatistic({
        key,
        value,
        label,
        icon,
        type,
        order,
        isVisible
      });

      return res.json({
        success: true,
        data: stat,
        message: 'School statistic updated successfully'
      });
    } catch (error) {
      console.error('Error updating school statistic:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update school statistic'
      });
    }
  }
);

/**
 * DELETE /api/school-stats/:key
 * Delete a school statistic
 */
router.delete('/:key',
  authMiddleware,
  requireRole(['SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { key } = req.params;
      
      await schoolStatsService.deleteStatistic(key);
      
      res.json({
        success: true,
        message: 'School statistic deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting school statistic:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete school statistic'
      });
    }
  }
);

/**
 * POST /api/school-stats/initialize
 * Initialize default statistics (admin only)
 */
router.post('/initialize',
  authMiddleware,
  requireRole(['SUPER_ADMIN']),
  async (req, res) => {
    try {
      await schoolStatsService.initializeDefaultStats();
      
      res.json({
        success: true,
        message: 'Default school statistics initialized successfully'
      });
    } catch (error) {
      console.error('Error initializing default statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initialize default statistics'
      });
    }
  }
);

export default router;

