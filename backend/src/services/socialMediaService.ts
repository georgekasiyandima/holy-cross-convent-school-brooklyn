/**
 * Social Media Integration Service
 * Handles posting to Facebook, Instagram, Twitter, etc.
 */

import axios from 'axios';

export interface SocialMediaPost {
  imageUrl: string;
  caption: string;
  title?: string;
  description?: string;
}

export interface SocialMediaConfig {
  facebook?: {
    pageId?: string;
    accessToken?: string;
    enabled: boolean;
  };
  instagram?: {
    accountId?: string;
    accessToken?: string;
    enabled: boolean;
  };
  twitter?: {
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    accessTokenSecret?: string;
    enabled: boolean;
  };
  tiktok?: {
    clientKey?: string;
    clientSecret?: string;
    accessToken?: string;
    enabled: boolean;
  };
}

class SocialMediaService {
  private static instance: SocialMediaService;
  private config: SocialMediaConfig;

  private constructor() {
    // Load config from environment variables
    this.config = {
      facebook: {
        pageId: process.env.FACEBOOK_PAGE_ID,
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
        enabled: process.env.FACEBOOK_ENABLED === 'true'
      },
      instagram: {
        accountId: process.env.INSTAGRAM_ACCOUNT_ID,
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
        enabled: process.env.INSTAGRAM_ENABLED === 'true'
      },
      twitter: {
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        enabled: process.env.TWITTER_ENABLED === 'true'
      },
      tiktok: {
        clientKey: process.env.TIKTOK_CLIENT_KEY,
        clientSecret: process.env.TIKTOK_CLIENT_SECRET,
        accessToken: process.env.TIKTOK_ACCESS_TOKEN,
        enabled: process.env.TIKTOK_ENABLED === 'true'
      }
    };
  }

  public static getInstance(): SocialMediaService {
    if (!SocialMediaService.instance) {
      SocialMediaService.instance = new SocialMediaService();
    }
    return SocialMediaService.instance;
  }

  /**
   * Post to Facebook Page
   */
  async postToFacebook(post: SocialMediaPost): Promise<{ success: boolean; postId?: string; error?: string }> {
    if (!this.config.facebook?.enabled || !this.config.facebook?.pageId || !this.config.facebook?.accessToken) {
      return { success: false, error: 'Facebook not configured' };
    }

    try {
      // For Facebook, we need to upload the image first, then create a post
      const imageResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${this.config.facebook.pageId}/photos`,
        {
          url: post.imageUrl,
          caption: post.caption,
          access_token: this.config.facebook.accessToken
        }
      );

      return {
        success: true,
        postId: imageResponse.data.id
      };
    } catch (error: any) {
      console.error('Error posting to Facebook:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'Failed to post to Facebook'
      };
    }
  }

  /**
   * Post to Instagram (via Facebook Graph API)
   */
  async postToInstagram(post: SocialMediaPost): Promise<{ success: boolean; postId?: string; error?: string }> {
    if (!this.config.instagram?.enabled || !this.config.instagram?.accountId || !this.config.instagram?.accessToken) {
      return { success: false, error: 'Instagram not configured' };
    }

    try {
      // Instagram requires a two-step process:
      // 1. Create media container
      // 2. Publish the container
      const containerResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${this.config.instagram.accountId}/media`,
        {
          image_url: post.imageUrl,
          caption: post.caption,
          access_token: this.config.instagram.accessToken
        }
      );

      const creationId = containerResponse.data.id;

      // Wait a moment for Instagram to process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Publish the container
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${this.config.instagram.accountId}/media_publish`,
        {
          creation_id: creationId,
          access_token: this.config.instagram.accessToken
        }
      );

      return {
        success: true,
        postId: publishResponse.data.id
      };
    } catch (error: any) {
      console.error('Error posting to Instagram:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'Failed to post to Instagram'
      };
    }
  }

  /**
   * Post to Twitter/X
   */
  async postToTwitter(post: SocialMediaPost): Promise<{ success: boolean; tweetId?: string; error?: string }> {
    if (!this.config.twitter?.enabled) {
      return { success: false, error: 'Twitter not configured' };
    }

    // Twitter API v2 requires OAuth 1.0a or OAuth 2.0
    // For now, return a placeholder that can be implemented with Twitter API v2
    console.log('Twitter posting not yet implemented - requires Twitter API v2 integration');
    return {
      success: false,
      error: 'Twitter integration requires Twitter API v2 setup'
    };
  }

  /**
   * Post to TikTok
   */
  async postToTikTok(post: SocialMediaPost): Promise<{ success: boolean; videoId?: string; error?: string }> {
    if (!this.config.tiktok?.enabled || !this.config.tiktok?.accessToken) {
      return { success: false, error: 'TikTok not configured' };
    }

    try {
      // TikTok Content Publishing API (v1.3)
      // Requires: image_url, post_info with caption
      const response = await axios.post(
        'https://open.tiktokapis.com/v2/post/publish/video/init/',
        {
          post_info: {
            title: post.title || post.caption,
            privacy_level: 'PUBLIC_TO_EVERYONE',
            disable_duet: false,
            disable_comment: false,
            disable_stitch: false,
            video_cover_timestamp_ms: 1000,
          },
          source_info: {
            source: 'FILE_UPLOAD',
            video_url: post.imageUrl, // TikTok expects video URL
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.tiktok.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // TikTok API returns a publish_id that needs to be checked for status
      // For now, we'll return success if we get a response
      return {
        success: true,
        videoId: response.data?.data?.publish_id || response.data?.publish_id
      };
    } catch (error: any) {
      console.error('Error posting to TikTok:', error.response?.data || error.message);
      
      // TikTok API might require different endpoints or authentication
      // If the API structure is different, we can adjust here
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'TikTok access token expired or invalid'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'Failed to post to TikTok'
      };
    }
  }

  /**
   * Post to all enabled social media platforms
   */
  async postToAll(post: SocialMediaPost): Promise<{
    facebook?: { success: boolean; postId?: string; error?: string };
    instagram?: { success: boolean; postId?: string; error?: string };
    twitter?: { success: boolean; tweetId?: string; error?: string };
    tiktok?: { success: boolean; videoId?: string; error?: string };
  }> {
    const results: any = {};

    // Post to Facebook
    if (this.config.facebook?.enabled) {
      results.facebook = await this.postToFacebook(post);
    }

    // Post to Instagram
    if (this.config.instagram?.enabled) {
      results.instagram = await this.postToInstagram(post);
    }

    // Post to Twitter
    if (this.config.twitter?.enabled) {
      results.twitter = await this.postToTwitter(post);
    }

    // Post to TikTok
    if (this.config.tiktok?.enabled) {
      results.tiktok = await this.postToTikTok(post);
    }

    return results;
  }

  /**
   * Check if social media is configured
   */
  isConfigured(): boolean {
    return !!(
      (this.config.facebook?.enabled && this.config.facebook?.accessToken) ||
      (this.config.instagram?.enabled && this.config.instagram?.accessToken) ||
      (this.config.twitter?.enabled) ||
      (this.config.tiktok?.enabled && this.config.tiktok?.accessToken)
    );
  }

  /**
   * Get configuration status
   */
  getConfigStatus(): {
    facebook: boolean;
    instagram: boolean;
    twitter: boolean;
    tiktok: boolean;
  } {
    return {
      facebook: !!(this.config.facebook?.enabled && this.config.facebook?.accessToken),
      instagram: !!(this.config.instagram?.enabled && this.config.instagram?.accessToken),
      twitter: !!(this.config.twitter?.enabled),
      tiktok: !!(this.config.tiktok?.enabled && this.config.tiktok?.accessToken)
    };
  }
}

export default SocialMediaService.getInstance();

