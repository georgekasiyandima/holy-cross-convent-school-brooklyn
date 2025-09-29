import { useState, useEffect, useCallback, useRef } from 'react';
import LiveFeedService, { LiveFeedItem, EventItem, NewsItem } from '../services/liveFeedService';

export interface UseLiveFeedOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  pageSize?: number;
  enableSearch?: boolean;
}

export interface UseLiveFeedReturn {
  // Data
  items: LiveFeedItem[];
  upcomingEvents: EventItem[];
  latestNews: NewsItem[];
  
  // Loading states
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
  
  // Actions
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
  
  // Search state
  searchQuery: string;
  isSearching: boolean;
  
  // Last updated
  lastUpdated: Date | null;
}

export const useLiveFeed = (options: UseLiveFeedOptions = {}): UseLiveFeedReturn => {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    pageSize = 20,
    enableSearch = true
  } = options;

  // State
  const [items, setItems] = useState<LiveFeedItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Refs
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const service = LiveFeedService.getInstance();

  // Computed values
  const hasMore = currentPage < totalPages;

  /**
   * Load initial data
   */
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [liveFeedItems, events, news] = await Promise.all([
        service.getLiveFeedItems(1, pageSize),
        service.getUpcomingEvents(5),
        service.getLatestNews(5)
      ]);

      setItems(liveFeedItems);
      setUpcomingEvents(events);
      setLatestNews(news);
      setCurrentPage(1);
      setTotalPages(Math.ceil(liveFeedItems.length / pageSize));
      setTotalItems(liveFeedItems.length);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load live feed data';
      setError(errorMessage);
      console.error('Error loading live feed data:', err);
    } finally {
      setLoading(false);
    }
  }, [service, pageSize]);

  /**
   * Refresh data
   */
  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const [liveFeedItems, events, news] = await Promise.all([
        service.getLiveFeedItems(1, pageSize),
        service.getUpcomingEvents(5),
        service.getLatestNews(5)
      ]);

      setItems(liveFeedItems);
      setUpcomingEvents(events);
      setLatestNews(news);
      setCurrentPage(1);
      setTotalPages(Math.ceil(liveFeedItems.length / pageSize));
      setTotalItems(liveFeedItems.length);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh live feed data';
      setError(errorMessage);
      console.error('Error refreshing live feed data:', err);
    } finally {
      setRefreshing(false);
    }
  }, [service, pageSize]);

  /**
   * Load more data (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || refreshing) return;

    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const newItems = await service.getLiveFeedItems(nextPage, pageSize);
      
      setItems(prev => [...prev, ...newItems]);
      setCurrentPage(nextPage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more data';
      setError(errorMessage);
      console.error('Error loading more data:', err);
    } finally {
      setLoading(false);
    }
  }, [service, currentPage, pageSize, hasMore, loading, refreshing]);

  /**
   * Search live feed
   */
  const search = useCallback(async (query: string) => {
    if (!enableSearch || !query.trim()) return;

    try {
      setIsSearching(true);
      setError(null);
      setSearchQuery(query);

      const searchResults = await service.searchLiveFeed(query, 1, pageSize);
      
      setItems(searchResults);
      setCurrentPage(1);
      setTotalPages(Math.ceil(searchResults.length / pageSize));
      setTotalItems(searchResults.length);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search live feed';
      setError(errorMessage);
      console.error('Error searching live feed:', err);
    } finally {
      setIsSearching(false);
    }
  }, [service, pageSize, enableSearch]);

  /**
   * Clear search and return to normal feed
   */
  const clearSearch = useCallback(async () => {
    setSearchQuery('');
    setIsSearching(false);
    await refresh();
  }, [refresh]);

  /**
   * Set up auto-refresh
   */
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const setupAutoRefresh = () => {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
        
        refreshTimeoutRef.current = setTimeout(async () => {
          await refresh();
          setupAutoRefresh();
        }, refreshInterval);
      };

      setupAutoRefresh();

      return () => {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
      };
    }
    return undefined;
  }, [autoRefresh, refreshInterval, refresh]);

  /**
   * Load initial data on mount
   */
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Data
    items,
    upcomingEvents,
    latestNews,
    
    // Loading states
    loading,
    refreshing,
    error,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    hasMore,
    
    // Actions
    refresh,
    loadMore,
    search,
    clearSearch,
    
    // Search state
    searchQuery,
    isSearching,
    
    // Last updated
    lastUpdated
  };
};
