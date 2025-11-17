import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import applicationWorkflowService from '../services/applicationWorkflowService';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema for application data
const applicationSchema = z.object({
  // Learner Information
  surname: z.string().min(1, 'Surname is required'),
  learnerName: z.string().min(1, 'Learner name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  gradeApplying: z.string().min(1, 'Grade applying for is required'),
  year: z.string().min(1, 'Year is required'),
  lastGradePassed: z.string().optional(),
  hasRepeated: z.boolean().optional(),
  repeatedGrade: z.string().optional(),
  
  // Mother's Information
  motherFullName: z.string().min(1, 'Mother\'s full name is required'),
  motherAddress: z.string().min(1, 'Mother\'s address is required'),
  motherHomePhone: z.string().optional(),
  motherWorkPhone: z.string().optional(),
  motherCellPhone: z.string().min(1, 'Mother\'s cell phone is required'),
  
  // Father's Information
  fatherFullName: z.string().min(1, 'Father\'s full name is required'),
  fatherAddress: z.string().min(1, 'Father\'s address is required'),
  fatherHomePhone: z.string().optional(),
  fatherWorkPhone: z.string().optional(),
  fatherCellPhone: z.string().min(1, 'Father\'s cell phone is required'),
  
  // Responsible Party (if not parents) - all optional
  responsiblePartyName: z.string().optional(),
  responsiblePartyAddress: z.string().optional(),
  responsiblePartyRelationship: z.string().optional(),
  responsiblePartyHomePhone: z.string().optional(),
  responsiblePartyWorkPhone: z.string().optional(),
  responsiblePartyCellPhone: z.string().optional(),
  
  // Learner Address (if different from parents)
  learnerAddress: z.string().optional(),
  
  // Religious Information
  religiousDenomination: z.string().optional(),
  isBaptised: z.boolean().optional(),
  parishChurch: z.string().optional(),
  refugeeStatus: z.boolean().optional(),
  homeLanguage: z.string().optional(),
  
  // Family Information
  numberOfChildren: z.string().optional(),
  childrenAges: z.string().optional(),
  siblingsAtHolyCross: z.boolean().optional(),
  siblingName: z.string().optional(),
  siblingGrade: z.string().optional(),
  
  // Employment Details - all optional
  motherOccupation: z.string().optional(),
  motherPlaceOfEmployment: z.string().optional(),
  motherWorkTel: z.string().optional(),
  motherWorkCell: z.string().optional(),
  motherEmail: z.string().email().optional().or(z.literal('')),
  
  fatherOccupation: z.string().optional(),
  fatherPlaceOfEmployment: z.string().optional(),
  fatherWorkTel: z.string().optional(),
  fatherWorkCell: z.string().optional(),
  fatherEmail: z.string().email().optional().or(z.literal('')),
  
  responsiblePartyOccupation: z.string().optional(),
  responsiblePartyPlaceOfEmployment: z.string().optional(),
  responsiblePartyWorkTel: z.string().optional(),
  responsiblePartyWorkCell: z.string().optional(),
  responsiblePartyEmail: z.string().email().optional().or(z.literal('')),
  
  selfEmployedDetails: z.string().optional(),
  maritalStatus: z.string().optional(),
  
  // Current School Information
  currentSchool: z.string().optional(),
  currentSchoolAddress: z.string().optional(),
  currentSchoolTel: z.string().optional(),
  currentSchoolContact: z.string().optional(),
  
  // Payment Method
  paymentMethod: z.string().optional(),
  
  // Terms and Conditions
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms and conditions'),
  agreeToPrivacy: z.boolean().refine(val => val === true, 'You must agree to privacy policy'),
});

// Submit application
router.post('/submit', async (req, res) => {
  try {
    // Validate the request body
    const validatedData = applicationSchema.parse(req.body);

    const application = await prisma.$transaction(async (tx) => {
      const createdApplication = await tx.application.create({
        data: {
        // Learner Information
        surname: validatedData.surname,
        learnerName: validatedData.learnerName,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        placeOfBirth: validatedData.placeOfBirth,
        gradeApplying: validatedData.gradeApplying,
        year: validatedData.year,
        lastGradePassed: validatedData.lastGradePassed || null,
        hasRepeated: validatedData.hasRepeated || false,
        repeatedGrade: validatedData.repeatedGrade || null,
        
        // Mother's Information
        motherFullName: validatedData.motherFullName,
        motherAddress: validatedData.motherAddress,
        motherHomePhone: validatedData.motherHomePhone || null,
        motherWorkPhone: validatedData.motherWorkPhone || null,
        motherCellPhone: validatedData.motherCellPhone,
        
        // Father's Information
        fatherFullName: validatedData.fatherFullName,
        fatherAddress: validatedData.fatherAddress,
        fatherHomePhone: validatedData.fatherHomePhone || null,
        fatherWorkPhone: validatedData.fatherWorkPhone || null,
        fatherCellPhone: validatedData.fatherCellPhone,
        
        // Responsible Party (if not parents)
        responsiblePartyName: validatedData.responsiblePartyName || null,
        responsiblePartyAddress: validatedData.responsiblePartyAddress || null,
        responsiblePartyRelationship: validatedData.responsiblePartyRelationship || null,
        responsiblePartyHomePhone: validatedData.responsiblePartyHomePhone || null,
        responsiblePartyWorkPhone: validatedData.responsiblePartyWorkPhone || null,
        responsiblePartyCellPhone: validatedData.responsiblePartyCellPhone || null,
        
        // Learner Address (if different from parents)
        learnerAddress: validatedData.learnerAddress || null,
        
        // Religious Information
        religiousDenomination: validatedData.religiousDenomination || null,
        isBaptised: validatedData.isBaptised || false,
        parishChurch: validatedData.parishChurch || null,
        refugeeStatus: validatedData.refugeeStatus || false,
        homeLanguage: validatedData.homeLanguage || null,
        
        // Family Information
        numberOfChildren: validatedData.numberOfChildren || null,
        childrenAges: validatedData.childrenAges || null,
        siblingsAtHolyCross: validatedData.siblingsAtHolyCross || false,
        siblingName: validatedData.siblingName || null,
        siblingGrade: validatedData.siblingGrade || null,
        
        // Employment Details
        motherOccupation: validatedData.motherOccupation || null,
        motherPlaceOfEmployment: validatedData.motherPlaceOfEmployment || null,
        motherWorkTel: validatedData.motherWorkTel || null,
        motherWorkCell: validatedData.motherWorkCell || null,
        motherEmail: validatedData.motherEmail || null,
        
        fatherOccupation: validatedData.fatherOccupation || null,
        fatherPlaceOfEmployment: validatedData.fatherPlaceOfEmployment || null,
        fatherWorkTel: validatedData.fatherWorkTel || null,
        fatherWorkCell: validatedData.fatherWorkCell || null,
        fatherEmail: validatedData.fatherEmail || null,
        
        responsiblePartyOccupation: validatedData.responsiblePartyOccupation || null,
        responsiblePartyPlaceOfEmployment: validatedData.responsiblePartyPlaceOfEmployment || null,
        responsiblePartyWorkTel: validatedData.responsiblePartyWorkTel || null,
        responsiblePartyWorkCell: validatedData.responsiblePartyWorkCell || null,
        responsiblePartyEmail: validatedData.responsiblePartyEmail || null,
        
        selfEmployedDetails: validatedData.selfEmployedDetails || null,
        maritalStatus: validatedData.maritalStatus || null,
        
        // Current School Information
        currentSchool: validatedData.currentSchool || null,
        currentSchoolAddress: validatedData.currentSchoolAddress || null,
        currentSchoolTel: validatedData.currentSchoolTel || null,
        currentSchoolContact: validatedData.currentSchoolContact || null,
        
        // Payment Method
        paymentMethod: validatedData.paymentMethod || null,
        
        // Application Status
        status: 'PENDING',
        submittedAt: new Date(),
      },
      });

      try {
        await applicationWorkflowService.initializeWorkflow(createdApplication.id, tx);
      } catch (workflowError: any) {
        console.error('Error initializing workflow:', workflowError);
        // Don't fail the application creation if workflow initialization fails
        // The workflow can be initialized later manually if needed
        console.warn('Application created but workflow initialization failed. Application ID:', createdApplication.id);
      }

      return createdApplication;
    });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to parent

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application.id,
    });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
    });
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues,
      });
    }

    // Provide more detailed error information in development
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error?.message || 'Internal server error';

    res.status(500).json({
      success: false,
      message: errorMessage,
      ...(process.env.NODE_ENV !== 'production' && {
        error: error?.message,
        stack: error?.stack,
      }),
    });
  }
});

// Get all applications (admin only)
router.get('/applications', 
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const applications = await prisma.application.findMany({
        include: {
          documents: {
            select: {
              id: true,
              documentType: true,
              originalName: true,
              fileName: true,
              uploadedAt: true,
            },
            orderBy: {
              uploadedAt: 'desc',
            },
          },
          stages: {
            select: {
              id: true,
              stageKey: true,
              name: true,
              description: true,
              assignedRole: true,
              assignedUserId: true,
              sequence: true,
              status: true,
              startedAt: true,
              completedAt: true,
              dueDate: true,
              payload: true,
            },
            orderBy: {
              sequence: 'asc',
            },
          },
        },
        orderBy: {
          submittedAt: 'desc',
        },
      });

      res.json({
        success: true,
        applications,
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Get workflow summary for application (authorized staff)
router.get(
  '/applications/:id/workflow',
  authMiddleware,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'SECRETARY', 'BURSAR', 'PRINCIPAL', 'TEACHER']),
  async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id, 10);

      if (Number.isNaN(applicationId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid application id'
        });
      }

      const application = await prisma.application.findUnique({
        where: { id: applicationId }
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      const summary = await applicationWorkflowService.getWorkflowSummary(applicationId);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Error fetching workflow summary:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to fetch workflow summary'
      });
    }
  }
);

// Update workflow stage status
router.patch(
  '/applications/:id/stages/:stageId/status',
  authMiddleware,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'SECRETARY', 'BURSAR', 'PRINCIPAL', 'TEACHER']),
  async (req: AuthRequest, res) => {
    try {
      const applicationId = parseInt(req.params.id, 10);
      const stageId = parseInt(req.params.stageId, 10);
      const { status, notes, metadata } = req.body;

      if (Number.isNaN(applicationId) || Number.isNaN(stageId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid identifiers supplied'
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const updatedStage = await prisma.$transaction(async (tx) => {
        const stage = await tx.applicationStage.findUnique({
          where: { id: stageId }
        });

        if (!stage || stage.applicationId !== applicationId) {
          throw {
            handled: true,
            status: 404,
            message: 'Stage not found for application'
          };
        }

        if (
          req.user &&
          !['SUPER_ADMIN', 'ADMIN'].includes(req.user.role) &&
          stage.assignedRole !== req.user.role
        ) {
          throw {
            handled: true,
            status: 403,
            message: 'You are not assigned to this stage'
          };
        }

        return applicationWorkflowService.updateStageStatus(
          applicationId,
          stageId,
          {
            status,
            notes,
            metadata,
            actorUserId: req.user?.id,
            actorDisplayName: req.user?.name || req.user?.email
          },
          tx
        );
      });

      res.json({
        success: true,
        stage: updatedStage
      });
    } catch (error: any) {
      if (error?.handled) {
        return res.status(error.status).json({
          success: false,
          message: error.message
        });
      }

      console.error('Error updating stage status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update stage status'
      });
    }
  }
);

// Assign workflow stage to role or user
router.post(
  '/applications/:id/stages/:stageId/assign',
  authMiddleware,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL']),
  async (req: AuthRequest, res) => {
    try {
      const applicationId = parseInt(req.params.id, 10);
      const stageId = parseInt(req.params.stageId, 10);
      const { assignedRole, assignedUserId, notes, metadata } = req.body;

      if (Number.isNaN(applicationId) || Number.isNaN(stageId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid identifiers supplied'
        });
      }

      const updatedStage = await prisma.$transaction(async (tx) => {
        const stage = await tx.applicationStage.findUnique({
          where: { id: stageId }
        });

        if (!stage || stage.applicationId !== applicationId) {
          throw {
            handled: true,
            status: 404,
            message: 'Stage not found for application'
          };
        }

        return applicationWorkflowService.assignStage(
          applicationId,
          stageId,
          {
            assignedRole,
            assignedUserId,
            notes,
            metadata,
            actorUserId: req.user?.id,
            actorDisplayName: req.user?.name || req.user?.email
          },
          tx
        );
      });

      res.json({
        success: true,
        stage: updatedStage
      });
    } catch (error: any) {
      if (error?.handled) {
        return res.status(error.status).json({
          success: false,
          message: error.message
        });
      }

      console.error('Error assigning stage:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign workflow stage'
      });
    }
  }
);

// Get application by ID (admin only)
router.get('/applications/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await prisma.application.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        documents: {
          select: {
            id: true,
            documentType: true,
            originalName: true,
            fileName: true,
            filePath: true,
            fileSize: true,
            uploadedAt: true,
          },
          orderBy: {
            uploadedAt: 'desc',
          },
        },
        stages: {
          select: {
            id: true,
            stageKey: true,
            name: true,
            assignedRole: true,
            assignedUserId: true,
            sequence: true,
            status: true,
            startedAt: true,
            completedAt: true,
            dueDate: true,
            description: true,
          },
          orderBy: {
            sequence: 'asc',
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Update application status (admin only)
router.patch('/applications/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ENROLLED'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const application = await prisma.application.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status,
        notes: notes || null,
        updatedAt: new Date(),
      },
      include: {
        documents: {
          select: {
            id: true,
            documentType: true,
            originalName: true,
            uploadedAt: true,
          },
          orderBy: {
            uploadedAt: 'desc',
          },
        },
      },
    });

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get application statistics (admin only)
router.get('/statistics',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
  try {
    const totalApplications = await prisma.application.count();
    const pendingApplications = await prisma.application.count({
      where: { status: 'PENDING' },
    });
    const approvedApplications = await prisma.application.count({
      where: { status: 'APPROVED' },
    });
    const enrolledApplications = await prisma.application.count({
      where: { status: 'ENROLLED' },
    });

    // Grade distribution
    const gradeDistribution = await prisma.application.groupBy({
      by: ['gradeApplying'],
      _count: {
        gradeApplying: true,
      },
    });

    // Monthly applications
    const monthlyApplications = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "submittedAt") as month,
        COUNT(*) as count
      FROM "Application"
      WHERE "submittedAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "submittedAt")
      ORDER BY month DESC
    `;

    res.json({
      success: true,
      statistics: {
        totalApplications,
        pendingApplications,
        approvedApplications,
        enrolledApplications,
        total: totalApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        enrolled: enrolledApplications,
        gradeDistribution,
        monthlyApplications,
      },
    });
  } catch (error) {
    console.error('Error fetching application statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
