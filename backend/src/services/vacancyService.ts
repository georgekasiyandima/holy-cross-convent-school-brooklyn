import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateVacancyData {
  title: string;
  department?: string;
  employmentType?: string;
  location?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  qualifications?: string[];
  salaryRange?: string;
  closingDate?: Date | string;
  startDate?: Date | string;
  isPublished?: boolean;
  isUrgent?: boolean;
  applicationEmail?: string;
  applicationInstructions?: string;
  order?: number;
}

export interface UpdateVacancyData extends Partial<CreateVacancyData> {
  id: string;
}

export class VacancyService {
  private static instance: VacancyService;

  public static getInstance(): VacancyService {
    if (!VacancyService.instance) {
      VacancyService.instance = new VacancyService();
    }
    return VacancyService.instance;
  }

  /**
   * Create a new vacancy
   */
  async createVacancy(data: CreateVacancyData) {
    const requirementsJson = data.requirements ? JSON.stringify(data.requirements) : null;
    const responsibilitiesJson = data.responsibilities ? JSON.stringify(data.responsibilities) : null;
    const qualificationsJson = data.qualifications ? JSON.stringify(data.qualifications) : null;

    return await prisma.vacancy.create({
      data: {
        title: data.title,
        department: data.department || 'TEACHING',
        employmentType: data.employmentType || 'FULL_TIME',
        location: data.location || 'Brooklyn, Cape Town',
        description: data.description,
        requirements: requirementsJson,
        responsibilities: responsibilitiesJson,
        qualifications: qualificationsJson,
        salaryRange: data.salaryRange || null,
        closingDate: data.closingDate ? new Date(data.closingDate) : null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        isPublished: data.isPublished || false,
        isUrgent: data.isUrgent || false,
        applicationEmail: data.applicationEmail || null,
        applicationInstructions: data.applicationInstructions || null,
        order: data.order || 0,
      },
    });
  }

  /**
   * Get all vacancies (with optional filtering)
   */
  async getAllVacancies(options: {
    publishedOnly?: boolean;
    department?: string;
    isUrgent?: boolean;
  } = {}) {
    const where: any = {};

    if (options.publishedOnly) {
      where.isPublished = true;
    }

    if (options.department) {
      where.department = options.department;
    }

    if (options.isUrgent !== undefined) {
      where.isUrgent = options.isUrgent;
    }

    const vacancies = await prisma.vacancy.findMany({
      where,
      orderBy: [
        { isUrgent: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // Parse JSON fields safely
    return vacancies.map(vacancy => {
      let requirements = null;
      let responsibilities = null;
      let qualifications = null;

      try {
        if (vacancy.requirements) {
          requirements = JSON.parse(vacancy.requirements);
        }
      } catch (e) {
        console.warn('Failed to parse requirements:', e);
      }

      try {
        if (vacancy.responsibilities) {
          responsibilities = JSON.parse(vacancy.responsibilities);
        }
      } catch (e) {
        console.warn('Failed to parse responsibilities:', e);
      }

      try {
        if (vacancy.qualifications) {
          qualifications = JSON.parse(vacancy.qualifications);
        }
      } catch (e) {
        console.warn('Failed to parse qualifications:', e);
      }

      return {
        ...vacancy,
        requirements,
        responsibilities,
        qualifications,
      };
    });
  }

  /**
   * Get a single vacancy by ID
   */
  async getVacancyById(id: string) {
    const vacancy = await prisma.vacancy.findUnique({
      where: { id },
    });

    if (!vacancy) return null;

    let requirements = null;
    let responsibilities = null;
    let qualifications = null;

    try {
      if (vacancy.requirements) {
        requirements = JSON.parse(vacancy.requirements);
      }
    } catch (e) {
      console.warn('Failed to parse requirements:', e);
    }

    try {
      if (vacancy.responsibilities) {
        responsibilities = JSON.parse(vacancy.responsibilities);
      }
    } catch (e) {
      console.warn('Failed to parse responsibilities:', e);
    }

    try {
      if (vacancy.qualifications) {
        qualifications = JSON.parse(vacancy.qualifications);
      }
    } catch (e) {
      console.warn('Failed to parse qualifications:', e);
    }

    return {
      ...vacancy,
      requirements,
      responsibilities,
      qualifications,
    };
  }

  /**
   * Update a vacancy
   */
  async updateVacancy(id: string, data: Partial<CreateVacancyData>) {
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.employmentType !== undefined) updateData.employmentType = data.employmentType;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.requirements !== undefined) updateData.requirements = data.requirements ? JSON.stringify(data.requirements) : null;
    if (data.responsibilities !== undefined) updateData.responsibilities = data.responsibilities ? JSON.stringify(data.responsibilities) : null;
    if (data.qualifications !== undefined) updateData.qualifications = data.qualifications ? JSON.stringify(data.qualifications) : null;
    if (data.salaryRange !== undefined) updateData.salaryRange = data.salaryRange;
    if (data.closingDate !== undefined) updateData.closingDate = data.closingDate ? new Date(data.closingDate) : null;
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.isUrgent !== undefined) updateData.isUrgent = data.isUrgent;
    if (data.applicationEmail !== undefined) updateData.applicationEmail = data.applicationEmail;
    if (data.applicationInstructions !== undefined) updateData.applicationInstructions = data.applicationInstructions;
    if (data.order !== undefined) updateData.order = data.order;

    const updated = await prisma.vacancy.update({
      where: { id },
      data: updateData,
    });

    let requirements = null;
    let responsibilities = null;
    let qualifications = null;

    try {
      if (updated.requirements) {
        requirements = JSON.parse(updated.requirements);
      }
    } catch (e) {
      console.warn('Failed to parse requirements:', e);
    }

    try {
      if (updated.responsibilities) {
        responsibilities = JSON.parse(updated.responsibilities);
      }
    } catch (e) {
      console.warn('Failed to parse responsibilities:', e);
    }

    try {
      if (updated.qualifications) {
        qualifications = JSON.parse(updated.qualifications);
      }
    } catch (e) {
      console.warn('Failed to parse qualifications:', e);
    }

    return {
      ...updated,
      requirements,
      responsibilities,
      qualifications,
    };
  }

  /**
   * Delete a vacancy
   */
  async deleteVacancy(id: string) {
    return await prisma.vacancy.delete({
      where: { id },
    });
  }

  /**
   * Get published vacancies (public endpoint)
   */
  async getPublishedVacancies() {
    const vacancies = await prisma.vacancy.findMany({
      where: {
        isPublished: true,
        OR: [
          { closingDate: null },
          { closingDate: { gte: new Date() } },
        ],
      },
      orderBy: [
        { isUrgent: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return vacancies.map(vacancy => {
      let requirements = null;
      let responsibilities = null;
      let qualifications = null;

      try {
        if (vacancy.requirements) {
          requirements = JSON.parse(vacancy.requirements);
        }
      } catch (e) {
        console.warn('Failed to parse requirements:', e);
      }

      try {
        if (vacancy.responsibilities) {
          responsibilities = JSON.parse(vacancy.responsibilities);
        }
      } catch (e) {
        console.warn('Failed to parse responsibilities:', e);
      }

      try {
        if (vacancy.qualifications) {
          qualifications = JSON.parse(vacancy.qualifications);
        }
      } catch (e) {
        console.warn('Failed to parse qualifications:', e);
      }

      return {
        ...vacancy,
        requirements,
        responsibilities,
        qualifications,
      };
    });
  }
}

export default VacancyService.getInstance();

