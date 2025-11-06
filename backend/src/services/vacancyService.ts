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

    // Schema only has: id, title, description, requirements, department, isActive, createdAt, updatedAt
    // Store all extra data in requirements JSON
    const allData = {
      responsibilities: data.responsibilities,
      qualifications: data.qualifications,
      employmentType: data.employmentType,
      location: data.location,
      salaryRange: data.salaryRange,
      closingDate: data.closingDate,
      startDate: data.startDate,
      isPublished: data.isPublished,
      isUrgent: data.isUrgent,
      applicationEmail: data.applicationEmail,
      applicationInstructions: data.applicationInstructions,
      order: data.order,
    };
    const combinedRequirements = JSON.stringify({
      requirements: data.requirements || [],
      ...allData
    });

    return await prisma.vacancy.create({
      data: {
        title: data.title,
        department: data.department || 'TEACHING',
        description: data.description,
        requirements: combinedRequirements,
        isActive: data.isPublished !== false, // Map isPublished to isActive
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
      where.isActive = true; // Map isPublished to isActive
    }

    if (options.department) {
      where.department = options.department;
    }

    // Note: isUrgent filtering would need to be done in memory after fetching
    // since it's stored in requirements JSON

    const vacancies = await prisma.vacancy.findMany({
      where,
      orderBy: [
        { createdAt: 'desc' },
      ],
    });

    // Parse JSON fields safely
    return vacancies.map(vacancy => {
      let requirementsData: any = {};
      let requirements = null;
      let responsibilities = null;
      let qualifications = null;

      try {
        if (vacancy.requirements) {
          requirementsData = JSON.parse(vacancy.requirements);
          requirements = requirementsData.requirements || [];
          responsibilities = requirementsData.responsibilities || null;
          qualifications = requirementsData.qualifications || null;
        }
      } catch (e) {
        console.warn('Failed to parse requirements:', e);
        requirements = [];
      }

      return {
        ...vacancy,
        requirements,
        responsibilities,
        qualifications,
        isPublished: vacancy.isActive, // Map isActive to isPublished
        // Add other fields from requirementsData if needed
        employmentType: requirementsData.employmentType || null,
        location: requirementsData.location || null,
        salaryRange: requirementsData.salaryRange || null,
        closingDate: requirementsData.closingDate || null,
        startDate: requirementsData.startDate || null,
        isUrgent: requirementsData.isUrgent || false,
        applicationEmail: requirementsData.applicationEmail || null,
        applicationInstructions: requirementsData.applicationInstructions || null,
        order: requirementsData.order || 0,
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
    // Get existing vacancy to merge with new data
    const existing = await prisma.vacancy.findUnique({ where: { id } });
    if (!existing) throw new Error('Vacancy not found');

    // Parse existing requirements
    let existingData: any = {};
    try {
      if (existing.requirements) {
        existingData = JSON.parse(existing.requirements);
      }
    } catch (e) {
      console.warn('Failed to parse existing requirements:', e);
    }

    // Merge with new data
    const allData = {
      requirements: data.requirements || existingData.requirements || [],
      responsibilities: data.responsibilities !== undefined ? data.responsibilities : existingData.responsibilities,
      qualifications: data.qualifications !== undefined ? data.qualifications : existingData.qualifications,
      employmentType: data.employmentType !== undefined ? data.employmentType : existingData.employmentType,
      location: data.location !== undefined ? data.location : existingData.location,
      salaryRange: data.salaryRange !== undefined ? data.salaryRange : existingData.salaryRange,
      closingDate: data.closingDate !== undefined ? data.closingDate : existingData.closingDate,
      startDate: data.startDate !== undefined ? data.startDate : existingData.startDate,
      isPublished: data.isPublished !== undefined ? data.isPublished : existingData.isPublished,
      isUrgent: data.isUrgent !== undefined ? data.isUrgent : existingData.isUrgent,
      applicationEmail: data.applicationEmail !== undefined ? data.applicationEmail : existingData.applicationEmail,
      applicationInstructions: data.applicationInstructions !== undefined ? data.applicationInstructions : existingData.applicationInstructions,
      order: data.order !== undefined ? data.order : existingData.order,
    };

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.description !== undefined) updateData.description = data.description;
    updateData.requirements = JSON.stringify(allData);
    if (data.isPublished !== undefined) updateData.isActive = data.isPublished;

    const updated = await prisma.vacancy.update({
      where: { id },
      data: updateData,
    });

    let requirementsData: any = {};
      let requirements = null;
      let responsibilities = null;
      let qualifications = null;

      try {
        if (updated.requirements) {
          requirementsData = JSON.parse(updated.requirements);
          requirements = requirementsData.requirements || [];
          responsibilities = requirementsData.responsibilities || null;
          qualifications = requirementsData.qualifications || null;
        }
      } catch (e) {
        console.warn('Failed to parse requirements:', e);
        requirements = [];
      }

      return {
        ...updated,
        requirements,
        responsibilities,
        qualifications,
        isPublished: updated.isActive,
        employmentType: requirementsData.employmentType || null,
        location: requirementsData.location || null,
        salaryRange: requirementsData.salaryRange || null,
        closingDate: requirementsData.closingDate || null,
        startDate: requirementsData.startDate || null,
        isUrgent: requirementsData.isUrgent || false,
        applicationEmail: requirementsData.applicationEmail || null,
        applicationInstructions: requirementsData.applicationInstructions || null,
        order: requirementsData.order || 0,
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
      let requirementsData: any = {};
      let requirements = null;
      let responsibilities = null;
      let qualifications = null;

      try {
        if (vacancy.requirements) {
          requirementsData = JSON.parse(vacancy.requirements);
          requirements = requirementsData.requirements || [];
          responsibilities = requirementsData.responsibilities || null;
          qualifications = requirementsData.qualifications || null;
        }
      } catch (e) {
        console.warn('Failed to parse requirements:', e);
        requirements = [];
      }

      return {
        ...vacancy,
        requirements,
        responsibilities,
        qualifications,
        isPublished: vacancy.isActive,
        employmentType: requirementsData.employmentType || null,
        location: requirementsData.location || null,
        salaryRange: requirementsData.salaryRange || null,
        closingDate: requirementsData.closingDate || null,
        startDate: requirementsData.startDate || null,
        isUrgent: requirementsData.isUrgent || false,
        applicationEmail: requirementsData.applicationEmail || null,
        applicationInstructions: requirementsData.applicationInstructions || null,
        order: requirementsData.order || 0,
      };
    });
  }
}

export default VacancyService.getInstance();

