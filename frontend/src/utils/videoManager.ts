/**
 * Video Management System for Holy Cross Convent School
 * 
 * This system manages Facebook videos and other video content
 * from the school's social media presence.
 */

export interface SchoolVideo {
  id: string;
  title: string;
  description: string;
  facebookUrl: string;
  embedCode: string;
  thumbnail?: string;
  category: VideoCategory;
  date?: string;
  gradeLevel?: string;
  duration?: string;
  views?: number;
}

export type VideoCategory = 
  | 'choir'
  | 'performance'
  | 'event'
  | 'celebration'
  | 'academic'
  | 'sports'
  | 'spiritual'
  | 'general';

export interface VideoCollection {
  category: VideoCategory;
  title: string;
  description: string;
  videos: SchoolVideo[];
}

/**
 * Current school videos from Facebook
 */
export const schoolVideos: SchoolVideo[] = [
  {
    id: 'choir-performance-1',
    title: 'Holy Cross Brooklyn Senior Choir Performance',
    description: 'Beautiful performance by our Senior Choir showcasing the musical talent at Holy Cross Convent School Brooklyn.',
    facebookUrl: 'https://www.facebook.com/61553924237049/videos/1803835803880820/',
    embedCode: '<iframe src="https://www.facebook.com/plugins/video.php?height=420&href=https%3A%2F%2Fwww.facebook.com%2F61553924237049%2Fvideos%2F1803835803880820%2F&show_text=false&width=560&t=0" width="560" height="420" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>',
    category: 'choir',
    date: '2025'
  }
];

/**
 * Video collections organized by category
 */
export const videoCollections: VideoCollection[] = [
  {
    category: 'choir',
    title: 'Choir Performances',
    description: 'Beautiful performances by our school choirs',
    videos: schoolVideos.filter(video => video.category === 'choir')
  },
  {
    category: 'performance',
    title: 'Musical Performances',
    description: 'Various musical performances and recitals',
    videos: schoolVideos.filter(video => video.category === 'performance')
  },
  {
    category: 'event',
    title: 'School Events',
    description: 'Videos from special school events and celebrations',
    videos: schoolVideos.filter(video => video.category === 'event')
  },
  {
    category: 'celebration',
    title: 'Celebrations',
    description: 'Videos from school celebrations and special occasions',
    videos: schoolVideos.filter(video => video.category === 'celebration')
  },
  {
    category: 'academic',
    title: 'Academic Activities',
    description: 'Videos showcasing academic achievements and activities',
    videos: schoolVideos.filter(video => video.category === 'academic')
  },
  {
    category: 'sports',
    title: 'Sports & Athletics',
    description: 'Videos from sports events and athletic activities',
    videos: schoolVideos.filter(video => video.category === 'sports')
  },
  {
    category: 'spiritual',
    title: 'Spiritual Events',
    description: 'Videos from spiritual and religious events',
    videos: schoolVideos.filter(video => video.category === 'spiritual')
  },
  {
    category: 'general',
    title: 'General School Life',
    description: 'General videos showcasing school life and activities',
    videos: schoolVideos.filter(video => video.category === 'general')
  }
];

/**
 * Utility functions for video management
 */
export const videoManager = {
  /**
   * Get all videos
   */
  getAllVideos: (): SchoolVideo[] => {
    return schoolVideos;
  },

  /**
   * Get videos by category
   */
  getVideosByCategory: (category: VideoCategory): SchoolVideo[] => {
    return schoolVideos.filter(video => video.category === category);
  },

  /**
   * Get video by ID
   */
  getVideoById: (id: string): SchoolVideo | undefined => {
    return schoolVideos.find(video => video.id === id);
  },

  /**
   * Get collection by category
   */
  getCollectionByCategory: (category: VideoCategory): VideoCollection | undefined => {
    return videoCollections.find(collection => collection.category === category);
  },

  /**
   * Get all collections
   */
  getAllCollections: (): VideoCollection[] => {
    return videoCollections;
  },

  /**
   * Search videos by title or description
   */
  searchVideos: (query: string): SchoolVideo[] => {
    const lowerQuery = query.toLowerCase();
    return schoolVideos.filter(video => 
      video.title.toLowerCase().includes(lowerQuery) ||
      video.description.toLowerCase().includes(lowerQuery) ||
      video.gradeLevel?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Get featured video (first video in the list)
   */
  getFeaturedVideo: (): SchoolVideo | undefined => {
    return schoolVideos.length > 0 ? schoolVideos[0] : undefined;
  },

  /**
   * Get recent videos (last 5 videos)
   */
  getRecentVideos: (count: number = 5): SchoolVideo[] => {
    return schoolVideos.slice(-count).reverse();
  },

  /**
   * Get total video count
   */
  getTotalVideoCount: (): number => {
    return schoolVideos.length;
  },

  /**
   * Get video count by category
   */
  getVideoCountByCategory: (): Record<VideoCategory, number> => {
    const counts: Record<VideoCategory, number> = {
      choir: 0,
      performance: 0,
      event: 0,
      celebration: 0,
      academic: 0,
      sports: 0,
      spiritual: 0,
      general: 0
    };

    schoolVideos.forEach(video => {
      counts[video.category]++;
    });

    return counts;
  },

  /**
   * Add new video (for future use)
   */
  addVideo: (video: SchoolVideo): void => {
    schoolVideos.push(video);
  },

  /**
   * Generate Facebook embed code from URL
   */
  generateEmbedCode: (facebookUrl: string, width: number = 560, height: number = 420): string => {
    // Extract video ID from Facebook URL
    const videoIdMatch = facebookUrl.match(/videos\/(\d+)/);
    if (!videoIdMatch) {
      throw new Error('Invalid Facebook video URL');
    }
    
    const videoId = videoIdMatch[1];
    const embedUrl = `https://www.facebook.com/plugins/video.php?height=${height}&href=https%3A%2F%2Fwww.facebook.com%2F61553924237049%2Fvideos%2F${videoId}%2F&show_text=false&width=${width}&t=0`;
    
    return `<iframe src="${embedUrl}" width="${width}" height="${height}" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`;
  },

  /**
   * Validate Facebook video URL
   */
  validateFacebookUrl: (url: string): boolean => {
    const facebookVideoRegex = /^https:\/\/www\.facebook\.com\/.*\/videos\/\d+/;
    return facebookVideoRegex.test(url);
  }
};

export default videoManager; 