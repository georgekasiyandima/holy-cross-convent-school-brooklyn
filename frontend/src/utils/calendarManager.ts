/**
 * Calendar Management System for Holy Cross Convent School
 * 
 * This system manages school events, holidays, and important dates
 * with support for different event types and categories.
 */

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  dayOfWeek: string;
  description?: string;
  category: EventCategory;
  type: EventType;
  isPublicHoliday?: boolean;
  isSchoolHoliday?: boolean;
  isSpecialEvent?: boolean;
  gradeLevel?: string;
  location?: string;
  time?: string;
  facebookLink?: string;
}

export type EventCategory = 
  | 'academic'
  | 'spiritual'
  | 'cultural'
  | 'sports'
  | 'community'
  | 'holiday'
  | 'extra-mural'
  | 'celebration';

export type EventType = 
  | 'school-event'
  | 'public-holiday'
  | 'church-holiday'
  | 'extra-mural'
  | 'celebration'
  | 'academic'
  | 'cultural';

export interface CalendarMonth {
  month: string;
  year: number;
  events: CalendarEvent[];
}

export interface CalendarYear {
  year: number;
  terms: {
    term1?: CalendarTerm;
    term2?: CalendarTerm;
    term3?: CalendarTerm;
    term4?: CalendarTerm;
  };
}

export interface CalendarTerm {
  termNumber: number;
  startDate: string;
  endDate: string;
  events: CalendarEvent[];
  description?: string;
}

/**
 * Term 3 2025 Important Dates
 */
export const term3Events: CalendarEvent[] = [
  // July 2025
  {
    id: 'term3-start',
    title: 'School opens for Term 3',
    date: '2025-07-22',
    dayOfWeek: 'Tuesday',
    description: 'First day of Term 3',
    category: 'academic',
    type: 'school-event',
    isSchoolHoliday: false
  },
  {
    id: 'extra-murals-start',
    title: 'Term 3 Extra-Murals start',
    date: '2025-07-28',
    dayOfWeek: 'Monday',
    description: 'Extra-mural activities begin for Term 3',
    category: 'extra-mural',
    type: 'extra-mural',
    isSchoolHoliday: false
  },
  {
    id: 'cool-dude-day',
    title: 'Cool Dude Day',
    date: '2025-07-31',
    dayOfWeek: 'Thursday',
    description: 'Celebrating a special man in your life - Gr R to Gr 3',
    category: 'celebration',
    type: 'celebration',
    gradeLevel: 'Grade R to Grade 3',
    isSchoolHoliday: false
  },

  // August 2025
  {
    id: 'cso-choir-festival',
    title: 'CSO Choir Festival',
    date: '2025-08-17',
    dayOfWeek: 'Sunday',
    description: 'Catholic Schools Office Choir Festival',
    category: 'spiritual',
    type: 'celebration',
    isSchoolHoliday: false
  },
  {
    id: 'special-woman-day',
    title: 'Celebrating a Special Woman in your life',
    date: '2025-08-21',
    dayOfWeek: 'Thursday',
    description: 'Celebrating a special woman in your life - Gr R to Gr 3',
    category: 'celebration',
    type: 'celebration',
    gradeLevel: 'Grade R to Grade 3',
    isSchoolHoliday: false
  },
  {
    id: 'womens-high-tea',
    title: 'Women\'s High Tea',
    date: '2025-08-30',
    dayOfWeek: 'Saturday',
    description: 'Women\'s High Tea event',
    category: 'community',
    type: 'celebration',
    isSchoolHoliday: false
  },

  // September 2025
  {
    id: 'science-expo-grade3-4',
    title: 'Science Expo - Grade 3 and 4',
    date: '2025-09-03',
    dayOfWeek: 'Wednesday',
    description: 'Science Expo for Grade 3 and 4 students',
    category: 'academic',
    type: 'academic',
    gradeLevel: 'Grade 3 and 4',
    isSchoolHoliday: false
  },
  {
    id: 'science-expo-grade5-6',
    title: 'Science Expo - Grade 5 and 6',
    date: '2025-09-04',
    dayOfWeek: 'Thursday',
    description: 'Science Expo for Grade 5 and 6 students',
    category: 'academic',
    type: 'academic',
    gradeLevel: 'Grade 5 and 6',
    isSchoolHoliday: false
  },
  {
    id: 'grade7-market-day',
    title: 'Grade 7 Market Day & Spring Civies',
    date: '2025-09-05',
    dayOfWeek: 'Friday',
    description: 'Grade 7 Market Day with Spring Civies',
    category: 'academic',
    type: 'academic',
    gradeLevel: 'Grade 7',
    isSchoolHoliday: false
  },
  {
    id: 'feast-triumph-cross',
    title: 'Feast of the Triumph of the Cross',
    date: '2025-09-14',
    dayOfWeek: 'Sunday',
    description: 'School\'s Feast Day - Feast of the Triumph of the Cross',
    category: 'spiritual',
    type: 'church-holiday',
    isSchoolHoliday: false
  },
  {
    id: 'heritage-day',
    title: 'Heritage Day',
    date: '2025-09-24',
    dayOfWeek: 'Wednesday',
    description: 'Heritage Day - Public Holiday',
    category: 'cultural',
    type: 'public-holiday',
    isPublicHoliday: true,
    isSchoolHoliday: true
  },
  {
    id: 'extra-murals-end',
    title: 'Last Day of Extra-Murals',
    date: '2025-09-26',
    dayOfWeek: 'Friday',
    description: 'Last day of extra-mural activities for Term 3',
    category: 'extra-mural',
    type: 'extra-mural',
    isSchoolHoliday: false
  },

  // October 2025
  {
    id: 'term3-end',
    title: 'Term 3 ends',
    date: '2025-10-03',
    dayOfWeek: 'Thursday',
    description: 'Last day of Term 3',
    category: 'academic',
    type: 'school-event',
    isSchoolHoliday: false
  }
];

/**
 * Term 3 2025 Information
 */
export const term3Info: CalendarTerm = {
  termNumber: 3,
  startDate: '2025-07-22',
  endDate: '2025-10-03',
  events: term3Events,
  description: 'Term 3 2025 - Important dates and events for Holy Cross Convent School Brooklyn'
};

/**
 * Calendar Year 2025
 */
export const calendar2025: CalendarYear = {
  year: 2025,
  terms: {
    term3: term3Info
  }
};

/**
 * Utility functions for calendar management
 */
export const calendarManager = {
  /**
   * Get all events for a specific month
   */
  getEventsByMonth: (month: number, year: number): CalendarEvent[] => {
    return term3Events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === month - 1 && eventDate.getFullYear() === year;
    });
  },

  /**
   * Get events by category
   */
  getEventsByCategory: (category: EventCategory): CalendarEvent[] => {
    return term3Events.filter(event => event.category === category);
  },

  /**
   * Get events by type
   */
  getEventsByType: (type: EventType): CalendarEvent[] => {
    return term3Events.filter(event => event.type === type);
  },

  /**
   * Get upcoming events (from today)
   */
  getUpcomingEvents: (): CalendarEvent[] => {
    const today = new Date();
    return term3Events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  /**
   * Get events for a specific date
   */
  getEventsByDate: (date: string): CalendarEvent[] => {
    return term3Events.filter(event => event.date === date);
  },

  /**
   * Get events for a specific grade level
   */
  getEventsByGradeLevel: (gradeLevel: string): CalendarEvent[] => {
    return term3Events.filter(event => 
      event.gradeLevel?.toLowerCase().includes(gradeLevel.toLowerCase())
    );
  },

  /**
   * Get public holidays
   */
  getPublicHolidays: (): CalendarEvent[] => {
    return term3Events.filter(event => event.isPublicHoliday);
  },

  /**
   * Get school events (non-holidays)
   */
  getSchoolEvents: (): CalendarEvent[] => {
    return term3Events.filter(event => !event.isPublicHoliday && !event.isSchoolHoliday);
  },

  /**
   * Get extra-mural events
   */
  getExtraMuralEvents: (): CalendarEvent[] => {
    return term3Events.filter(event => event.category === 'extra-mural');
  },

  /**
   * Get spiritual events
   */
  getSpiritualEvents: (): CalendarEvent[] => {
    return term3Events.filter(event => event.category === 'spiritual');
  },

  /**
   * Get academic events
   */
  getAcademicEvents: (): CalendarEvent[] => {
    return term3Events.filter(event => event.category === 'academic');
  },

  /**
   * Get celebration events
   */
  getCelebrationEvents: (): CalendarEvent[] => {
    return term3Events.filter(event => event.category === 'celebration');
  },

  /**
   * Search events by title or description
   */
  searchEvents: (query: string): CalendarEvent[] => {
    const lowerQuery = query.toLowerCase();
    return term3Events.filter(event => 
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description?.toLowerCase().includes(lowerQuery) ||
      event.gradeLevel?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Get total event count
   */
  getTotalEventCount: (): number => {
    return term3Events.length;
  },

  /**
   * Get events count by category
   */
  getEventCountByCategory: (): Record<EventCategory, number> => {
    const counts: Record<EventCategory, number> = {
      academic: 0,
      spiritual: 0,
      cultural: 0,
      sports: 0,
      community: 0,
      holiday: 0,
      'extra-mural': 0,
      celebration: 0
    };

    term3Events.forEach(event => {
      counts[event.category]++;
    });

    return counts;
  },

  /**
   * Format date for display
   */
  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Get month name
   */
  getMonthName: (month: number): string => {
    const date = new Date(2025, month - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long' });
  }
};

export default calendarManager; 