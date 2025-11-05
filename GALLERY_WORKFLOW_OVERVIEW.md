# Gallery System - Complete Workflow Overview

## 🎯 System Architecture

### Backend (Node.js/Express/Prisma)
- **Database**: SQLite with Prisma ORM
- **File Storage**: `uploads/gallery/` directory
- **API Base**: `/api/gallery`
- **Authentication**: JWT-based with role-based access control (ADMIN, SUPER_ADMIN)

### Frontend (React/TypeScript/Material-UI)
- **Gallery Service**: Centralized API integration
- **Components**: Modular, reusable gallery components
- **State Management**: React hooks (useState, useEffect)
- **Routing**: React Router for navigation

---

## 📋 Complete Workflow

### 1. **Admin Upload Workflow**

#### Step 1: Access Gallery Management
- Navigate to `/admin/gallery` (Admin Dashboard → Gallery Management)
- Admin must be authenticated (JWT token required)

#### Step 2: Upload Images
**Option A: Single Image Upload**
1. Click "Upload Media" button
2. Fill in form:
   - **Title**: Name of the image/event
   - **Description**: Optional description
   - **Category**: EVENTS, SPORTS, ACADEMIC, CULTURAL, GENERAL, CLASS_PHOTOS
   - **Tags**: Comma-separated tags (e.g., "2025, athletics, awards")
   - **Album**: Select existing album or leave blank
   - **Published**: Toggle to publish immediately
3. Select file (JPG, PNG, GIF, MP4, MOV, AVI, WEBM - max 10MB)
4. Click "Upload"

**Option B: Bulk Upload (Future Enhancement)**
- Multiple file selection
- Batch metadata assignment
- Progress tracking

#### Step 3: Backend Processing
```
User Upload → Multer Validation → File Saved to uploads/gallery/
→ Database Entry Created → Response with Image URL
```

**Backend Flow:**
1. **Authentication Check**: `authMiddleware` verifies JWT token
2. **Role Check**: `requireRole(['ADMIN', 'SUPER_ADMIN'])` ensures admin access
3. **File Validation**: 
   - File type check (images/videos)
   - File size limit (10MB)
   - MIME type validation
4. **File Storage**: 
   - Unique filename: `file-{timestamp}-{random}.{ext}`
   - Saved to `uploads/gallery/`
5. **Database Entry**:
   - `GalleryItem` record created in SQLite
   - Type determined (IMAGE/VIDEO)
   - Metadata stored (title, description, category, tags)
   - Album association (if provided)
6. **Response**: Returns created item with full URL

#### Step 4: Image Availability
- Image immediately available at: `/uploads/gallery/{filename}`
- Frontend displays using: `GalleryService.getItemImageUrl(fileName)`
- Full URL: `{API_URL}/uploads/gallery/{fileName}`

---

### 2. **Album Management Workflow**

#### Creating an Album
1. Navigate to Gallery Management
2. Create Album:
   - **Title**: Album name (e.g., "Grade 1 Class Photos 2025")
   - **Description**: Optional description
   - **Album Type**: 
     - `GENERAL`: Events, occasions, general photos
     - `CLASS`: Class photos (Grade R - Grade 7)
   - **Class Grade**: Required if `CLASS` type (e.g., "Grade 1")
   - **Cover Image**: Select uploaded image as cover
   - **Published**: Toggle visibility

#### Adding Images to Album
1. Upload image with `albumId` parameter
2. OR update existing image to assign to album
3. Album automatically shows image count

#### Setting Cover Image
1. Upload or select image
2. When creating/editing album, select image as `coverImageId`
3. Cover image displays on album card

---

### 3. **Public Gallery Display Workflow**

#### Page Load
1. User navigates to `/gallery`
2. Hero section displays with stats:
   - Total Albums count
   - Total Photos count
   - Events count
   - Class Photos count

#### Tab Navigation
**Tab 1: Events & Occasions**
- Fetches albums with `albumType: 'GENERAL'`
- Displays album cards with cover images
- Click card → Navigate to `/gallery/album/{id}`

**Tab 2: Class Photos**
- Fetches albums with `albumType: 'CLASS'`
- Groups by grade (Grade R - Grade 7)
- Displays with 2025 class photos as covers
- Click card → Navigate to album detail

**Tab 3: All Gallery**
- Fetches all published gallery items
- Displays in responsive grid
- Click image → Opens lightbox for full-screen viewing

---

### 4. **Image Display & Lightbox Workflow**

#### Image Grid
- Responsive grid layout (1-4 columns based on screen size)
- Images load via `GalleryService.getItemImageUrl(fileName)`
- Hover effects and transitions
- Click to open lightbox

#### Lightbox Features
- Full-screen image viewing
- Navigation arrows (previous/next)
- Download button
- Image metadata (title, description, category, tags)
- Image counter (e.g., "3 of 15")
- Keyboard navigation (arrow keys, ESC)

---

### 5. **Backend API Endpoints**

#### Public Endpoints (No Auth Required)
```
GET /api/gallery
  - Query params: category, type, albumId, page, limit, isPublished
  - Returns: Paginated gallery items

GET /api/gallery/:id
  - Returns: Single gallery item
  - Checks published status for public access

GET /api/gallery/albums
  - Query params: albumType, classGrade, isPublished
  - Returns: List of albums

GET /api/gallery/albums/:id
  - Returns: Single album with items
```

#### Protected Endpoints (Admin Only)
```
POST /api/gallery/upload
  - Body: FormData (file, title, description, category, tags, albumId, isPublished)
  - Returns: Created gallery item

PUT /api/gallery/:id
  - Body: { title, description, category, tags, albumId, isPublished }
  - Returns: Updated gallery item

DELETE /api/gallery/:id
  - Deletes file from filesystem and database record
  - Returns: Success message

POST /api/gallery/albums
  - Body: { title, description, albumType, classGrade, coverImageId, isPublished }
  - Returns: Created album

PUT /api/gallery/albums/:id
  - Body: Album update data
  - Returns: Updated album

DELETE /api/gallery/albums/:id
  - Deletes album (cascade to items handled by Prisma)
  - Returns: Success message

GET /api/gallery/stats/overview
  - Returns: Gallery statistics (admin only)
```

---

### 6. **Data Flow Diagram**

```
┌─────────────┐
│   Admin     │
│  Interface  │
└──────┬──────┘
       │
       │ Upload Image
       ▼
┌─────────────────┐
│  GalleryService │ (Frontend)
│  (API Client)   │
└──────┬──────────┘
       │
       │ POST /api/gallery/upload
       │ (with JWT token)
       ▼
┌─────────────────┐
│  Backend Routes │
│  /api/gallery   │
└──────┬──────────┘
       │
       │ 1. Auth Check
       │ 2. File Validation
       │ 3. Save File
       ▼
┌─────────────────┐
│  uploads/       │
│  gallery/       │ (File System)
└──────┬──────────┘
       │
       │ 4. Create DB Record
       ▼
┌─────────────────┐
│   Prisma DB     │
│  (SQLite)       │
└─────────────────┘
       │
       │ 5. Return Image URL
       ▼
┌─────────────────┐
│  Public Gallery │
│  (Frontend)     │
└─────────────────┘
       │
       │ Display Image
       ▼
┌─────────────────┐
│  /uploads/      │
│  gallery/       │ (Static File Serving)
└─────────────────┘
```

---

### 7. **File Structure**

```
backend/
├── src/
│   ├── routes/
│   │   └── gallery.ts          # API routes
│   ├── services/
│   │   └── galleryService.ts   # Business logic
│   ├── middleware/
│   │   ├── auth.ts             # Authentication
│   │   └── galleryValidation.ts # Input validation
│   └── uploads/
│       └── gallery/             # Uploaded images
│
frontend/
├── src/
│   ├── pages/
│   │   ├── Gallery.tsx          # Main gallery page
│   │   └── GalleryManagement.tsx # Admin interface
│   ├── components/
│   │   └── gallery/
│   │       ├── AlbumCard.tsx    # Album display card
│   │       ├── ClassPhotosSection.tsx # Class photos section
│   │       ├── ImageGrid.tsx    # Image grid layout
│   │       └── ImageLightbox.tsx # Full-screen viewer
│   └── services/
│       └── galleryService.ts    # API integration
```

---

### 8. **Security & Validation**

#### Backend Security
- ✅ **Authentication**: JWT token required for uploads
- ✅ **Authorization**: Role-based (ADMIN, SUPER_ADMIN)
- ✅ **File Validation**: Type and size checks
- ✅ **Input Validation**: Zod schemas for all inputs
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **File Cleanup**: Automatic deletion on upload errors

#### Frontend Security
- ✅ **Token Management**: Stored in localStorage
- ✅ **API Error Handling**: User-friendly error messages
- ✅ **Image URL Validation**: Secure URL generation
- ✅ **Loading States**: User feedback during operations

---

### 9. **Best Practices for Admin**

#### Organizing Images
1. **Use Descriptive Titles**: "Grade 1 Class Photo 2025" not "IMG_001"
2. **Add Categories**: Helps filtering and organization
3. **Use Tags**: Searchable metadata (e.g., "2025", "athletics", "awards")
4. **Create Albums First**: Then upload images to albums
5. **Set Cover Images**: Makes albums visually appealing

#### Class Photos Workflow
1. Create album: Type = CLASS, Grade = "Grade 1"
2. Upload class photo: Assign to album
3. Set as cover: Edit album → Select cover image
4. Upload additional photos: Add to same album

#### Event Albums Workflow
1. Create album: Type = GENERAL, Title = "Athletics Awards 2025"
2. Upload event photos: Assign to album
3. Add tags: "2025", "athletics", "awards"
4. Publish: Make visible to public

---

### 10. **Frontend-Backend Alignment**

#### Image URL Generation
- **Backend**: Files stored at `uploads/gallery/{filename}`
- **Backend Route**: `/uploads` serves static files
- **Frontend Service**: `getItemImageUrl()` generates full URL
- **Result**: `{API_URL}/uploads/gallery/{fileName}`

#### Response Format
All backend responses follow consistent format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

#### Error Handling
- **Backend**: Returns `{ success: false, error: "...", message: "..." }`
- **Frontend**: Catches errors, displays user-friendly messages
- **Validation**: Client-side + server-side validation

---

### 11. **Performance Optimizations**

#### Image Loading
- Lazy loading for image grids
- Progressive image loading
- Thumbnail generation (future enhancement)

#### Caching
- Browser caching for static images
- API response caching (future enhancement)
- CDN integration ready (future enhancement)

---

### 12. **Troubleshooting**

#### Images Not Displaying
1. Check file exists in `uploads/gallery/`
2. Verify API URL in environment variables
3. Check CORS settings
4. Verify file permissions

#### Upload Failures
1. Check file size (max 10MB)
2. Verify file type (images/videos only)
3. Check authentication token
4. Review server logs

#### Album Not Showing
1. Verify `isPublished: true`
2. Check album type matches filter
3. Ensure album has items
4. Verify cover image is set

---

## 🎨 Design Consistency

The Gallery page follows the same design pattern as other pages:
- **Hero Section**: Gradient overlay, centered text, stats display
- **Return to Home**: Fixed position, styled consistently
- **Section Headers**: Gold accent line, centered text
- **Cards**: Hover effects, consistent spacing
- **Colors**: Navy (#1a237e), Gold (#ffd700), Red (#d32f2f)
- **Typography**: Consistent font weights and sizes
- **Spacing**: Consistent padding and margins

---

## 📊 Summary

The Gallery system is:
- ✅ **Secure**: Protected routes, validation, error handling
- ✅ **Scalable**: Modular components, efficient queries
- ✅ **User-Friendly**: Intuitive admin interface, beautiful public display
- ✅ **Consistent**: Matches site design patterns
- ✅ **Robust**: Comprehensive error handling, validation
- ✅ **Documented**: Clear workflow and API documentation


