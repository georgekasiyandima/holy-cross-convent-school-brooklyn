# Staff API Guide - Holy Cross School Management System

## Overview

This guide documents the enhanced Staff API routes for the Holy Cross School Management System. The API provides comprehensive staff management functionality with image uploads, validation, and category-based organization.

## API Endpoints

### Base URL: `http://localhost:5000/api/staff`

## 📋 Public Routes

### 1. Get All Staff Members
**GET** `/api/staff`

Retrieves all active staff members with optional filtering.

**Query Parameters:**
- `grade` (optional): Filter by grade level
- `category` (optional): Filter by staff category

**Response:**
```json
{
  "success": true,
  "data": {
    "staff": [
      {
        "id": "staff_id",
        "name": "John Smith",
        "role": "Principal",
        "email": "john@school.edu",
        "phone": "+27123456789",
        "bio": "Experienced educator...",
        "grade": "Grade 7",
        "imageUrl": "/uploads/staff/john-smith-1234567890.jpg",
        "category": "LEADERSHIP",
        "subjects": "[\"Mathematics\", \"Science\"]",
        "qualifications": "M.Ed, B.Ed",
        "experience": "15 years",
        "order": 1,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "groupedStaff": {
      "leadership": [...],
      "teaching": [...],
      "support": [...]
    }
  }
}
```

### 2. Get Single Staff Member
**GET** `/api/staff/:id`

Retrieves a specific staff member by ID.

**Parameters:**
- `id`: Staff member ID

**Response:**
```json
{
  "success": true,
  "data": {
    "staff": {
      "id": "staff_id",
      "name": "John Smith",
      "role": "Principal",
      // ... other staff fields
    }
  }
}
```

### 3. Get Staff by Category
**GET** `/api/staff/category/:category`

Retrieves staff members by specific category.

**Parameters:**
- `category`: LEADERSHIP, TEACHING, or SUPPORT

**Response:**
```json
{
  "success": true,
  "data": {
    "staff": [...]
  }
}
```

### 4. Get Staff Categories
**GET** `/api/staff/categories`

Retrieves all staff members grouped by category.

**Response:**
```json
{
  "success": true,
  "data": {
    "groupedStaff": {
      "leadership": [...],
      "teaching": [...],
      "support": [...]
    }
  }
}
```

## 🔐 Protected Routes (Admin/Editor Only)

### 5. Create Staff Member
**POST** `/api/staff`

Creates a new staff member with optional photo upload.

**Middleware:** `requireEditor`, `validateStaffMember`, `uploadImage`

**Request Body:**
```json
{
  "name": "John Smith",
  "role": "Principal",
  "email": "john@school.edu",
  "phone": "+27123456789",
  "bio": "Experienced educator with 15 years of experience...",
  "grade": "Grade 7",
  "order": 1,
  "category": "LEADERSHIP",
  "subjects": "[\"Mathematics\", \"Science\"]",
  "qualifications": "M.Ed, B.Ed",
  "experience": "15 years"
}
```

**File Upload:**
- `image`: Staff photo (JPEG, PNG, WebP, max 10MB)

**Response:**
```json
{
  "success": true,
  "message": "Staff member created successfully",
  "data": {
    "staff": {
      "id": "new_staff_id",
      "name": "John Smith",
      "role": "Principal",
      "imageUrl": "/uploads/staff/john-smith-1234567890.jpg",
      // ... other fields
    }
  }
}
```

### 6. Update Staff Member
**PUT** `/api/staff/:id`

Updates an existing staff member with optional photo upload.

**Middleware:** `requireEditor`, `uploadImage`, `validateStaffMember`

**Parameters:**
- `id`: Staff member ID

**Request Body:** (Same as create, all fields optional)

**Response:**
```json
{
  "success": true,
  "message": "Staff member updated successfully",
  "data": {
    "staff": {
      "id": "staff_id",
      "name": "John Smith",
      "role": "Principal",
      // ... updated fields
    }
  }
}
```

### 7. Delete Staff Member
**DELETE** `/api/staff/:id`

Soft deletes a staff member by setting `isActive` to false.

**Middleware:** `requireEditor`

**Parameters:**
- `id`: Staff member ID

**Response:**
```json
{
  "success": true,
  "message": "Staff member deactivated successfully"
}
```

### 8. Toggle Staff Status
**PATCH** `/api/staff/:id/status`

Toggles the active status of a staff member.

**Middleware:** `requireEditor`

**Request Body:**
```json
{
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Staff member activated successfully",
  "data": {
    "staff": {
      "id": "staff_id",
      "isActive": true,
      // ... other fields
    }
  }
}
```

### 9. Update Staff Order
**PATCH** `/api/staff/:id/order`

Updates the display order of a staff member.

**Middleware:** `requireEditor`

**Request Body:**
```json
{
  "order": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Staff member order updated successfully",
  "data": {
    "staff": {
      "id": "staff_id",
      "order": 5,
      // ... other fields
    }
  }
}
```

## 🛠️ Technical Implementation

### Image Processing

The API includes sophisticated image processing capabilities:

1. **File Validation**: Only JPEG, PNG, and WebP images are accepted
2. **Size Limits**: Maximum 10MB per image
3. **Optimization**: Images are resized to 1200x1200px with quality optimization
4. **Storage**: Images are stored in `/uploads/staff/` directory
5. **Naming**: Files are named using staff name and timestamp

### Validation

All staff data is validated using the `validateStaffMember` middleware:

- **Required Fields**: name, role
- **Optional Fields**: email, phone, bio, grade, category, subjects, qualifications, experience
- **Email Validation**: RFC-compliant email format
- **Phone Validation**: South African phone number formats
- **Category Validation**: LEADERSHIP, TEACHING, SUPPORT
- **Subjects Validation**: JSON array of strings

### Error Handling

The API provides comprehensive error handling:

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

### Security Features

1. **Authentication**: All write operations require editor permissions
2. **Input Sanitization**: All inputs are validated and sanitized
3. **File Security**: File type and size validation
4. **SQL Injection Prevention**: Parameterized queries through Prisma

## 📊 Data Models

### Staff Member Schema

```typescript
interface StaffMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  bio?: string;
  imageUrl?: string;
  grade?: string;
  subjects?: string; // JSON string of array
  qualifications?: string;
  experience?: string;
  category: 'LEADERSHIP' | 'TEACHING' | 'SUPPORT';
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Staff Categories

- **LEADERSHIP**: School administration and leadership
- **TEACHING**: Teaching staff and educators
- **SUPPORT**: Support staff and assistants

## 🚀 Usage Examples

### Create Staff Member with Photo

```bash
curl -X POST http://localhost:5000/api/staff \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=John Smith" \
  -F "role=Principal" \
  -F "email=john@school.edu" \
  -F "category=LEADERSHIP" \
  -F "image=@staff-photo.jpg"
```

### Update Staff Member

```bash
curl -X PUT http://localhost:5000/api/staff/staff_id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "role": "Principal",
    "bio": "Updated bio information"
  }'
```

### Get Staff by Category

```bash
curl -X GET http://localhost:5000/api/staff/category/LEADERSHIP
```

## 🔧 Development Notes

### Prerequisites

1. **Sharp Package**: Install for image optimization
   ```bash
   npm install sharp
   ```

2. **Database Migration**: Run Prisma migration for category field
   ```bash
   npx prisma migrate dev --name add_staff_category
   ```

### Environment Variables

```env
BASE_URL=http://localhost:5000
UPLOAD_DIR=./uploads
```

### File Structure

```
uploads/
├── staff/
│   ├── john-smith-1234567890.jpg
│   ├── jane-doe-1234567891.jpg
│   └── ...
└── temp/
    └── (temporary files)
```

## 🎯 Best Practices

### 1. Image Optimization
- Use high-quality source images
- Maintain aspect ratios
- Consider WebP format for better compression

### 2. Data Management
- Use consistent naming conventions
- Maintain proper order values
- Regular cleanup of inactive staff

### 3. Security
- Always validate file uploads
- Use HTTPS in production
- Implement rate limiting

### 4. Performance
- Implement caching for staff listings
- Use CDN for image delivery
- Optimize database queries

## 🐛 Troubleshooting

### Common Issues

1. **Sharp Not Found**: Install Sharp package
2. **Category Field Missing**: Run Prisma migration
3. **Image Upload Fails**: Check file permissions and disk space
4. **Validation Errors**: Review input data format

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=staff:*
```

## 📈 Monitoring

### Metrics to Track

- Staff creation/update rates
- Image upload success rates
- API response times
- Error rates by endpoint

### Logging

All operations are logged with:
- Timestamp
- User ID
- Operation type
- Success/failure status

## 🔮 Future Enhancements

### Planned Features

1. **Bulk Operations**: Import/export staff data
2. **Advanced Search**: Full-text search capabilities
3. **Image Optimization**: Automatic WebP conversion
4. **Analytics**: Staff page view tracking
5. **Notifications**: Staff update notifications

### API Versioning

Future API versions will maintain backward compatibility while adding new features.

## 📞 Support

For technical support or questions about the Staff API:

1. Check the validation guide for input requirements
2. Review error messages for specific issues
3. Consult the main project documentation
4. Contact the development team

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Holy Cross School Development Team

