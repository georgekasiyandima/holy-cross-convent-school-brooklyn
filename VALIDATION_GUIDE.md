# Validation Guide - Holy Cross School Management System

## Overview

This guide documents the comprehensive validation system implemented for the Holy Cross School Management System. The validation middleware ensures data integrity, security, and user experience across all API endpoints.

## Validation Middleware Functions

### 1. Staff Member Validation (`validateStaffMember`)

**Purpose**: Validates staff member data for creation and updates.

**Required Fields**:
- `name`: String, minimum 2 characters
- `role`: String, minimum 2 characters

**Optional Fields**:
- `email`: Valid email format
- `phone`: South African phone number format (+27..., 021..., or digits)
- `category`: Must be one of LEADERSHIP, TEACHING, SUPPORT
- `subjects`: JSON array of strings
- `bio`: Maximum 1000 characters
- `grade`: String
- `qualifications`: Maximum 500 characters
- `experience`: Maximum 500 characters

**Usage**:
```typescript
router.post('/', requireEditor, validateStaffMember, upload.single('image'), async (req, res, next) => {
  // Staff creation logic
});
```

### 2. Document Upload Validation (`validateDocumentUpload`)

**Purpose**: Validates document uploads (policies, forms, reports, newsletters).

**Required Fields**:
- `title`: String, minimum 3 characters
- `category`: Must be one of policy, form, report, newsletter

**Optional Fields**:
- `description`: Maximum 1000 characters
- `isPublished`: Boolean

**Usage**:
```typescript
router.post('/upload', authMiddleware, validateDocumentUpload, upload.single('document'), async (req, res, next) => {
  // Document upload logic
});
```

### 3. Gallery Image Validation (`validateGalleryImage`)

**Purpose**: Validates gallery image uploads.

**Required Fields**:
- `title`: String, minimum 3 characters
- `category`: Must be one of Events, Activities, Facilities, Students, Staff, Branding

**Optional Fields**:
- `description`: Maximum 1000 characters
- `tags`: JSON array of strings

**Usage**:
```typescript
router.post('/gallery/upload', authMiddleware, validateGalleryImage, upload.single('image'), async (req, res, next) => {
  // Gallery upload logic
});
```

### 4. Newsletter Validation (`validateNewsletter`)

**Purpose**: Validates newsletter content.

**Required Fields**:
- `title`: String, minimum 3 characters
- `content`: String, minimum 20 characters

**Optional Fields**:
- `summary`: Maximum 500 characters
- `isPublished`: Boolean

### 5. Fee Structure Validation (`validateFeeStructure`)

**Purpose**: Validates fee structure entries.

**Required Fields**:
- `grade`: String, minimum 1 character
- `feeType`: Must be one of TUITION, TRANSPORT, MEALS, UNIFORM, ACTIVITIES, OTHER
- `amount`: Positive number
- `academicYear`: String, minimum 4 characters

**Optional Fields**:
- `currency`: 3-character code (e.g., ZAR, USD)
- `description`: Maximum 500 characters
- `dueDate`: Valid date format

### 6. School Information Validation (`validateSchoolInfo`)

**Purpose**: Validates school information updates.

**Required Fields**:
- `key`: String, minimum 2 characters
- `value`: String, minimum 1 character

**Optional Fields**:
- `type`: Must be one of text, number, boolean, json, html
- `category`: String
- `isPublic`: Boolean

### 7. File Upload Validation (`validateFileUpload`)

**Purpose**: Generic file upload validation.

**Validations**:
- File size: Maximum 10MB
- File types: Images (JPEG, PNG, WebP) and PDFs only

### 8. Contact Message Validation (`validateContactMessage`)

**Purpose**: Validates contact form submissions.

**Required Fields**:
- `firstName`: String, minimum 2 characters
- `lastName`: String, minimum 2 characters
- `email`: Valid email format
- `subject`: String, minimum 5 characters
- `message`: String, minimum 10 characters
- `inquiryType`: Must be one of general, admission, academic, financial, technical, other

### 9. Event Validation (`validateEvent`)

**Purpose**: Validates event data.

**Required Fields**:
- `title`: String, minimum 3 characters
- `description`: String, minimum 10 characters
- `startDate`: Valid date format
- `category`: Must be one of ACADEMIC, SPIRITUAL, CELEBRATION, SPORTS, CULTURAL, COMMUNITY, EXTRA_MURAL, HOLIDAY

**Optional Fields**:
- `endDate`: Valid date format, must be after startDate

### 10. News Article Validation (`validateNewsArticle`)

**Purpose**: Validates news article content.

**Required Fields**:
- `title`: String, minimum 3 characters
- `content`: String, minimum 20 characters

**Optional Fields**:
- `summary`: Maximum 500 characters

### 11. Policy Validation (`validatePolicy`)

**Purpose**: Validates policy document data.

**Required Fields**:
- `title`: String, minimum 3 characters
- `content`: String, minimum 10 characters
- `category`: Must be one of ACADEMIC, DISCIPLINARY, SAFETY, FINANCIAL, ADMINISTRATIVE, TECHNOLOGY, HEALTH, OTHER

### 12. Pagination Validation (`validatePagination`)

**Purpose**: Validates pagination parameters.

**Optional Fields**:
- `page`: Positive integer
- `limit`: Integer between 1 and 100

### 13. Search Query Validation (`validateSearchQuery`)

**Purpose**: Validates search queries for security.

**Validations**:
- Minimum 2 characters
- No harmful characters (<, >, {, }, (, ))

## Error Response Format

All validation errors return a consistent format:

```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    "Name must be at least 2 characters",
    "Invalid email format"
  ]
}
```

## Implementation Examples

### Basic Route with Validation

```typescript
import { validateStaffMember } from '../middleware/validation';

router.post('/staff', requireEditor, validateStaffMember, async (req, res, next) => {
  try {
    // Validation passed, proceed with business logic
    const staff = await createStaff(req.body);
    res.status(201).json({ success: true, data: { staff } });
  } catch (error) {
    next(error);
  }
});
```

### File Upload with Validation

```typescript
import { validateFileUpload, validateGalleryImage } from '../middleware/validation';
import { upload } from '../middleware/upload';

router.post('/gallery/upload', 
  authMiddleware, 
  validateGalleryImage, 
  upload.single('image'), 
  validateFileUpload,
  async (req, res, next) => {
    // File and data validation passed
    const image = await processImage(req.file, req.body);
    res.status(201).json({ success: true, data: { image } });
  }
);
```

## Security Features

### 1. Input Sanitization
- All string inputs are trimmed
- Type checking for all fields
- Length limits to prevent DoS attacks

### 2. File Upload Security
- File type restrictions
- File size limits
- MIME type validation

### 3. SQL Injection Prevention
- Parameterized queries through Prisma
- Input validation before database operations

### 4. XSS Prevention
- Harmful character detection in search queries
- HTML content validation

## Best Practices

### 1. Consistent Error Messages
- Use clear, user-friendly error messages
- Provide specific guidance on how to fix errors
- Maintain consistent error response format

### 2. Validation Order
- Validate authentication first
- Validate authorization second
- Validate data third
- Process business logic last

### 3. Performance Considerations
- Use early returns for validation failures
- Avoid expensive operations in validation middleware
- Cache validation results where appropriate

### 4. Testing
- Test all validation scenarios
- Test edge cases and boundary conditions
- Test with invalid data types
- Test with missing required fields

## Common Validation Patterns

### Email Validation
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (email && !emailRegex.test(email)) {
  errors.push("Invalid email format");
}
```

### Phone Number Validation (South African)
```typescript
const phoneRegex = /^(\+?\d{1,15}|0\d{8,10})$/;
if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
  errors.push("Invalid phone number format");
}
```

### Date Validation
```typescript
const date = new Date(dateString);
if (isNaN(date.getTime())) {
  errors.push("Invalid date format");
}
```

### Array Validation
```typescript
try {
  const parsed = typeof arrayField === "string" ? JSON.parse(arrayField) : arrayField;
  if (!Array.isArray(parsed)) {
    errors.push("Field must be an array");
  }
} catch {
  errors.push("Field must be valid JSON or an array");
}
```

## Monitoring and Logging

### Validation Metrics
- Track validation failure rates
- Monitor common validation errors
- Alert on unusual validation patterns

### Error Logging
- Log all validation failures
- Include request context in logs
- Monitor for potential security threats

## Future Enhancements

### 1. Custom Validation Rules
- School-specific validation rules
- Dynamic validation based on user roles
- Context-aware validation

### 2. Internationalization
- Localized error messages
- Multi-language support
- Regional validation rules

### 3. Advanced Security
- Rate limiting on validation endpoints
- CAPTCHA integration for sensitive operations
- Advanced threat detection

## Conclusion

The validation system provides comprehensive data integrity and security for the Holy Cross School Management System. By following the patterns and practices outlined in this guide, developers can ensure robust, secure, and user-friendly API endpoints.

For questions or contributions to the validation system, please refer to the main project documentation or contact the development team.

