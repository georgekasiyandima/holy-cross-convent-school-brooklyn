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
    const combinedRequirements = JSON.stringify({
      requirements: data.requirements || [],
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
      order: data.order ?? 0,
    });

    return await prisma.vacancy.create({
      data: {
        title: data.title,
        department: data.department || 'TEACHING',
        description: data.description,
        requirements: combinedRequirements,
        isPublished: data.isPublished ?? false,
        isUrgent: data.isUrgent ?? false,
        employmentType: data.employmentType ?? 'FULL_TIME',
        location: data.location ?? 'Brooklyn, Cape Town',
        salaryRange: data.salaryRange ?? null,
        closingDate: data.closingDate ? new Date(data.closingDate) : null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        applicationEmail: data.applicationEmail ?? null,
        applicationInstructions: data.applicationInstructions ?? null,
        order: data.order ?? 0,
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
      orderBy: [{ createdAt: 'desc' }],
    });

    return vacancies.map(this.deserializeVacancy);
  }

  /**
   * Get a single vacancy by ID
   */
  async getVacancyById(id: string) {
    const vacancy = await prisma.vacancy.findUnique({
      where: { id },
    });

    if (!vacancy) return null;

    return this.deserializeVacancy(vacancy);
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
      requirements: data.requirements ?? existingData.requirements ?? [],
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
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.isUrgent !== undefined) updateData.isUrgent = data.isUrgent;
    if (data.employmentType !== undefined) updateData.employmentType = data.employmentType;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.salaryRange !== undefined) updateData.salaryRange = data.salaryRange;
    if (data.closingDate !== undefined) updateData.closingDate = data.closingDate ? new Date(data.closingDate) : null;
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.applicationEmail !== undefined) updateData.applicationEmail = data.applicationEmail;
    if (data.applicationInstructions !== undefined) updateData.applicationInstructions = data.applicationInstructions;
    if (data.order !== undefined) updateData.order = data.order;

    const updated = await prisma.vacancy.update({
      where: { id },
      data: updateData,
    });

    return this.deserializeVacancy(updated);
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
      where: { isPublished: true },
      orderBy: [{ createdAt: 'desc' }],
    });

    return vacancies.map(this.deserializeVacancy);
  }

  private deserializeVacancy(vacancy: any) {
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
      isPublished: vacancy.isPublished,
      employmentType: vacancy.employmentType ?? requirementsData.employmentType ?? null,
      location: vacancy.location ?? requirementsData.location ?? null,
      salaryRange: vacancy.salaryRange ?? requirementsData.salaryRange ?? null,
      closingDate: vacancy.closingDate ?? requirementsData.closingDate ?? null,
      startDate: vacancy.startDate ?? requirementsData.startDate ?? null,
      isUrgent: vacancy.isUrgent ?? requirementsData.isUrgent ?? false,
      applicationEmail: vacancy.applicationEmail ?? requirementsData.applicationEmail ?? null,
      applicationInstructions: vacancy.applicationInstructions ?? requirementsData.applicationInstructions ?? null,
      order: vacancy.order ?? requirementsData.order ?? 0,
    };
  }
}

export default VacancyService.getInstance();

