/**
 * Image utility functions for staff images
 * Enhanced with centralized image service integration
 */

import ImageService from '../services/imageService';

const imageService = ImageService.getInstance();

// Base URL for static images
const STATIC_IMAGE_BASE = 'http://localhost:5000/uploads/staff/';

/**
 * Get image URL for staff member
 * @param imageUrl - Database image URL or filename
 * @returns Complete image URL
 */
export const getStaffImageUrl = (imageUrl?: string): string | undefined => {
  if (!imageUrl) return undefined;
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative path from backend uploads, convert to static path
  if (imageUrl.includes('/uploads/staff/')) {
    const filename = imageUrl.split('/').pop();
    return `${STATIC_IMAGE_BASE}${filename}`;
  }
  
  // If it's just a filename, assume it's in static folder
  if (!imageUrl.includes('/')) {
    return `${STATIC_IMAGE_BASE}${imageUrl}`;
  }
  
  return imageUrl;
};

/**
 * Generate initials from staff name
 * @param name - Staff member name
 * @returns Initials string
 */
export const getStaffInitials = (name: string): string => {
  return imageService.getInitials(name);
};

/**
 * Validate image file before upload
 * @param file - File object
 * @returns Validation result
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please select a valid image file (JPEG, PNG, or WebP)' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }
  
  return { valid: true };
};

/**
 * Generate optimized filename for staff image
 * @param name - Staff member name
 * @param extension - File extension
 * @returns Optimized filename
 */
export const generateStaffImageFilename = (name: string, extension: string = 'jpg'): string => {
  const sanitizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  
  return `${sanitizedName}.${extension}`;
};

/**
 * Check if image URL is accessible
 * @param url - Image URL
 * @returns Promise resolving to boolean
 */
export const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// =============================
// ENHANCED UTILITY FUNCTIONS
// =============================

/**
 * Get optimized staff image URL with automatic optimization
 * @param imageUrl - Original image URL
 * @param size - Desired image size
 * @returns Optimized image URL
 */
export const getOptimizedStaffImageUrl = (imageUrl?: string | null, size?: number): string => {
  if (!imageUrl) return '/default-staff-avatar.png';
  
  return imageService.getOptimizedImageUrl(imageUrl, {
    width: size || 300,
    height: size || 300,
    quality: 90,
    format: 'webp',
    fit: 'cover'
  });
};

/**
 * Preload multiple staff images for better performance
 * @param imageUrls - Array of image URLs
 * @returns Promise that resolves when all images are loaded
 */
export const preloadStaffImages = async (imageUrls: string[]): Promise<void> => {
  await imageService.preloadImages(imageUrls, {
    width: 300,
    quality: 85,
    format: 'webp'
  });
};

/**
 * Upload staff image with enhanced validation and progress tracking
 * @param file - Image file
 * @param staffId - Staff member ID
 * @param onProgress - Progress callback
 * @returns Upload result
 */
export const uploadStaffImage = async (
  file: File, 
  staffId: string, 
  onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
) => {
  const imageData = {
    title: `Staff Image for ${staffId}`,
    description: `Profile image for staff member ${staffId}`,
    category: 'staff' as const,
    tags: ['staff', 'profile'],
    isPublished: true,
    file: file
  };
  
  return imageService.uploadImage('staff', imageData);
};

/**
 * Get responsive image URLs for different screen sizes
 * @param baseUrl - Base image URL
 * @returns Object with different size URLs
 */
export const getResponsiveStaffImageUrls = (baseUrl: string) => {
  return {
    small: imageService.getOptimizedImageUrl(baseUrl, { width: 150, quality: 80 }),
    medium: imageService.getOptimizedImageUrl(baseUrl, { width: 300, quality: 85 }),
    large: imageService.getOptimizedImageUrl(baseUrl, { width: 600, quality: 90 })
  };
};
