import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateNewsletterData {
  title: string;
  content: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status?: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
  scheduledFor?: Date;
  targetAudience?: string;
  gradeLevels?: string[];
  attachments?: string[];
  authorId: string;
}

export interface UpdateNewsletterData {
  title?: string;
  content?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status?: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
  scheduledFor?: Date;
  targetAudience?: string;
  gradeLevels?: string[];
  attachments?: string[];
}

export class NewsletterService {
  static async createNewsletter(data: CreateNewsletterData) {
    const gradeLevelsJson = data.gradeLevels ? JSON.stringify(data.gradeLevels) : null;
    const attachmentsJson = data.attachments ? JSON.stringify(data.attachments) : null;

    const created = await prisma.newsletter.create({
      data: {
        title: data.title,
        content: data.content,
        priority: data.priority ?? 'NORMAL',
        status: data.status ?? 'DRAFT',
        scheduledFor: data.scheduledFor,
        targetAudience: data.targetAudience ?? 'ALL',
        gradeLevels: gradeLevelsJson,
        attachments: attachmentsJson,
        authorId: data.authorId,
        isPublished: data.status === 'SENT' || data.status === 'SCHEDULED' ? true : false,
        publishedAt: data.status === 'SENT' ? new Date() : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      ...created,
      gradeLevels: created.gradeLevels ? JSON.parse(created.gradeLevels) : [],
      attachments: created.attachments ? JSON.parse(created.attachments) : [],
    };
  }

  static async getNewsletters(filters?: {
    status?: string;
    priority?: string;
    authorId?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.priority) {
      where.priority = filters.priority;
    }
    
    if (filters?.authorId) {
      where.authorId = filters.authorId;
    }

    const [newsletters, total] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.newsletter.count({ where }),
    ]);

    // Parse JSON fields
    const newslettersWithParsedData = newsletters.map(newsletter => ({
      ...newsletter,
      gradeLevels: newsletter.gradeLevels ? JSON.parse(newsletter.gradeLevels) : [],
      attachments: newsletter.attachments ? JSON.parse(newsletter.attachments) : [],
    }));

    return {
      newsletters: newslettersWithParsedData,
      total,
    };
  }

  static async getNewsletterById(id: string) {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!newsletter) {
      return null;
    }

    return {
      ...newsletter,
      gradeLevels: newsletter.gradeLevels ? JSON.parse(newsletter.gradeLevels) : [],
      attachments: newsletter.attachments ? JSON.parse(newsletter.attachments) : [],
    };
  }

  static async updateNewsletter(id: string, data: UpdateNewsletterData) {
    const updateData: any = { ...data };
    
    if (data.gradeLevels) {
      updateData.gradeLevels = JSON.stringify(data.gradeLevels);
    }

    if (data.attachments) {
      updateData.attachments = JSON.stringify(data.attachments);
    }

    const updatedNewsletter = await prisma.newsletter.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      ...updatedNewsletter,
      gradeLevels: updatedNewsletter.gradeLevels ? JSON.parse(updatedNewsletter.gradeLevels) : [],
      attachments: updatedNewsletter.attachments ? JSON.parse(updatedNewsletter.attachments) : [],
    };
  }

  static async deleteNewsletter(id: string) {
    return await prisma.newsletter.delete({
      where: { id },
    });
  }

  static async sendNewsletter(newsletterId: string) {
    const newsletter = await this.getNewsletterById(newsletterId);
    
    if (!newsletter) {
      throw new Error('Newsletter not found');
    }

    if (newsletter.status === 'SENT') {
      throw new Error('Newsletter already sent');
    }

    const now = new Date();

    const updated = await prisma.newsletter.update({
      where: { id: newsletterId },
      data: {
        status: 'SENT',
        sentAt: now,
        publishedAt: now,
        isPublished: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      newsletter: {
        ...updated,
        gradeLevels: updated.gradeLevels ? JSON.parse(updated.gradeLevels) : [],
        attachments: updated.attachments ? JSON.parse(updated.attachments) : [],
      },
      recipientsCount: 0,
    };
  }

  static async getNewsletterStats(newsletterId: string) {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
      select: {
        status: true,
        sentAt: true,
      },
    });

    if (!newsletter) {
      return {};
    }

    return {
      [newsletter.status]: 1,
      sentAt: newsletter.sentAt || null,
    };
  }
}
