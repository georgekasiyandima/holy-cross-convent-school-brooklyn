import request from 'supertest';
import express from 'express';
import admissionsRouter from '../admissions';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    application: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const app = express();
app.use(express.json());
app.use('/api/admissions', admissionsRouter);

describe('Admissions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/admissions/submit', () => {
    const validApplicationData = {
      surname: 'Doe',
      christianName: 'John',
      dateOfBirth: '2015-01-15',
      placeOfBirth: 'Cape Town',
      gradeApplying: 'Grade 1',
      year: '2026',
      motherFullName: 'Jane Doe',
      motherAddress: '123 Main St, Cape Town',
      motherCellPhone: '0821234567',
      fatherFullName: 'John Doe',
      fatherAddress: '123 Main St, Cape Town',
      fatherCellPhone: '0827654321',
      agreeToTerms: true,
      agreeToPrivacy: true,
    };

    it('should successfully submit a valid application', async () => {
      const mockApplication = {
        id: 1,
        ...validApplicationData,
        status: 'PENDING',
        submittedAt: new Date(),
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.application.create.mockResolvedValue(mockApplication);

      const response = await request(app)
        .post('/api/admissions/submit')
        .send(validApplicationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.applicationId).toBe(1);
      expect(mockPrisma.application.create).toHaveBeenCalled();
    });

    it('should reject application with missing required fields', async () => {
      const invalidData = {
        surname: 'Doe',
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/admissions/submit')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors).toBeDefined();
    });

    it('should reject application without terms agreement', async () => {
      const dataWithoutTerms = {
        ...validApplicationData,
        agreeToTerms: false,
      };

      const response = await request(app)
        .post('/api/admissions/submit')
        .send(dataWithoutTerms)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject application without privacy policy agreement', async () => {
      const dataWithoutPrivacy = {
        ...validApplicationData,
        agreeToPrivacy: false,
      };

      const response = await request(app)
        .post('/api/admissions/submit')
        .send(dataWithoutPrivacy)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle database errors gracefully', async () => {
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.application.create.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/admissions/submit')
        .send(validApplicationData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('GET /api/admissions/applications', () => {
    it('should fetch all applications', async () => {
      const mockApplications = [
        {
          id: 1,
          surname: 'Doe',
          christianName: 'John',
          status: 'PENDING',
        },
        {
          id: 2,
          surname: 'Smith',
          christianName: 'Jane',
          status: 'APPROVED',
        },
      ];

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.application.findMany.mockResolvedValue(mockApplications);

      const response = await request(app)
        .get('/api/admissions/applications')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.applications).toHaveLength(2);
    });
  });

  describe('GET /api/admissions/applications/:id', () => {
    it('should fetch a specific application by ID', async () => {
      const mockApplication = {
        id: 1,
        surname: 'Doe',
        christianName: 'John',
        status: 'PENDING',
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.application.findUnique.mockResolvedValue(mockApplication);

      const response = await request(app)
        .get('/api/admissions/applications/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.application.id).toBe(1);
    });

    it('should return 404 for non-existent application', async () => {
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.application.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/admissions/applications/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Application not found');
    });
  });

  describe('PATCH /api/admissions/applications/:id', () => {
    it('should update application status', async () => {
      const mockApplication = {
        id: 1,
        status: 'APPROVED',
        notes: 'Application approved',
        updatedAt: new Date(),
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.application.update.mockResolvedValue(mockApplication);

      const response = await request(app)
        .patch('/api/admissions/applications/1')
        .send({ status: 'APPROVED', notes: 'Application approved' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.application.status).toBe('APPROVED');
    });

    it('should reject invalid status', async () => {
      const response = await request(app)
        .patch('/api/admissions/applications/1')
        .send({ status: 'INVALID_STATUS' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid status');
    });
  });
});

