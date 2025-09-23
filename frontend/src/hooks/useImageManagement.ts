import { useState, useEffect, useCallback } from 'react';
import ImageService, { Image, ImageUpload } from '../services/imageService';

//---------------------------------------------------------
// HOOK INTERFACE
//---------------------------------------------------------
interface UseImageManagementReturn {
  // State
  images: Image[];
  loading: boolean;
  error: string | null;
  uploading: boolean;
  uploadProgress: number;
  
  // Actions
  loadImages: (category: string, published?: boolean) => Promise<void>;
  uploadImage: (category: string, imageData: ImageUpload) => Promise<Image>;
  updateImage: (category: string, id: string, updates: Partial<Image>) => Promise<void>;
  deleteImage: (category: string, id: string) => Promise<void>;
  togglePublishStatus: (category: string, id: string, isPublished: boolean) => Promise<void>;
  searchImages: (query: string, category?: string) => Promise<Image[]>;
  
  // Utilities
  clearError: () => void;
  resetUploadProgress: () => void;
}

//---------------------------------------------------------
// CUSTOM HOOK
//---------------------------------------------------------
export const useImageManagement = (): UseImageManagementReturn => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const imageService = ImageService.getInstance();

  //---------------------------------------------------------
  // LOAD IMAGES
  //---------------------------------------------------------
  const loadImages = useCallback(async (category: string, published: boolean = true) => {
    try {
      setLoading(true);
      setError(null);
      const imgs = await imageService.getImagesByCategory(category, published);
      setImages(imgs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load images';
      setError(errorMessage);
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  }, [imageService]);

  //---------------------------------------------------------
  // UPLOAD IMAGE
  //---------------------------------------------------------
  const uploadImage = useCallback(async (category: string, imageData: ImageUpload): Promise<Image> => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // Validate image file
      const validation = imageService.validateImageFile(imageData.file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Get image dimensions
      const dimensions = await imageService.getImageDimensions(imageData.file);
      
      // Create thumbnail
      const thumbnail = await imageService.createThumbnail(imageData.file);
      
      // Upload image
      const uploadedImage = await imageService.uploadImage(category, imageData);
      
      // Add dimensions and thumbnail to the uploaded image
      const imageWithMetadata = {
        ...uploadedImage,
        width: dimensions.width,
        height: dimensions.height,
        thumbnailUrl: thumbnail
      };
      
      // Add to local state
      setImages(prev => [imageWithMetadata, ...prev]);
      setUploadProgress(100);
      
      return imageWithMetadata;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      console.error('Error uploading image:', err);
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after 1 second
    }
  }, [imageService]);

  //---------------------------------------------------------
  // UPDATE IMAGE
  //---------------------------------------------------------
  const updateImage = useCallback(async (category: string, id: string, updates: Partial<Image>): Promise<void> => {
    try {
      setError(null);
      const updatedImage = await imageService.updateImage(category, id, updates);
      
      // Update local state
      setImages(prev => 
        prev.map(img => img.id === id ? updatedImage : img)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update image';
      setError(errorMessage);
      console.error('Error updating image:', err);
      throw err;
    }
  }, [imageService]);

  //---------------------------------------------------------
  // DELETE IMAGE
  //---------------------------------------------------------
  const deleteImage = useCallback(async (category: string, id: string): Promise<void> => {
    try {
      setError(null);
      await imageService.deleteImage(category, id);
      
      // Remove from local state
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image';
      setError(errorMessage);
      console.error('Error deleting image:', err);
      throw err;
    }
  }, [imageService]);

  //---------------------------------------------------------
  // TOGGLE PUBLISH STATUS
  //---------------------------------------------------------
  const togglePublishStatus = useCallback(async (category: string, id: string, isPublished: boolean): Promise<void> => {
    try {
      setError(null);
      const updatedImage = await imageService.togglePublishStatus(category, id, isPublished);
      
      // Update local state
      setImages(prev => 
        prev.map(img => img.id === id ? updatedImage : img)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update publish status';
      setError(errorMessage);
      console.error('Error toggling publish status:', err);
      throw err;
    }
  }, [imageService]);

  //---------------------------------------------------------
  // SEARCH IMAGES
  //---------------------------------------------------------
  const searchImages = useCallback(async (query: string, category?: string): Promise<Image[]> => {
    try {
      setError(null);
      const results = await imageService.searchImages(query, category);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search images';
      setError(errorMessage);
      console.error('Error searching images:', err);
      throw err;
    }
  }, [imageService]);

  //---------------------------------------------------------
  // UTILITY FUNCTIONS
  //---------------------------------------------------------
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetUploadProgress = useCallback(() => {
    setUploadProgress(0);
  }, []);

  //---------------------------------------------------------
  // RETURN HOOK INTERFACE
  //---------------------------------------------------------
  return {
    // State
    images,
    loading,
    error,
    uploading,
    uploadProgress,
    
    // Actions
    loadImages,
    uploadImage,
    updateImage,
    deleteImage,
    togglePublishStatus,
    searchImages,
    
    // Utilities
    clearError,
    resetUploadProgress,
  };
};

export default useImageManagement;
