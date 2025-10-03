import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  category: string;
  type: 'academic' | 'sports' | 'cultural' | 'holiday' | 'exam' | 'meeting' | 'other';
  isAllDay: boolean;
  isPublished: boolean;
  color?: string;
  author: {
    id: string;
    name: string;
  };
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

export interface CalendarView {
  type: 'month' | 'week' | 'day';
  currentDate: Date;
  events: CalendarEvent[];
}

class CalendarService {
  private static instance: CalendarService;

  public static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  /**
   * Get events for a specific month
   */
  async getEventsForMonth(year: number, month: number): Promise<CalendarEvent[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`, {
        params: {
          year,
          month,
          published: 'true'
        }
      });

      if (response.data.success) {
        return response.data.data.events;
      }
      throw new Error('Failed to fetch calendar events');
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  /**
   * Get events for a specific date range
   */
  async getEventsForDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`, {
        params: {
          startDate,
          endDate,
          published: 'true'
        }
      });

      if (response.data.success) {
        return response.data.data.events;
      }
      throw new Error('Failed to fetch calendar events');
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  /**
   * Get events for today
   */
  async getTodayEvents(): Promise<CalendarEvent[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    return this.getEventsForDateRange(
      startOfDay.toISOString(),
      endOfDay.toISOString()
    );
  }

  /**
   * Get upcoming events (next 7 days)
   */
  async getUpcomingEvents(limit: number = 10): Promise<CalendarEvent[]> {
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
   * Get events by category
   */
  async getEventsByCategory(category: string): Promise<CalendarEvent[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`, {
        params: {
          category,
          published: 'true'
        }
      });

      if (response.data.success) {
        return response.data.data.events;
      }
      throw new Error('Failed to fetch events by category');
    } catch (error) {
      console.error('Error fetching events by category:', error);
      throw new Error('Failed to fetch events by category');
    }
  }

  /**
   * Get a single event by ID
   */
  async getEventById(id: string): Promise<CalendarEvent> {
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
   * Create a new calendar event (admin only)
   */
  async createEvent(eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/events`, eventData);
      
      if (response.data.success) {
        return response.data.data.event;
      }
      throw new Error('Failed to create event');
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  /**
   * Update an existing event (admin only)
   */
  async updateEvent(id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/events/${id}`, eventData);
      
      if (response.data.success) {
        return response.data.data.event;
      }
      throw new Error('Failed to update event');
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  /**
   * Delete an event (admin only)
   */
  async deleteEvent(id: string): Promise<void> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/events/${id}`);
      
      if (!response.data.success) {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  /**
   * Generate calendar month data
   */
  generateCalendarMonth(year: number, month: number, events: CalendarEvent[]): CalendarMonth {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);

    // Generate 42 days (6 weeks) to fill the calendar
    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.toDateString() === currentDate.toDateString();
      });

      days.push({
        date: new Date(currentDate),
        events: dayEvents,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === new Date().toDateString(),
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

  /**
   * Get event color based on category
   */
  getEventColor(category: string): string {
    switch (category.toLowerCase()) {
      case 'academic':
        return '#2196f3';
      case 'sports':
        return '#4caf50';
      case 'cultural':
        return '#9c27b0';
      case 'holiday':
        return '#ff9800';
      case 'exam':
        return '#f44336';
      case 'meeting':
        return '#607d8b';
      default:
        return '#1a237e';
    }
  }

  /**
   * Get event icon based on type
   */
  getEventIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'academic':
        return 'school';
      case 'sports':
        return 'sports_soccer';
      case 'cultural':
        return 'celebration';
      case 'holiday':
        return 'event';
      case 'exam':
        return 'quiz';
      case 'meeting':
        return 'groups';
      default:
        return 'event';
    }
  }
}

export default CalendarService;



