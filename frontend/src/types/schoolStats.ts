export interface SchoolStatsDisplay {
  id: string;
  label: string;
  value: string;
  icon: string;
  type: 'number' | 'percentage' | 'text';
}

export interface SchoolStatistic {
  id: string;
  key: string;
  value: string;
  label: string;
  icon: string;
  type: 'number' | 'percentage' | 'text';
  category: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStatisticData {
  key: string;
  value: string;
  label?: string;
  icon?: string;
  type?: 'number' | 'percentage' | 'text';
  order?: number;
  isVisible?: boolean;
}

export interface SchoolStatsResponse {
  success: boolean;
  data: SchoolStatsDisplay[] | SchoolStatistic[];
  message?: string;
  error?: string;
}

// Icon mapping for Material-UI icons
export const ICON_MAP: Record<string, string> = {
  'TrendingUp': 'TrendingUp',
  'People': 'People',
  'EmojiEvents': 'EmojiEvents',
  'Psychology': 'Psychology',
  'School': 'School',
  'Group': 'Group',
  'Sports': 'Sports',
  'Palette': 'Palette',
  'Numbers': 'Numbers',
  'AccountBalance': 'AccountBalance',
  'Book': 'Book',
  'Science': 'Science',
  'MusicNote': 'MusicNote',
  'TheaterComedy': 'TheaterComedy',
  'FitnessCenter': 'FitnessCenter',
  'VolunteerActivism': 'VolunteerActivism',
  'AutoStories': 'AutoStories',
  'Public': 'Public',
  'Language': 'Language',
  'Computer': 'Computer'
};

// Available icon options for admin interface
export const AVAILABLE_ICONS = [
  'TrendingUp',
  'People',
  'EmojiEvents',
  'Psychology',
  'School',
  'Group',
  'Sports',
  'Palette',
  'Numbers',
  'AccountBalance',
  'Book',
  'Science',
  'MusicNote',
  'TheaterComedy',
  'FitnessCenter',
  'VolunteerActivism',
  'AutoStories',
  'Public',
  'Language',
  'Computer'
];

// Statistic type options
export const STATISTIC_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'percentage', label: 'Percentage' }
] as const;

