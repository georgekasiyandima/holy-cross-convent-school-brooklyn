import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const router = express.Router();
const prisma = new PrismaClient();

// Register new user (admin only)
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, role = 'ADMIN' } = req.body;

    // Validate input
    if (!email || !password || !name) {
      throw createError('Please provide email, password, and name', 400);
    }

    if (password.length < 6) {
      throw createError('Password must be at least 6 characters long', 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw createError('User with this email already exists', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Login attempt:', { email, hasPassword: !!password });

    // Validate input
    if (!email || !password) {
      console.log('❌ Login failed: Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      console.log('❌ Login failed: User not found for email:', email);
      // Check if any users exist at all
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        return res.status(401).json({
          success: false,
          error: 'No admin user found',
          message: 'No admin user exists. Please create an admin user first using /api/auth/setup endpoint.',
          needsSetup: true
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      console.log('❌ Login failed: User is inactive:', email);
      return res.status(401).json({
        success: false,
        error: 'Account inactive',
        message: 'Your account has been deactivated. Please contact an administrator.'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password for email:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret === 'fallback-secret') {
      console.warn('⚠️  Warning: Using fallback JWT_SECRET. Please set JWT_SECRET in environment variables.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret || 'fallback-secret',
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for user:', user.email);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive
        },
        token
      }
    });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    next(error);
  }
});

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'User not found or inactive'
        });
      }

      return res.json({
        success: true,
        data: { user }
      });
    } catch (jwtError: any) {
      // JWT verification failed
      return res.status(401).json({
        success: false,
        error: jwtError.message === 'jwt expired' ? 'Token expired' : 'Invalid token'
      });
    }
  } catch (error: any) {
    console.error('Error in /me endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Change password
router.put('/change-password', async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const { currentPassword, newPassword } = req.body;

    if (!token) {
      throw createError('No token provided', 401);
    }

    if (!currentPassword || !newPassword) {
      throw createError('Please provide current and new password', 400);
    }

    if (newPassword.length < 6) {
      throw createError('New password must be at least 6 characters long', 400);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      throw createError('User not found', 401);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw createError('Current password is incorrect', 400);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    });

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Create initial admin user (for first-time setup)
router.post('/setup', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    console.log('🔍 Setup attempt:', { email, hasPassword: !!password, name });

    // Check if any user exists
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      console.log('❌ Setup failed: Users already exist');
      return res.status(400).json({
        success: false,
        error: 'Setup already completed',
        message: 'Admin user already exists. Please use the login endpoint instead.'
      });
    }

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide email, password, and name'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password too short',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create super admin user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name,
        role: 'SUPER_ADMIN',
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    console.log('✅ Admin user created:', user.email);

    // Generate token
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Initial admin user created successfully',
      data: {
        user,
        token
      }
    });
  } catch (error: any) {
    console.error('❌ Setup error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }
    next(error);
  }
});

// Check if setup is needed (public endpoint)
router.get('/check-setup', async (req, res, next) => {
  try {
    const userCount = await prisma.user.count();
    res.json({
      success: true,
      data: {
        needsSetup: userCount === 0,
        userCount
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 