# Gallery Management System - Complete Workflow Guide

## Overview
The Gallery Management System allows administrators to organize and display school photos and videos in albums. Photos can be grouped by events, occasions, sports, academic activities, cultural events, and class photos.

---

## System Architecture

### **Components:**
1. **Backend** (`backend/src/routes/gallery.ts`)
   - Handles file uploads, album creation, and item management
   - Stores data in database (Prisma)
   - Manages file storage on server

2. **Frontend Admin** (`frontend/src/pages/GalleryManagement.tsx`)
   - Admin interface for uploading and managing gallery items
   - Album creation and management
   - Category and tagging system

3. **Frontend Public** (`frontend/src/pages/Gallery.tsx`)
   - Public-facing gallery page
   - Three tabs: Events & Occasions, Class Photos, All Gallery
   - Album browsing and image viewing

---

## Step-by-Step: Adding Photos to Gallery

### **Step 1: Access Gallery Management**
1. Log in to the Admin Dashboard
2. Navigate to **Gallery Management** from the admin menu
3. You'll see the gallery management interface with:
   - Search and filter options
   - Upload Media button
   - Grid of existing gallery items

### **Step 2: Create an Album (Optional but Recommended)**
**Why create an album?** Albums help organize photos by event/occasion. Photos must be assigned to an album to appear in the public gallery under that album.

**How to create an album:**
1. Click **"Upload Media"** button
2. In the upload dialog, you'll see album management options:
   - **Album Type**: Choose between:
     - **General**: For events, sports, academic, cultural activities
     - **Class**: For class photos (Grade R - Grade 7)
   - **Class/Grade**: If you selected "Class", enter the grade (e.g., "Grade 1")
   - **Album dropdown**: Shows existing albums
   - **"New Album" button**: Click to create a new album

3. Click **"New Album"** button
4. A prompt will appear asking for the album name
5. Enter a descriptive name (e.g., "Sports Day 2025", "Grade 1 Class Photo 2025")
6. Click OK
7. The album is created and automatically selected in the dropdown

**Important Notes:**
- Album names must be unique per album type
- If you try to create a duplicate album name, you'll get an error message
- Albums are automatically published (visible to public)

### **Step 3: Upload Photos**
1. **Select File:**
   - Click **"Upload Media"** button
   - In the upload dialog, either:
     - Drag and drop a file into the upload area, OR
     - Click the upload area to browse and select a file
   - Supported formats: Images (JPEG, PNG, GIF, WebP) and Videos (MP4, MOV, AVI, WebM)
   - Maximum file size: 10MB

2. **Fill in Details:**
   - **Title**: Auto-filled from filename, but you can edit it
   - **Description**: Optional description of the photo
   - **Category**: Select one:
     - **Events**: School events, celebrations
     - **Sports**: Sports activities, matches, awards
     - **Academic**: Academic achievements, competitions
     - **Cultural**: Cultural activities, performances
     - **General**: Other photos
   - **Album**: Select the album you want to add this photo to
     - The dropdown shows albums filtered by the selected category
     - If no album is selected, the photo won't appear in any album (but will appear in "All Gallery" tab)
   - **Tags**: Optional comma-separated tags (e.g., "sports, awards, 2025")
   - **Post to Social Media**: Check if you want to automatically post to social media (currently disabled)

3. **Upload:**
   - Click the **"Upload"** button
   - Wait for the upload to complete
   - You'll see a success message
   - The photo appears in the gallery management grid

### **Step 4: Verify Upload**
1. The uploaded photo should appear in the gallery management grid
2. Check that it shows the correct:
   - Category badge
   - Title
   - Album association (if assigned)

---

## How Photos Appear on the Public Gallery

### **Events & Occasions Tab:**
- Shows all **General** type albums that are published
- Albums are displayed as cards with:
  - Cover image (first image in album or designated cover image)
  - Album title
  - Number of photos in the album
- Clicking an album shows all photos in that album

### **Class Photos Tab:**
- Shows all **Class** type albums, grouped by grade
- Albums are organized by:
  - Grade R
  - Grade 1
  - Grade 2
  - ... up to Grade 7
- Each album shows class photos for that grade

### **All Gallery Tab:**
- Shows ALL published photos regardless of album
- Displays as a grid of individual photos
- Useful for browsing everything at once

---

## Understanding Albums vs Categories

### **Albums:**
- Albums are **containers** that group related photos together
- Photos must be **assigned to an album** during upload
- Albums have a name, type (General/Class), and optional description
- Albums appear as cards on the public gallery page

### **Categories:**
- Categories are **tags** that describe what the photo is about
- Categories help organize and filter photos
- Categories include: Events, Sports, Academic, Cultural, General
- When you select a category during upload, the album dropdown shows albums that contain photos with that category

### **Relationship:**
- A photo has BOTH a category AND can be in an album
- Example: A photo of "Sports Day" might have:
  - Category: **Sports**
  - Album: **"Sports Day 2025"**
- The album dropdown filters to show relevant albums when you select a category

---

## Common Workflows

### **Workflow 1: Adding Sports Event Photos**
1. Create album: "Sports Day 2025" (Album Type: General)
2. Upload photos:
   - Select file
   - Category: **Sports**
   - Album: **"Sports Day 2025"**
   - Title: "Sports Day - Opening Ceremony"
   - Upload
3. Repeat for all photos, assigning them to the same album
4. Result: All photos appear in the "Sports Day 2025" album on the public gallery

### **Workflow 2: Adding Class Photos**
1. Create album: "Grade 1 Class Photo 2025" (Album Type: Class, Class/Grade: Grade 1)
2. Upload photos:
   - Select file
   - Category: **General** (or any category)
   - Album: **"Grade 1 Class Photo 2025"**
   - Title: "Grade 1 - Front Row"
   - Upload
3. Result: Photos appear in the "Class Photos" tab under "Grade 1"

### **Workflow 3: Adding Individual Photos (No Album)**
1. Upload photo:
   - Select file
   - Category: **Academic**
   - Album: Leave as "No album"
   - Upload
2. Result: Photo appears in "All Gallery" tab but not in any album

---

## Troubleshooting

### **Photo not showing in album:**
- **Check:** Did you select an album during upload?
- **Solution:** Edit the photo and assign it to an album, or re-upload with an album selected

### **Duplicate album error:**
- **Cause:** An album with the same name already exists for that album type
- **Solution:** Use a different name (e.g., "Sports Day 2025" vs "Sports Day 2026")

### **Album not appearing in dropdown:**
- **Check:** Is the album type (General/Class) matching?
- **Check:** Does the album have photos with the selected category?
- **Solution:** Albums are filtered by category - if you select "Sports" category, only albums with Sports photos appear

### **Photo not visible on public gallery:**
- **Check:** Is the photo published? (All photos are published by default)
- **Check:** Is the album published? (All albums are published by default)
- **Solution:** Check the photo and album settings in the admin panel

---

## Best Practices

1. **Organize Before Uploading:**
   - Create albums before uploading photos
   - Use descriptive album names (e.g., "Sports Day 2025" not just "Sports")

2. **Consistent Naming:**
   - Use consistent naming conventions for albums
   - Example: "Event Name - Year" format

3. **Use Categories Wisely:**
   - Select appropriate categories for better organization
   - Categories help with filtering and search

4. **Add Descriptions:**
   - Add descriptions to photos for context
   - Descriptions help with SEO and accessibility

5. **Use Tags:**
   - Add relevant tags for better searchability
   - Tags help users find related photos

6. **Assign to Albums:**
   - Always assign photos to albums unless they're truly standalone
   - Photos without albums only appear in "All Gallery" tab

---

## Technical Details

### **File Storage:**
- Files are stored in: `backend/uploads/gallery/`
- Filenames are automatically generated with timestamps to prevent conflicts

### **Database:**
- Albums stored in `Album` table
- Gallery items stored in `GalleryItem` table
- Relationship: `GalleryItem.albumId` → `Album.id`

### **API Endpoints:**
- `POST /api/gallery/upload` - Upload a photo
- `POST /api/gallery/albums` - Create an album
- `GET /api/gallery/albums` - Get albums (with filters)
- `GET /api/gallery` - Get gallery items (with filters)
- `PUT /api/gallery/:id` - Update a gallery item
- `DELETE /api/gallery/:id` - Delete a gallery item

---

## Quick Reference

| Action | Location | Steps |
|--------|----------|-------|
| Create Album | Gallery Management → Upload Media → New Album | Click "New Album", enter name |
| Upload Photo | Gallery Management → Upload Media | Select file, fill details, select album, upload |
| View Public Gallery | School Hub → Gallery | Browse by tabs: Events, Class Photos, All Gallery |
| Edit Photo | Gallery Management → Click photo menu (⋮) | Select "Edit" from menu |
| Delete Photo | Gallery Management → Click photo menu (⋮) | Select "Delete" from menu |

---

## Summary

**Key Points to Remember:**
1. **Albums organize photos** - Create albums before uploading
2. **Categories describe photos** - Select appropriate categories
3. **Assign photos to albums** - Photos must be assigned to appear in albums
4. **Unique album names** - Cannot have duplicate album names per type
5. **Public gallery shows published content** - All content is published by default

**The Flow:**
```
Create Album → Upload Photos → Assign to Album → Photos Appear in Public Gallery
```

---

*Last Updated: 2025*
*For technical support or questions, contact the development team.*

