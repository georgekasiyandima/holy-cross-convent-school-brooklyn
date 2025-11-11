import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const BASE = API_BASE_URL;
const SCHOOL_HUB_BASE = `${BASE}/api/school-hub`;

export interface LiveFeedItem {
  id: string;
  type: 'event' | 'news' | 'announcement';
  title: string;
  content: string;
  summary?: string;
  category?: string;
  date: string;
  time?: string;
  location?: string;
  imageUrl?: string;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  author?: {
    id: string;
    name: string;
  } | null;
  priority: 'high' | 'medium' | 'low';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  source?: 'academic' | 'event' | 'news' | 'newsletter';
}

export interface LiveFeedResponse {
  success: boolean;
  data: {
    items: LiveFeedItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  category: string;
  type?: string;
  source?: 'academic' | 'event';
  isPublished: boolean;
  isHoliday?: boolean;
  isExam?: boolean;
  grade?: string;
  time?: string | null;
  author?: {
    id: string;
    name: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  isPublished: boolean;
  publishedAt: string;
  author: {
    id: string;
    name: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string | null;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  type: 'news' | 'newsletter';
  priority: string;
  publishedAt: string;
  createdAt: string;
  updatedAt?: string;
}

class LiveFeedService {
  private static instance: LiveFeedService;

  public static getInstance(): LiveFeedService {
    if (!LiveFeedService.instance) {
      LiveFeedService.instance = new LiveFeedService();
    }
    return LiveFeedService.instance;
  }

  /**
   * Fetch all live feed items (events + news + announcements)
   */
  async getLiveFeedItems(page: number = 1, limit: number = 20): Promise<LiveFeedItem[]> {
    try {
      const [eventsResponse, announcementsResponse] = await Promise.all([
        axios.get(`${SCHOOL_HUB_BASE}/events`, {
          params: {
            upcoming: 'true',
            limit: limit * 2, // fetch extra to merge with announcements
          }
        }),
        axios.get(`${SCHOOL_HUB_BASE}/announcements/latest`, {
          params: {
            limit: limit * 2,
          }
        })
      ]);

      const unifiedEvents: EventItem[] = eventsResponse.data.success
        ? eventsResponse.data.data
        : [];

      const announcements: AnnouncementItem[] = announcementsResponse.data.success
        ? announcementsResponse.data.data
        : [];

      const eventItems: LiveFeedItem[] = unifiedEvents.map((event) => ({
        id: event.id,
        type: 'event' as const,
        title: event.title,
        content: event.description,
        category: event.category,
        date: event.startDate,
        time: event.time || undefined,
        location: event.location || undefined,
        author: event.author || null,
        priority: this.getEventPriority(event),
        isPublished: event.isPublished,
        createdAt: event.startDate,
        updatedAt: event.endDate || event.startDate,
        source: event.source,
      }));

      const announcementItems: LiveFeedItem[] = announcements.map((announcement) => ({
        id: announcement.id,
        type: announcement.type === 'news' ? 'news' : 'announcement',
        title: announcement.title,
        content: announcement.content,
        summary: announcement.summary,
        category: announcement.type,
        date: announcement.publishedAt,
        imageUrl: announcement.imageUrl || undefined,
        attachmentUrl: announcement.attachmentUrl || null,
        attachmentType: announcement.attachmentType || null,
        priority: this.getAnnouncementPriority(announcement),
        isPublished: true,
        createdAt: announcement.createdAt,
        updatedAt: announcement.updatedAt || announcement.createdAt,
        source: announcement.type,
      }));

      const allItems = [...eventItems, ...announcementItems]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit * page);

      return allItems.slice((page - 1) * limit, page * limit);
    } catch (error) {
      console.error('Error fetching live feed items:', error);
      throw new Error('Failed to fetch live feed items');
    }
  }

  /**
   * Fetch upcoming events
   */
  async getUpcomingEvents(limit: number = 5): Promise<EventItem[]> {
    try {
      const response = await axios.get(`${SCHOOL_HUB_BASE}/events/upcoming`, {
        params: {
          limit,
        }
      });

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch upcoming events');
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw new Error('Failed to fetch upcoming events');
    }
  }

  /**
   * Fetch latest news
   */
  async getLatestNews(limit: number = 5): Promise<NewsItem[]> {
    try {
      const response = await axios.get(`${SCHOOL_HUB_BASE}/announcements/latest`, {
        params: {
          limit,
        }
      });

      if (response.data.success) {
        return response.data.data
          .filter((item: AnnouncementItem) => item.type === 'news')
          .map((item: AnnouncementItem) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            summary: item.summary,
            category: item.type,
            isPublished: true,
            publishedAt: item.publishedAt,
            author: { id: '', name: 'Holy Cross Convent School' },
            tags: [],
            createdAt: item.createdAt,
            updatedAt: item.updatedAt || item.createdAt,
          }));
      }
      throw new Error('Failed to fetch latest announcements');
    } catch (error) {
      console.error('Error fetching latest announcements:', error);
      throw new Error('Failed to fetch latest announcements');
    }
  }

  /**
   * Fetch events with pagination
   */
  async getEvents(page: number = 1, limit: number = 10): Promise<EventItem[]> {
    try {
      const response = await axios.get(`${SCHOOL_HUB_BASE}/events`, {
        params: {
          page,
          limit,
        }
      });

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch events');
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  /**
   * Get a single event by ID
   */
  async getEventById(id: string): Promise<EventItem> {
    try {
      const response = await axios.get(`${SCHOOL_HUB_BASE}/events/${id}`);

      if (response.data.success) {
        const event = response.data.data;
        return {
          id: event.id,
          title: event.title,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          category: event.category,
          type: event.type,
          source: event.source,
          isPublished: event.isPublished !== false,
          isHoliday: event.isHoliday,
          isExam: event.isExam,
          grade: event.grade,
          time: event.time,
          createdAt: event.startDate,
          updatedAt: event.endDate || event.startDate,
        };
      }
      throw new Error('Event not found');
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event');
    }
  }

  /**
   * Get a single news article by ID
   */
  async getNewsById(id: string): Promise<NewsItem> {
    try {
      const response = await axios.get(`${BASE}/api/news/${id}`);
      
      if (response.data.success) {
        return response.data.data.article;
      }
      throw new Error('News article not found');
    } catch (error) {
      console.error('Error fetching news article:', error);
      throw new Error('Failed to fetch news article');
    }
  }

  /**
   * Search live feed items
   */
  async searchLiveFeed(query: string, page: number = 1, limit: number = 20): Promise<LiveFeedItem[]> {
    try {
      const allItems = await this.getLiveFeedItems(1, limit * 3);
      const lowerQuery = query.toLowerCase();
      return allItems
        .filter((item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.content.toLowerCase().includes(lowerQuery) ||
          (item.summary ? item.summary.toLowerCase().includes(lowerQuery) : false) ||
          (item.category ? item.category.toLowerCase().includes(lowerQuery) : false)
        )
        .slice((page - 1) * limit, page * limit);
    } catch (error) {
      console.error('Error searching live feed:', error);
      throw new Error('Failed to search live feed');
    }
  }

  /**
   * Get event priority based on date and category
   */
  private getEventPriority(event: EventItem): 'high' | 'medium' | 'low' {
    const eventDate = new Date(event.startDate);
    const now = new Date();
    const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilEvent <= 7) return 'high';
    if (daysUntilEvent <= 30) return 'medium';
    return 'low';
  }

  /**
   * Get news priority based on category and recency
   */
  private getNewsPriority(article: NewsItem): 'high' | 'medium' | 'low' {
    const publishedDate = new Date(article.publishedAt);
    const now = new Date();
    const daysSincePublished = Math.ceil((now.getTime() - publishedDate.getTime())) / (1000 * 60 * 60 * 24);

    if (daysSincePublished <= 3) return 'high';
    if (daysSincePublished <= 7) return 'medium';
    return 'low';
  }

  private getAnnouncementPriority(announcement: AnnouncementItem): 'high' | 'medium' | 'low' {
    const publishedDate = new Date(announcement.publishedAt);
    const now = new Date();
    const daysSincePublished = Math.ceil((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSincePublished <= 3) return 'high';
    if (daysSincePublished <= 7) return 'medium';
    return 'low';
  }
}

export default LiveFeedService;




