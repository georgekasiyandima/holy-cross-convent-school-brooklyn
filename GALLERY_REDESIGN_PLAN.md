# Gallery System Redesign Plan

## Overview
Building a comprehensive, scalable gallery system that groups images by events/occasions and includes class photos albums (Grade R - Grade 7) with 2025 covers.

## Architecture

### Backend Structure
```
backend/src/
├── routes/gallery.ts (Enhanced with validation, error handling)
├── services/galleryService.ts (Business logic)
├── middleware/
│   ├── upload.ts (File upload handling)
│   ├── validation.ts (Request validation)
│   └── auth.ts (Route protection)
```

### Frontend Structure
```
frontend/src/
├── pages/
│   ├── Gallery.tsx (Main public gallery page)
│   └── GalleryManagement.tsx (Admin management)
├── components/gallery/
│   ├── AlbumCard.tsx (Album display card)
│   ├── AlbumGrid.tsx (Grid of albums)
│   ├── ImageGrid.tsx (Grid of images)
│   ├── ImageLightbox.tsx (Full-screen image viewer)
│   ├── ClassPhotosSection.tsx (Grade R - Grade 7 section)
│   ├── EventsSection.tsx (Events/Occasions grouping)
│   └── GalleryFilters.tsx (Filter/search component)
├── services/
│   └── galleryService.ts (API integration)
```

## Features

### 1. Public Gallery Page
- **Hero Section**: Banner with gallery title
- **Navigation Tabs**:
  - Events & Occasions
  - Class Photos (Grade R - Grade 7)
  - All Gallery
- **Event/Occasion Grouping**: Cards grouped by event type
- **Class Photos Section**: 
  - Grade R - Grade 7 albums
  - 2025 class photos as cover images
  - Click to view album
- **Image Lightbox**: Full-screen viewing with navigation
- **Filters**: Search, category, date range

### 2. Admin Gallery Management
- **Bulk Upload**: Multiple images at once
- **Album Management**: Create, edit, delete albums
- **Drag & Drop**: Reorder images in albums
- **Set Cover Image**: Select cover for class photos
- **Quick Actions**: Publish/unpublish, delete, move
- **Category Management**: Assign categories/tags

### 3. Backend Enhancements
- **Input Validation**: Zod schemas for all routes
- **Error Handling**: Comprehensive error responses
- **Security**: Protected routes, file type validation
- **Image Optimization**: Thumbnail generation
- **Pagination**: Efficient data loading

## Database Schema (Current)
- `Album`: id, title, description, albumType (GENERAL/CLASS), classGrade, coverImageId, isPublished
- `GalleryItem`: id, title, description, category, type, filePath, fileName, albumId, isPublished

## Implementation Steps
1. ✅ Review current backend routes
2. ⏳ Enhance backend with validation & error handling
3. ⏳ Create gallery service on frontend
4. ⏳ Build modular gallery components
5. ⏳ Implement public Gallery page with tabs
6. ⏳ Add Class Photos section
7. ⏳ Add Events/Occasions section
8. ⏳ Implement Image Lightbox
9. ⏳ Enhance admin Gallery Management UI
10. ⏳ Add image optimization & thumbnails


