/**
 * Utility functions for handling static files from the public folder
 * Handles URL encoding for files with spaces and special characters
 */

/**
 * Get the correct path for a static file from the public folder
 * Automatically handles URL encoding for files with spaces or special characters
 * 
 * @param filename - The filename or path relative to the public folder (e.g., "image.jpg" or "/image.jpg")
 * @returns Properly encoded URL path
 */
export const getStaticFileUrl = (filename: string): string => {
  // Remove leading slash if present, we'll add it back
  const cleanPath = filename.startsWith('/') ? filename.slice(1) : filename;
  
  // Split the path into parts and encode each part (handles directories)
  const parts = cleanPath.split('/');
  const encodedParts = parts.map(part => {
    // Encode the filename part, but preserve forward slashes
    return encodeURIComponent(part);
  });
  
  // Join with forward slashes and add leading slash
  return `/${encodedParts.join('/')}`;
};

/**
 * Get background image URL for use in CSS
 * @param filename - The filename relative to the public folder
 * @returns CSS url() string with properly encoded path
 */
export const getBackgroundImageUrl = (filename: string): string => {
  const url = getStaticFileUrl(filename);
  return `url("${url}")`;
};

/**
 * Check if a file exists in the public folder (client-side only)
 * This is a basic check - for production, files should always exist after build
 */
export const checkStaticFileExists = async (filename: string): Promise<boolean> => {
  try {
    const url = getStaticFileUrl(filename);
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

