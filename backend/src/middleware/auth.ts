import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { createError } from './errorHandler';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
    isActive: boolean;
  };
  params: any;
  body: any;
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw createError('Access denied. No token provided.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      throw createError('Invalid token or user inactive.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError('Invalid token.', 401));
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError('Insufficient permissions.', 403));
    }

    next();
  };
};

export const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN']);
export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);
export const requireEditor = requireRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR']); 