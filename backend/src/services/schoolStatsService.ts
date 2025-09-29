import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export interface SchoolStatsDisplay {
  id: string;
  label: string;
  value: string;
  icon: string;
  type: 'number' | 'percentage' | 'text';
}

export class SchoolStatsService {
  private static instance: SchoolStatsService;

  public static getInstance(): SchoolStatsService {
    if (!SchoolStatsService.instance) {
      SchoolStatsService.instance = new SchoolStatsService();
    }
    return SchoolStatsService.instance;
  }

  /**
   * Get all visible statistics for display
   */
  async getVisibleStats(): Promise<SchoolStatsDisplay[]> {
    try {
      const stats = await prisma.schoolInfo.findMany({
        where: {
          category: 'statistics',
          isPublic: true
        },
        orderBy: {
          order: 'asc'
        }
      });

      return stats.map(stat => ({
        id: stat.id,
        label: this.extractLabel(stat.key),
        value: stat.value,
        icon: this.extractIcon(stat.key),
        type: this.extractType(stat.key)
      }));
    } catch (error) {
      console.error('Error fetching school statistics:', error);
      throw new Error('Failed to fetch school statistics');
    }
  }

  /**
   * Get all statistics for admin management
   */
  async getAllStats(): Promise<SchoolStatistic[]> {
    try {
      const stats = await prisma.schoolInfo.findMany({
        where: {
          category: 'statistics'
        },
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      return stats.map(stat => ({
        id: stat.id,
        key: stat.key,
        value: stat.value,
        label: this.extractLabel(stat.key),
        icon: this.extractIcon(stat.key),
        type: this.extractType(stat.key),
        category: stat.category,
        order: stat.order,
        isVisible: stat.isPublic,
        createdAt: stat.createdAt,
        updatedAt: stat.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching all school statistics:', error);
      throw new Error('Failed to fetch school statistics');
    }
  }

  /**
   * Create or update a statistic
   */
  async upsertStatistic(statData: {
    key: string;
    value: string;
    label?: string;
    icon?: string;
    type?: 'number' | 'percentage' | 'text';
    order?: number;
    isVisible?: boolean;
  }): Promise<SchoolStatistic> {
    try {
      const existingStat = await prisma.schoolInfo.findUnique({
        where: { key: statData.key }
      });

      if (existingStat) {
        // Update existing
        const updatedStat = await prisma.schoolInfo.update({
          where: { key: statData.key },
          data: {
            value: statData.value,
            type: statData.type || 'text',
            order: statData.order ?? existingStat.order,
            isPublic: statData.isVisible ?? existingStat.isPublic,
            updatedAt: new Date()
          }
        });

        return {
          id: updatedStat.id,
          key: updatedStat.key,
          value: updatedStat.value,
          label: this.extractLabel(updatedStat.key),
          icon: this.extractIcon(updatedStat.key),
          type: this.extractType(updatedStat.key),
          category: updatedStat.category,
          order: updatedStat.order,
          isVisible: updatedStat.isPublic,
          createdAt: updatedStat.createdAt,
          updatedAt: updatedStat.updatedAt
        };
      } else {
        // Create new
        const newStat = await prisma.schoolInfo.create({
          data: {
            key: statData.key,
            value: statData.value,
            type: statData.type || 'text',
            category: 'statistics',
            order: statData.order ?? 0,
            isPublic: statData.isVisible ?? true
          }
        });

        return {
          id: newStat.id,
          key: newStat.key,
          value: newStat.value,
          label: this.extractLabel(newStat.key),
          icon: this.extractIcon(newStat.key),
          type: this.extractType(newStat.key),
          category: newStat.category,
          order: newStat.order,
          isVisible: newStat.isPublic,
          createdAt: newStat.createdAt,
          updatedAt: newStat.updatedAt
        };
      }
    } catch (error) {
      console.error('Error upserting school statistic:', error);
      throw new Error('Failed to save school statistic');
    }
  }

  /**
   * Delete a statistic
   */
  async deleteStatistic(key: string): Promise<void> {
    try {
      await prisma.schoolInfo.delete({
        where: { key }
      });
    } catch (error) {
      console.error('Error deleting school statistic:', error);
      throw new Error('Failed to delete school statistic');
    }
  }

  /**
   * Initialize default statistics
   */
  async initializeDefaultStats(): Promise<void> {
    const defaultStats = [
      {
        key: 'years_of_excellence',
        value: '64+',
        label: 'Years of Excellence',
        icon: 'TrendingUp',
        type: 'text' as const,
        order: 1,
        isVisible: true
      },
      {
        key: 'total_students',
        value: '300+',
        label: 'Students',
        icon: 'People',
        type: 'text' as const,
        order: 2,
        isVisible: true
      },
      {
        key: 'academic_success',
        value: '95%',
        label: 'Academic Success',
        icon: 'EmojiEvents',
        type: 'percentage' as const,
        order: 3,
        isVisible: true
      },
      {
        key: 'character_development',
        value: '100%',
        label: 'Character Development',
        icon: 'Psychology',
        type: 'percentage' as const,
        order: 4,
        isVisible: true
      }
    ];

    for (const stat of defaultStats) {
      await this.upsertStatistic(stat);
    }
  }

  /**
   * Extract label from key
   */
  private extractLabel(key: string): string {
    const labelMap: Record<string, string> = {
      'years_of_excellence': 'Years of Excellence',
      'total_students': 'Students',
      'academic_success': 'Academic Success',
      'character_development': 'Character Development',
      'graduation_rate': 'Graduation Rate',
      'teacher_ratio': 'Teacher to Student Ratio',
      'sports_achievements': 'Sports Achievements',
      'cultural_events': 'Cultural Events'
    };
    return labelMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Extract icon from key
   */
  private extractIcon(key: string): string {
    const iconMap: Record<string, string> = {
      'years_of_excellence': 'TrendingUp',
      'total_students': 'People',
      'academic_success': 'EmojiEvents',
      'character_development': 'Psychology',
      'graduation_rate': 'School',
      'teacher_ratio': 'Group',
      'sports_achievements': 'Sports',
      'cultural_events': 'Palette'
    };
    return iconMap[key] || 'Numbers';
  }

  /**
   * Extract type from key
   */
  private extractType(key: string): 'number' | 'percentage' | 'text' {
    if (key.includes('success') || key.includes('rate') || key.includes('percentage')) {
      return 'percentage';
    }
    if (key.includes('students') || key.includes('teachers') || key.includes('years')) {
      return 'number';
    }
    return 'text';
  }
}

