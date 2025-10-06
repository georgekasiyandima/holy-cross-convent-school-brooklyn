import axios from 'axios';

const API_BASE_URL = 'https://holy-cross-convent-school-brooklyn.onrender.com';

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
  author?: {
    id: string;
    name: string;
  };
  priority: 'high' | 'medium' | 'low';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
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
  endDate?: string;
  location?: string;
  category: string;
  isPublished: boolean;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
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
      const [eventsResponse, newsResponse] = await Promise.all([
        this.getEvents(page, limit),
        this.getNews(page, limit)
      ]);

      const events: LiveFeedItem[] = eventsResponse.map(event => ({
        id: event.id,
        type: 'event' as const,
        title: event.title,
        content: event.description,
        category: event.category,
        date: event.startDate,
        location: event.location,
        author: event.author,
        priority: this.getEventPriority(event),
        isPublished: event.isPublished,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }));

      const news: LiveFeedItem[] = newsResponse.map(article => ({
        id: article.id,
        type: 'news' as const,
        title: article.title,
        content: article.content,
        summary: article.summary,
        category: article.category,
        date: article.publishedAt,
        author: article.author,
        priority: this.getNewsPriority(article),
        isPublished: article.isPublished,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      }));

      // Combine and sort by date (newest first)
      const allItems = [...events, ...news].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return allItems;
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
      const response = await axios.get(`${API_BASE_URL}/api/events`, {
        params: {
          upcoming: 'true',
          limit
        }
      });

      if (response.data.success) {
        return response.data.data.events;
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
      const response = await axios.get(`${API_BASE_URL}/api/news`, {
        params: {
          limit
        }
      });

      if (response.data.success) {
        return response.data.data.articles;
      }
      throw new Error('Failed to fetch latest news');
    } catch (error) {
      console.error('Error fetching latest news:', error);
      throw new Error('Failed to fetch latest news');
    }
  }

  /**
   * Fetch events with pagination
   */
  async getEvents(page: number = 1, limit: number = 10): Promise<EventItem[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`, {
        params: {
          page,
          limit
        }
      });

      if (response.data.success) {
        return response.data.data.events;
      }
      throw new Error('Failed to fetch events');
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  /**
   * Fetch news with pagination
   */
  async getNews(page: number = 1, limit: number = 10): Promise<NewsItem[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/news`, {
        params: {
          page,
          limit
        }
      });

      if (response.data.success) {
        return response.data.data.articles;
      }
      throw new Error('Failed to fetch news');
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news');
    }
  }

  /**
   * Get a single event by ID
   */
  async getEventById(id: string): Promise<EventItem> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
      
      if (response.data.success) {
        return response.data.data.event;
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
      const response = await axios.get(`${API_BASE_URL}/api/news/${id}`);
      
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
      const [eventsResponse, newsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/events`, {
          params: { search: query, page, limit }
        }),
        axios.get(`${API_BASE_URL}/api/news`, {
          params: { search: query, page, limit }
        })
      ]);

      const events: LiveFeedItem[] = eventsResponse.data.success 
        ? eventsResponse.data.data.events.map((event: EventItem) => ({
            id: event.id,
            type: 'event' as const,
            title: event.title,
            content: event.description,
            category: event.category,
            date: event.startDate,
            location: event.location,
            author: event.author,
            priority: this.getEventPriority(event),
            isPublished: event.isPublished,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt
          }))
        : [];

      const news: LiveFeedItem[] = newsResponse.data.success 
        ? newsResponse.data.data.articles.map((article: NewsItem) => ({
            id: article.id,
            type: 'news' as const,
            title: article.title,
            content: article.content,
            summary: article.summary,
            category: article.category,
            date: article.publishedAt,
            author: article.author,
            priority: this.getNewsPriority(article),
            isPublished: article.isPublished,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt
          }))
        : [];

      return [...events, ...news].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
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
}

export default LiveFeedService;




