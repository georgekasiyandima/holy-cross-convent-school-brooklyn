import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema for application data
const applicationSchema = z.object({
  // Learner Information
  surname: z.string().min(1, 'Surname is required'),
  christianName: z.string().min(1, 'Christian name is required'),
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

    // Create application in database
    const application = await prisma.application.create({
      data: {
        // Learner Information
        surname: validatedData.surname,
        christianName: validatedData.christianName,
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

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to parent

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application.id,
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get all applications (admin only)
router.get('/applications', async (req, res) => {
  try {
    // TODO: Add authentication middleware to ensure only admins can access
    
    const applications = await prisma.application.findMany({
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
});

// Get application by ID (admin only)
router.get('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await prisma.application.findUnique({
      where: {
        id: parseInt(id),
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
router.patch('/applications/:id', async (req, res) => {
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
router.get('/statistics', async (req, res) => {
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
