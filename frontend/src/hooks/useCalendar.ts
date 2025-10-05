import { useState, useEffect, useCallback } from 'react';
import EnhancedCalendarService, { CalendarEvent, CalendarMonth, CalendarDay } from '../services/enhancedCalendarService';

export interface UseCalendarOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  initialView?: 'month' | 'week' | 'day';
  initialDate?: Date;
}

export interface UseCalendarReturn {
  // Data
  currentMonth: CalendarMonth | null;
  todayEvents: CalendarEvent[];
  upcomingEvents: CalendarEvent[];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Current view state
  currentDate: Date;
  viewType: 'month' | 'week' | 'day';
  
  // Actions
  navigateToMonth: (year: number, month: number) => Promise<void>;
  navigateToDate: (date: Date) => Promise<void>;
  changeView: (view: 'month' | 'week' | 'day') => void;
  refresh: () => Promise<void>;
  
  // Event management
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForDay: (day: CalendarDay) => CalendarEvent[];
  
  // Navigation helpers
  goToPreviousMonth: () => Promise<void>;
  goToNextMonth: () => Promise<void>;
  goToToday: () => Promise<void>;
  
  // Last updated
  lastUpdated: Date | null;
}

export const useCalendar = (options: UseCalendarOptions = {}): UseCalendarReturn => {
  const {
    autoRefresh = true,
    refreshInterval = 60000, // 1 minute
    initialView = 'month',
    initialDate = new Date()
  } = options;

  // State
  const [currentMonth, setCurrentMonth] = useState<CalendarMonth | null>(null);
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>(initialView);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Service instance
  const service = EnhancedCalendarService;

  /**
   * Load calendar data for current month
   */
  const loadCalendarData = useCallback(async (year: number, month: number) => {
    try {
      setLoading(true);
      setError(null);

      const [monthEvents, upcomingEventsData] = await Promise.all([
        service.getEventsByMonth(year, month),
        service.getUpcomingEvents(10)
      ]);

      // Create a simple calendar month structure
      const calendarMonth: CalendarMonth = {
        year,
        month,
        days: [], // This would need to be populated with actual calendar days
        events: monthEvents
      };
      
      setCurrentMonth(calendarMonth);
      setUpcomingEvents(upcomingEventsData);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load calendar data';
      setError(errorMessage);
      console.error('Error loading calendar data:', err);
    } finally {
      setLoading(false);
    }
  }, [service]);

  /**
   * Navigate to specific month
   */
  const navigateToMonth = useCallback(async (year: number, month: number) => {
    setCurrentDate(new Date(year, month, 1));
    await loadCalendarData(year, month);
  }, [loadCalendarData]);

  /**
   * Navigate to specific date
   */
  const navigateToDate = useCallback(async (date: Date) => {
    setCurrentDate(date);
    await loadCalendarData(date.getFullYear(), date.getMonth());
  }, [loadCalendarData]);

  /**
   * Change view type
   */
  const changeView = useCallback((view: 'month' | 'week' | 'day') => {
    setViewType(view);
  }, []);

  /**
   * Refresh calendar data
   */
  const refresh = useCallback(async () => {
    await loadCalendarData(currentDate.getFullYear(), currentDate.getMonth());
  }, [loadCalendarData, currentDate]);

  /**
   * Get events for a specific date
   */
  const getEventsForDate = useCallback((date: Date): CalendarEvent[] => {
    if (!currentMonth) return [];
    
    const day = currentMonth.days.find((d: any) => 
      d.date.toDateString() === date.toDateString()
    );
    
    return day ? day.events : [];
  }, [currentMonth]);

  /**
   * Get events for a specific day
   */
  const getEventsForDay = useCallback((day: CalendarDay): CalendarEvent[] => {
    return day.events;
  }, []);

  /**
   * Navigate to previous month
   */
  const goToPreviousMonth = useCallback(async () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    await navigateToMonth(prevMonth.getFullYear(), prevMonth.getMonth());
  }, [navigateToMonth, currentDate]);

  /**
   * Navigate to next month
   */
  const goToNextMonth = useCallback(async () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await navigateToMonth(nextMonth.getFullYear(), nextMonth.getMonth());
  }, [navigateToMonth, currentDate]);

  /**
   * Navigate to today
   */
  const goToToday = useCallback(async () => {
    const today = new Date();
    await navigateToDate(today);
  }, [navigateToDate]);

  /**
   * Set up auto-refresh
   */
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        refresh();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh, refreshInterval, refresh]);

  /**
   * Load initial data
   */
  useEffect(() => {
    loadCalendarData(currentDate.getFullYear(), currentDate.getMonth());
  }, [loadCalendarData, currentDate]);

  return {
    // Data
    currentMonth,
    todayEvents,
    upcomingEvents,
    
    // Loading states
    loading,
    error,
    
    // Current view state
    currentDate,
    viewType,
    
    // Actions
    navigateToMonth,
    navigateToDate,
    changeView,
    refresh,
    
    // Event management
    getEventsForDate,
    getEventsForDay,
    
    // Navigation helpers
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    
    // Last updated
    lastUpdated
  };
};
