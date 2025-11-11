import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const BASE = API_BASE_URL;

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: 'TERM_START' | 'TERM_END' | 'HOLIDAY' | 'EXAM' | 'SPORTS_DAY' | 'CULTURAL_DAY' | 'PARENT_MEETING' | 'OTHER';
  isHoliday: boolean;
  isExam: boolean;
  isPublicHoliday: boolean;
  grade: string;
  category?: string;
  location?: string;
  time?: string;
  facebookLink?: string;
  termId?: string;
  term?: Term;
  createdAt: string;
  updatedAt: string;
}

export interface Term {
  id: string;
  year: number;
  termNumber: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description?: string;
  events?: CalendarEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
  events: CalendarEvent[];
}

export interface CalendarFilters {
  year?: number;
  month?: number;
  termId?: string;
  category?: string;
  type?: string;
  grade?: string;
  startDate?: string;
  endDate?: string;
}

class EnhancedCalendarService {
  private static instance: EnhancedCalendarService;

  public static getInstance(): EnhancedCalendarService {
    if (!EnhancedCalendarService.instance) {
      EnhancedCalendarService.instance = new EnhancedCalendarService();
    }
    return EnhancedCalendarService.instance;
  }

  private constructor() {}

  // Get all terms
  async getTerms(year?: number): Promise<Term[]> {
    try {
      const url = year ? `${BASE}/api/calendar/terms?year=${year}` : `${BASE}/api/calendar/terms`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching terms:', error);
      throw new Error('Failed to fetch terms');
    }
  }

  // Get active term
  async getActiveTerm(): Promise<Term | null> {
    try {
      const response = await axios.get(`${BASE}/api/calendar/terms/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active term:', error);
      return null;
    }
  }

  // Get calendar events with filters (uses unified endpoint)
  async getEvents(filters: CalendarFilters = {}): Promise<CalendarEvent[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      // Use unified school-hub endpoint
      const url = `${BASE}/api/school-hub/events${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axios.get(url);
      
      // Transform unified events to CalendarEvent format
      if (response.data.success && response.data.data) {
        return response.data.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          startDate: new Date(event.startDate).toISOString(),
          endDate: event.endDate ? new Date(event.endDate).toISOString() : new Date(event.startDate).toISOString(),
          type: event.type || 'OTHER',
          isHoliday: event.isHoliday || false,
          isExam: event.isExam || false,
          isPublicHoliday: event.isPublicHoliday || false,
          grade: event.grade || 'all',
          category: event.category || 'academic',
          location: event.location || '',
          time: event.time || '',
          facebookLink: event.facebookLink || '',
          termId: event.termId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
      }
      
      // Fallback to old format if response is not unified format
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to old endpoint
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
        const fallbackUrl = `${BASE}/api/calendar/events${params.toString() ? `?${params.toString()}` : ''}`;
        const fallbackResponse = await axios.get(fallbackUrl);
        return fallbackResponse.data;
      } catch (fallbackError) {
        throw new Error('Failed to fetch events');
      }
    }
  }

  // Get upcoming events (uses unified endpoint)
  async getUpcomingEvents(limit: number = 10): Promise<CalendarEvent[]> {
    try {
      // Use unified school-hub endpoint
      const response = await axios.get(`${BASE}/api/school-hub/events/upcoming?limit=${limit}`);
      
      // Transform unified events to CalendarEvent format
      if (response.data.success && response.data.data) {
        return response.data.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          startDate: new Date(event.startDate).toISOString(),
          endDate: event.endDate ? new Date(event.endDate).toISOString() : new Date(event.startDate).toISOString(),
          type: event.type || 'OTHER',
          isHoliday: event.isHoliday || false,
          isExam: event.isExam || false,
          isPublicHoliday: event.isPublicHoliday || false,
          grade: event.grade || 'all',
          category: event.category || 'academic',
          location: event.location || '',
          time: event.time || '',
          facebookLink: event.facebookLink || '',
          termId: event.termId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
      }
      
      // Fallback to old format
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      // Fallback to old endpoint
      try {
        const fallbackResponse = await axios.get(`${BASE}/api/calendar/events/upcoming?limit=${limit}`);
        return fallbackResponse.data;
      } catch (fallbackError) {
        throw new Error('Failed to fetch upcoming events');
      }
    }
  }

  // Get events by date range (uses unified endpoint)
  async getEventsByDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    try {
      // Use unified school-hub endpoint
      const response = await axios.get(`${BASE}/api/school-hub/events?startDate=${startDate}&endDate=${endDate}`);
      
      // Transform unified events to CalendarEvent format
      if (response.data.success && response.data.data) {
        return response.data.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          startDate: new Date(event.startDate).toISOString(),
          endDate: event.endDate ? new Date(event.endDate).toISOString() : new Date(event.startDate).toISOString(),
          type: event.type || 'OTHER',
          isHoliday: event.isHoliday || false,
          isExam: event.isExam || false,
          isPublicHoliday: event.isPublicHoliday || false,
          grade: event.grade || 'all',
          category: event.category || 'academic',
          location: event.location || '',
          time: event.time || '',
          facebookLink: event.facebookLink || '',
          termId: event.termId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
      }
      
      // Fallback to old format
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      // Fallback to old endpoint
      try {
        const fallbackResponse = await axios.get(`${BASE}/api/calendar/events/range?startDate=${startDate}&endDate=${endDate}`);
        return fallbackResponse.data;
      } catch (fallbackError) {
        throw new Error('Failed to fetch events by date range');
      }
    }
  }

  // Get events for a specific month
  async getEventsByMonth(year: number, month: number): Promise<CalendarEvent[]> {
    return this.getEvents({ year, month });
  }

  // Get events for a specific term
  async getEventsByTerm(termId: string): Promise<CalendarEvent[]> {
    return this.getEvents({ termId });
  }

  // Get events by category
  async getEventsByCategory(category: string): Promise<CalendarEvent[]> {
    return this.getEvents({ category });
  }

  // Get events by grade
  async getEventsByGrade(grade: string): Promise<CalendarEvent[]> {
    return this.getEvents({ grade });
  }

  // Create a new event
  async createEvent(eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const response = await axios.post(`${BASE}/api/calendar/events`, eventData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  // Update an event
  async updateEvent(id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const response = await axios.put(`${BASE}/api/calendar/events/${id}`, eventData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  // Delete an event
  async deleteEvent(id: string): Promise<void> {
    try {
      await axios.delete(`${BASE}/api/calendar/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  // Create a new term
  async createTerm(termData: Partial<Term>): Promise<Term> {
    try {
      const response = await axios.post(`${BASE}/api/calendar/terms`, termData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating term:', error);
      throw new Error('Failed to create term');
    }
  }

  // Update a term
  async updateTerm(id: string, termData: Partial<Term>): Promise<Term> {
    try {
      const response = await axios.put(`${BASE}/api/calendar/terms/${id}`, termData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating term:', error);
      throw new Error('Failed to update term');
    }
  }

  // Activate a term
  async activateTerm(id: string): Promise<Term> {
    try {
      const response = await axios.patch(`${BASE}/api/calendar/terms/${id}/activate`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error activating term:', error);
      throw new Error('Failed to activate term');
    }
  }

  // Generate calendar month
  generateCalendarMonth(year: number, month: number, events: CalendarEvent[]): CalendarMonth {
    const firstDay = new Date(year, month - 1, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);
    const today = new Date();
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.toDateString() === currentDate.toDateString();
      });
      
      days.push({
        date: new Date(currentDate),
        events: dayEvents,
        isCurrentMonth: currentDate.getMonth() === month - 1,
        isToday: currentDate.toDateString() === today.toDateString(),
        isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      year,
      month,
      days,
      events
    };
  }

  // Get event color based on category
  getEventColor(category: string): string {
    const colors: { [key: string]: string } = {
      'academic': '#1976d2',
      'spiritual': '#9c27b0',
      'cultural': '#2e7d32',
      'sports': '#ed6c02',
      'community': '#0288d1'
    };
    return colors[category] || '#757575';
  }

  // Get event icon based on type
  getEventIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'TERM_START': '🏫',
      'TERM_END': '🎓',
      'HOLIDAY': '🏖️',
      'EXAM': '📝',
      'SPORTS_DAY': '⚽',
      'CULTURAL_DAY': '🎭',
      'PARENT_MEETING': '👥',
      'OTHER': '📅'
    };
    return icons[type] || '📅';
  }

  // Format date for display
  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-ZA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Format time for display
  formatTime(time?: string): string {
    if (!time) return '';
    return time;
  }

  // Check if event is today
  isToday(date: string | Date): boolean {
    const today = new Date();
    const eventDate = new Date(date);
    return today.toDateString() === eventDate.toDateString();
  }

  // Check if event is upcoming
  isUpcoming(date: string | Date): boolean {
    const today = new Date();
    const eventDate = new Date(date);
    return eventDate > today;
  }

  // Check if event is past
  isPast(date: string | Date): boolean {
    const today = new Date();
    const eventDate = new Date(date);
    return eventDate < today;
  }
}

export default EnhancedCalendarService.getInstance();
