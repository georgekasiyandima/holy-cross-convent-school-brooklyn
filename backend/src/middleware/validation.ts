import { Request, Response, NextFunction } from 'express';

// Validation middleware for policy documents
export const validatePolicy = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, content, category } = req.body;

  const errors: string[] = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!content || content.trim().length < 10) {
    errors.push('Content must be at least 10 characters long');
  }

  if (!category) {
    errors.push('Category is required');
  }

  const validCategories = [
    'ACADEMIC',
    'DISCIPLINARY',
    'SAFETY',
    'FINANCIAL',
    'ADMINISTRATIVE',
    'TECHNOLOGY',
    'HEALTH',
    'OTHER'
  ];

  if (category && !validCategories.includes(category)) {
    errors.push('Invalid category');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  return next();
};

// Validation middleware for events
export const validateEvent = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, startDate, endDate, category } = req.body;

  const errors: string[] = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }

  if (!startDate) {
    errors.push('Start date is required');
  } else {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      errors.push('Invalid start date format');
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      errors.push('Invalid end date format');
    } else if (new Date(startDate) >= end) {
      errors.push('End date must be after start date');
    }
  }

  if (!category) {
    errors.push('Category is required');
  }

  const validCategories = [
    'ACADEMIC',
    'SPIRITUAL',
    'CELEBRATION',
    'SPORTS',
    'CULTURAL',
    'COMMUNITY',
    'EXTRA_MURAL',
    'HOLIDAY'
  ];

  if (category && !validCategories.includes(category)) {
    errors.push('Invalid category');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  return next();
};

// Validation middleware for news articles
export const validateNewsArticle = (req: Request, res: Response, next: NextFunction) => {
  const { title, content, summary } = req.body;

  const errors: string[] = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!content || content.trim().length < 20) {
    errors.push('Content must be at least 20 characters long');
  }

  if (summary && summary.trim().length > 500) {
    errors.push('Summary must be less than 500 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  return next();
};

// Enhanced validation middleware for staff members
export const validateStaffMember = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    role,
    email,
    phone,
    category,
    subjects,
    bio,
    grade,
    qualifications,
    experience
  } = req.body;

  const errors: string[] = [];

  // Required fields
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!role || typeof role !== "string" || role.trim().length < 2) {
    errors.push("Role must be at least 2 characters");
  }

  // Optional: email validation
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    }
  }

  // Optional: phone validation (supports South African formats)
  if (phone) {
    // Allows +27..., 021..., or just digits up to 15
    const phoneRegex = /^(\+?\d{1,15}|0\d{8,10})$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      errors.push("Invalid phone number format");
    }
  }

  // Category validation
  const validStaffCategories = ["LEADERSHIP", "TEACHING", "SUPPORT"];
  if (category && !validStaffCategories.includes(category)) {
    errors.push("Invalid staff category. Must be one of: LEADERSHIP, TEACHING, SUPPORT");
  }

  // Subjects validation (JSON array)
  if (subjects) {
    try {
      const parsed = typeof subjects === "string" ? JSON.parse(subjects) : subjects;
      if (!Array.isArray(parsed)) {
        errors.push("Subjects must be an array");
      } else if (parsed.length > 0) {
        // Validate each subject is a string
        const invalidSubjects = parsed.filter(subject => typeof subject !== 'string' || subject.trim().length === 0);
        if (invalidSubjects.length > 0) {
          errors.push("All subjects must be non-empty strings");
        }
      }
    } catch {
      errors.push("Subjects must be valid JSON or an array");
    }
  }

  // Bio validation (optional but if provided, should be reasonable length)
  if (bio && bio.trim().length > 1000) {
    errors.push("Bio must be less than 1000 characters");
  }

  // Grade validation (optional)
  if (grade && typeof grade !== "string") {
    errors.push("Grade must be a string");
  }

  // Qualifications validation (optional)
  if (qualifications && qualifications.trim().length > 500) {
    errors.push("Qualifications must be less than 500 characters");
  }

  // Experience validation (optional)
  if (experience && experience.trim().length > 500) {
    errors.push("Experience must be less than 500 characters");
  }

  // Return errors if any
  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      errors 
    });
  }

  return next();
};

// Validation middleware for contact messages
export const validateContactMessage = (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, subject, message, inquiryType } = req.body;

  const errors: string[] = [];

  if (!firstName || firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters long');
  }

  if (!lastName || lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters long');
  }

  if (!email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  if (!subject || subject.trim().length < 5) {
    errors.push('Subject must be at least 5 characters long');
  }

  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  if (!inquiryType) {
    errors.push('Inquiry type is required');
  }

  const validInquiryTypes = [
    'general',
    'admission',
    'academic',
    'financial',
    'technical',
    'other'
  ];

  if (inquiryType && !validInquiryTypes.includes(inquiryType)) {
    errors.push('Invalid inquiry type');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  return next();
};

// Generic validation middleware for pagination
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;

  const errors: string[] = [];

  if (page) {
    const pageNum = parseInt(page as string);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push('Page must be a positive integer');
    }
  }

  if (limit) {
    const limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be between 1 and 100');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  return next();
};

// Validation middleware for search queries
export const validateSearchQuery = (req: Request, res: Response, next: NextFunction) => {
  const { search } = req.query;

  if (search && typeof search === 'string') {
    if (search.trim().length < 2) {
      return res.status(400).json({
        error: 'Search query must be at least 2 characters long'
      });
    }

    // Check for potentially harmful characters
    const harmfulPattern = /[<>{}()]/;
    if (harmfulPattern.test(search)) {
      return res.status(400).json({
        error: 'Search query contains invalid characters'
      });
    }
  }

  return next();
};

// Validation middleware for document uploads
export const validateDocumentUpload = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, category, isPublished } = req.body;

  const errors: string[] = [];

  // Required fields
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    errors.push("Title must be at least 3 characters");
  }

  if (!category || typeof category !== "string") {
    errors.push("Category is required");
  }

  // Category validation
  const validCategories = ["policy", "form", "report", "newsletter"];
  if (category && !validCategories.includes(category)) {
    errors.push("Invalid document category. Must be one of: policy, form, report, newsletter");
  }

  // Optional: description validation
  if (description && description.trim().length > 1000) {
    errors.push("Description must be less than 1000 characters");
  }

  // Optional: isPublished validation
  if (isPublished !== undefined && typeof isPublished !== "boolean") {
    errors.push("isPublished must be a boolean value");
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      errors 
    });
  }

  return next();
};

// Validation middleware for gallery images
export const validateGalleryImage = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, category, tags } = req.body;

  const errors: string[] = [];

  // Required fields
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    errors.push("Title must be at least 3 characters");
  }

  if (!category || typeof category !== "string") {
    errors.push("Category is required");
  }

  // Category validation
  const validCategories = ["Events", "Activities", "Facilities", "Students", "Staff", "Branding"];
  if (category && !validCategories.includes(category)) {
    errors.push("Invalid gallery category. Must be one of: Events, Activities, Facilities, Students, Staff, Branding");
  }

  // Optional: description validation
  if (description && description.trim().length > 1000) {
    errors.push("Description must be less than 1000 characters");
  }

  // Optional: tags validation
  if (tags) {
    try {
      const parsed = typeof tags === "string" ? JSON.parse(tags) : tags;
      if (!Array.isArray(parsed)) {
        errors.push("Tags must be an array");
      } else if (parsed.length > 0) {
        // Validate each tag is a string
        const invalidTags = parsed.filter(tag => typeof tag !== 'string' || tag.trim().length === 0);
        if (invalidTags.length > 0) {
          errors.push("All tags must be non-empty strings");
        }
      }
    } catch {
      errors.push("Tags must be valid JSON or an array");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      errors 
    });
  }

  return next();
};

// Validation middleware for newsletter
export const validateNewsletter = (req: Request, res: Response, next: NextFunction) => {
  const { title, content, summary, isPublished } = req.body;

  const errors: string[] = [];

  // Required fields
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    errors.push("Title must be at least 3 characters");
  }

  if (!content || typeof content !== "string" || content.trim().length < 20) {
    errors.push("Content must be at least 20 characters");
  }

  // Optional: summary validation
  if (summary && summary.trim().length > 500) {
    errors.push("Summary must be less than 500 characters");
  }

  // Optional: isPublished validation
  if (isPublished !== undefined && typeof isPublished !== "boolean") {
    errors.push("isPublished must be a boolean value");
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      errors 
    });
  }

  return next();
};

// Validation middleware for fee structure
export const validateFeeStructure = (req: Request, res: Response, next: NextFunction) => {
  const { grade, feeType, amount, currency, description, academicYear, dueDate } = req.body;

  const errors: string[] = [];

  // Required fields
  if (!grade || typeof grade !== "string" || grade.trim().length < 1) {
    errors.push("Grade is required");
  }

  if (!feeType || typeof feeType !== "string") {
    errors.push("Fee type is required");
  }

  if (!amount || typeof amount !== "number" || amount <= 0) {
    errors.push("Amount must be a positive number");
  }

  if (!academicYear || typeof academicYear !== "string" || academicYear.trim().length < 4) {
    errors.push("Academic year is required and must be at least 4 characters");
  }

  // Fee type validation
  const validFeeTypes = ["TUITION", "TRANSPORT", "MEALS", "UNIFORM", "ACTIVITIES", "OTHER"];
  if (feeType && !validFeeTypes.includes(feeType)) {
    errors.push("Invalid fee type. Must be one of: TUITION, TRANSPORT, MEALS, UNIFORM, ACTIVITIES, OTHER");
  }

  // Currency validation (optional, defaults to ZAR)
  if (currency && typeof currency !== "string" || currency?.length !== 3) {
    errors.push("Currency must be a 3-character code (e.g., ZAR, USD)");
  }

  // Optional: description validation
  if (description && description.trim().length > 500) {
    errors.push("Description must be less than 500 characters");
  }

  // Optional: due date validation
  if (dueDate) {
    const due = new Date(dueDate);
    if (isNaN(due.getTime())) {
      errors.push("Invalid due date format");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      errors 
    });
  }

  return next();
};

// Validation middleware for school information updates
export const validateSchoolInfo = (req: Request, res: Response, next: NextFunction) => {
  const { key, value, type, category, isPublic } = req.body;

  const errors: string[] = [];

  // Required fields
  if (!key || typeof key !== "string" || key.trim().length < 2) {
    errors.push("Key must be at least 2 characters");
  }

  if (!value || typeof value !== "string" || value.trim().length < 1) {
    errors.push("Value is required");
  }

  // Type validation
  const validTypes = ["text", "number", "boolean", "json", "html"];
  if (type && !validTypes.includes(type)) {
    errors.push("Invalid type. Must be one of: text, number, boolean, json, html");
  }

  // Optional: category validation
  if (category && typeof category !== "string") {
    errors.push("Category must be a string");
  }

  // Optional: isPublic validation
  if (isPublic !== undefined && typeof isPublic !== "boolean") {
    errors.push("isPublic must be a boolean value");
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      errors 
    });
  }

  return next();
};

// Generic validation middleware for file uploads
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded'
    });
  }

  const errors: string[] = [];

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }

  // Check file type based on upload category
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedDocumentTypes = ['application/pdf'];
  
  // This would need to be determined by the route or passed as a parameter
  // For now, we'll check for common file types
  const isImage = allowedImageTypes.includes(file.mimetype);
  const isDocument = allowedDocumentTypes.includes(file.mimetype);

  if (!isImage && !isDocument) {
    errors.push('Invalid file type. Only images (JPEG, PNG, WebP) and PDFs are allowed');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      errors 
    });
  }

  return next();
};
