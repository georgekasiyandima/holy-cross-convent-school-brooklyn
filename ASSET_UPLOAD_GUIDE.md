# Holy Cross School - Asset Upload Guide

## 📸 **STAFF PHOTO UPLOAD PROCESS**

### **Photo Requirements**
```
Format: JPEG (.jpg) - Recommended
Size: 1200x1200 pixels (square format)
Quality: High resolution (minimum 300 DPI)
File Size: Under 10MB
Color Profile: sRGB
```

### **Step-by-Step Upload Process**

#### **1. Prepare Photos**
- **Resize**: Use any photo editor to resize to 1200x1200px
- **Format**: Save as JPEG with 90% quality
- **Naming**: `staff-firstname-lastname-role.jpg`
- **Examples**:
  - `staff-john-smith-principal.jpg`
  - `staff-mary-jones-grade1-teacher.jpg`
  - `staff-peter-brown-administrator.jpg`

#### **2. Upload via API**
```bash
# Single staff photo upload
curl -X POST http://localhost:5000/api/assets/staff/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "photo=@staff-john-smith-principal.jpg" \
  -F "name=John Smith" \
  -F "role=Principal" \
  -F "email=john.smith@holycrossbrooklyn.edu" \
  -F "phone=(021) 511 4337" \
  -F "bio=Dedicated educator with 15 years of experience"
```

#### **3. What Happens Automatically**
- ✅ **Image Optimization**: Resized to 1200x1200px
- ✅ **WebP Conversion**: Created for better performance
- ✅ **Thumbnail Generation**: 300x300px thumbnail created
- ✅ **Database Storage**: Staff record created with photo URLs
- ✅ **File Organization**: Stored in organized directory structure

### **Bulk Upload for Multiple Staff**
```bash
# Upload multiple staff photos at once
curl -X POST http://localhost:5000/api/assets/staff/bulk-upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "photos=@staff-photo-1.jpg" \
  -F "photos=@staff-photo-2.jpg" \
  -F "photos=@staff-photo-3.jpg" \
  -F "staff_0={\"name\":\"John Smith\",\"role\":\"Principal\",\"email\":\"john@school.edu\"}" \
  -F "staff_1={\"name\":\"Mary Jones\",\"role\":\"Grade 1 Teacher\",\"email\":\"mary@school.edu\"}" \
  -F "staff_2={\"name\":\"Peter Brown\",\"role\":\"Administrator\",\"email\":\"peter@school.edu\"}"
```

---

## 📄 **DOCUMENT UPLOAD PROCESS**

### **Document Requirements**
```
Format: PDF only
Size: Under 10MB
Quality: Text-based (not scanned images)
Naming: category-document-name-version.pdf
```

### **Document Categories & Examples**

#### **Policies**
```
Examples:
- academic-policy-2024.pdf
- disciplinary-policy-2024.pdf
- safety-policy-2024.pdf
- attendance-policy-2024.pdf
```

#### **Forms**
```
Examples:
- admission-form-2024.pdf
- medical-form-2024.pdf
- consent-form-2024.pdf
- transport-form-2024.pdf
```

#### **Reports**
```
Examples:
- annual-report-2024.pdf
- financial-report-2024.pdf
- academic-report-2024.pdf
- sports-report-2024.pdf
```

#### **Newsletters**
```
Examples:
- newsletter-september-2024.pdf
- newsletter-october-2024.pdf
- newsletter-november-2024.pdf
- special-announcement-2024.pdf
```

### **Upload Process**
```bash
# Upload a policy document
curl -X POST http://localhost:5000/api/assets/documents/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "document=@academic-policy-2024.pdf" \
  -F "title=Academic Policy 2024" \
  -F "description=Comprehensive academic policies and procedures" \
  -F "category=policy" \
  -F "isPublished=true"
```

---

## 🖼️ **GALLERY IMAGE UPLOAD PROCESS**

### **Gallery Image Requirements**
```
Format: JPEG (.jpg), PNG (.png), or WebP (.webp)
Size: 1920x1080 pixels (16:9 ratio) - Recommended
Quality: High resolution
File Size: Under 10MB
```

### **Gallery Categories**
- **Events**: School events, celebrations, ceremonies
- **Activities**: Sports, cultural activities, academic events
- **Facilities**: School buildings, classrooms, playground
- **Students**: Student activities, achievements, daily life
- **Staff**: Staff activities, professional development

### **Upload Process**
```bash
# Upload gallery image
curl -X POST http://localhost:5000/api/assets/gallery/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@school-sports-day-2024.jpg" \
  -F "title=Sports Day 2024" \
  -F "description=Annual sports day celebration" \
  -F "category=Events" \
  -F "tags=sports,celebration,students,2024"
```

---

## 🎨 **LOGO & BRANDING ASSETS**

### **Logo Requirements**
```
Format: SVG (preferred), PNG, or JPEG
Size: 1920x1080px minimum
Background: Transparent (PNG) or white background
Quality: High resolution, vector if possible
```

### **Logo Variations Needed**
1. **Main Logo**: Full school logo with text
2. **Icon Only**: Just the symbol/emblem
3. **Horizontal**: Logo arranged horizontally
4. **Vertical**: Logo arranged vertically
5. **Monochrome**: Single color version

### **Upload Process**
```bash
# Upload logo (treat as gallery image)
curl -X POST http://localhost:5000/api/assets/gallery/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@holy-cross-logo-main.png" \
  -F "title=Holy Cross School Logo" \
  -F "description=Main school logo" \
  -F "category=Branding" \
  -F "tags=logo,branding,main"
```

---

## 📋 **MISSION STATEMENT & CONTENT**

### **Text Content Upload**
Mission statements and other text content can be uploaded through the admin interface or API:

```bash
# Update school information
curl -X PUT http://localhost:5000/api/school/info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mission": "To provide holistic Christian education that nurtures both mind and soul",
    "vision": "To be a leading Catholic school in academic excellence and character development",
    "values": "Faith, Excellence, Integrity, Service, Community"
  }'
```

---

## 🚀 **AUTOMATIC OPTIMIZATION FEATURES**

### **What Happens to Your Uploads**

#### **Images (Staff & Gallery)**
1. **Format Conversion**: Automatic WebP creation for better performance
2. **Size Optimization**: Resized to optimal dimensions
3. **Compression**: Balanced quality/size ratio
4. **Thumbnail Creation**: Automatic thumbnail generation
5. **Multiple Formats**: Original + WebP + Thumbnail stored

#### **Documents (PDFs)**
1. **Validation**: File type and size verification
2. **Organization**: Stored in category-specific folders
3. **Metadata**: Title, description, and category stored
4. **Search**: Full-text search capability
5. **Download Tracking**: Analytics on download frequency

### **Performance Benefits**
- **WebP Images**: 25-35% smaller file sizes
- **Optimized Thumbnails**: Fast loading gallery
- **Progressive JPEG**: Better loading experience
- **CDN Ready**: Optimized for content delivery networks

---

## 📊 **UPLOAD MONITORING & STATISTICS**

### **View Upload Statistics**
```bash
# Get optimization statistics
curl -X GET http://localhost:5000/api/assets/optimization/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Response Example**
```json
{
  "success": true,
  "data": {
    "totalImages": 45,
    "totalSize": 22500000,
    "webpSavings": 6750000,
    "averageSize": 500000
  }
}
```

### **Cleanup Orphaned Files**
```bash
# Clean up unused files
curl -X POST http://localhost:5000/api/assets/cleanup \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues & Solutions**

#### **File Too Large**
```
Error: File size exceeds 10MB limit
Solution: Compress image or reduce dimensions
```

#### **Invalid Format**
```
Error: Invalid file type
Solution: Use JPEG, PNG, WebP for images; PDF for documents
```

#### **Upload Failed**
```
Error: Failed to upload
Solution: Check file integrity and try again
```

#### **Poor Image Quality**
```
Issue: Images look blurry after upload
Solution: Upload higher resolution images (minimum 1200px)
```

---

## 📱 **MOBILE UPLOAD CONSIDERATIONS**

### **Mobile Photo Tips**
- **Camera Settings**: Use highest quality setting
- **Lighting**: Ensure good lighting for clear photos
- **Stability**: Use tripod or stable surface
- **Format**: Save as JPEG for best compatibility

### **Mobile Upload Process**
1. **Prepare**: Resize and format photos on computer
2. **Upload**: Use API or web interface
3. **Verify**: Check uploaded images in gallery
4. **Optimize**: System automatically optimizes for mobile viewing

---

## 🎯 **BEST PRACTICES**

### **Photo Quality**
- **Lighting**: Natural light preferred
- **Background**: Clean, professional backgrounds
- **Composition**: Centered subjects, good framing
- **Consistency**: Similar style across all photos

### **Document Quality**
- **Text**: Use text-based PDFs (not scanned images)
- **Fonts**: Clear, readable fonts
- **Layout**: Professional formatting
- **Versioning**: Include year in filename

### **Organization**
- **Naming**: Use consistent naming conventions
- **Categories**: Organize by appropriate categories
- **Tags**: Add relevant tags for searchability
- **Updates**: Regular cleanup of outdated files

---

## 📞 **SUPPORT & HELP**

### **Technical Support**
- **Email**: tech@holycrossbrooklyn.edu
- **Phone**: (021) 511 4337
- **Hours**: Monday-Friday, 8:00 AM - 5:00 PM

### **Training Sessions**
- **Staff Training**: 2-hour session on content management
- **Documentation**: Step-by-step guides provided
- **Video Tutorials**: Available for common tasks
- **Ongoing Support**: First 3 months included

---

*This guide ensures optimal asset management for Holy Cross Convent School Brooklyn's website with professional quality and performance.*



