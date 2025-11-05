import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Validation schemas for gallery operations
export const createGalleryItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional().or(z.literal('')),
  category: z.enum(['EVENTS', 'SPORTS', 'ACADEMIC', 'CULTURAL', 'GENERAL', 'CLASS_PHOTOS'], {
    errorMap: () => ({ message: 'Invalid category' })
  }).optional(),
  tags: z.string().optional().or(z.literal('')),
  albumId: z.string().optional().or(z.literal('')),
  isPublished: z.string().transform(val => val === 'true' || val === '' || val === undefined).optional().default(true),
  postToSocial: z.string().optional(),
});

export const updateGalleryItemSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  category: z.enum(['EVENTS', 'SPORTS', 'ACADEMIC', 'CULTURAL', 'GENERAL', 'CLASS_PHOTOS']).optional(),
  tags: z.string().optional(),
  albumId: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
});

export const createAlbumSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000).optional(),
  albumType: z.enum(['GENERAL', 'CLASS']).default('GENERAL'),
  classGrade: z.string().optional(),
  coverImageId: z.string().optional(),
  isPublished: z.boolean().optional().default(true),
});

export const updateAlbumSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  albumType: z.enum(['GENERAL', 'CLASS']).optional(),
  classGrade: z.string().nullable().optional(),
  coverImageId: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
});

export const queryParamsSchema = z.object({
  category: z.string().optional(),
  type: z.enum(['IMAGE', 'VIDEO']).optional(),
  albumId: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('20'),
  isPublished: z.string().transform(val => val === 'true').optional(),
}).passthrough(); // Allow additional query params

// Validation middleware
export const validateCreateGalleryItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    createGalleryItemSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(error);
  }
};

export const validateUpdateGalleryItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateGalleryItemSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(error);
  }
};

export const validateCreateAlbum = (req: Request, res: Response, next: NextFunction) => {
  try {
    createAlbumSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(error);
  }
};

export const validateUpdateAlbum = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateAlbumSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(error);
  }
};

export const validateQueryParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = queryParamsSchema.parse(req.query);
    req.query = validated as any;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(error);
  }
};

