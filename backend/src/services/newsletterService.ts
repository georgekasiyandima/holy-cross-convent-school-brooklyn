import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

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
    
    return await prisma.newsletter.create({
      data: {
        ...data,
        gradeLevels: gradeLevelsJson,
        attachments: attachmentsJson,
      },
    });
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
        recipients: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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

    // Update status to SENDING
    await prisma.newsletter.update({
      where: { id: newsletterId },
      data: { status: 'SENDING' },
    });

    try {
      // Get all parents for the target audience
      const parents = await this.getTargetParents(newsletter);
      
      // Create recipient records
      const recipients = await Promise.all(
        parents.map(parent =>
          prisma.newsletterRecipient.create({
            data: {
              newsletterId,
              parentId: parent.id,
              status: 'PENDING',
            },
          })
        )
      );

      // Send emails (simplified - in production, use a proper email service)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const emailPromises = recipients.map(async (recipient) => {
        try {
          // Get parent details
          const parent = await prisma.parent.findUnique({
            where: { id: recipient.parentId },
          });

          if (!parent) {
            throw new Error('Parent not found');
          }

          await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@holycrossbrooklyn.co.za',
            to: parent.email,
            subject: newsletter.title,
            html: newsletter.content,
          });

          await prisma.newsletterRecipient.update({
            where: { id: recipient.id },
            data: {
              status: 'SENT',
              sentAt: new Date(),
            },
          });
        } catch (error) {
          await prisma.newsletterRecipient.update({
            where: { id: recipient.id },
            data: {
              status: 'FAILED',
              errorMessage: error instanceof Error ? error.message : 'Unknown error',
            },
          });
        }
      });

      await Promise.all(emailPromises);

      // Update newsletter status
      await prisma.newsletter.update({
        where: { id: newsletterId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      return { success: true, recipientsCount: recipients.length };
    } catch (error) {
      // Update newsletter status to FAILED
      await prisma.newsletter.update({
        where: { id: newsletterId },
        data: { status: 'FAILED' },
      });

      throw error;
    }
  }

  private static async getTargetParents(newsletter: any) {
    const where: any = { isActive: true };

    if (newsletter.targetAudience === 'SPECIFIC_GRADES' && newsletter.gradeLevels.length > 0) {
      // Get parents of students in specific grades
      const students = await prisma.student.findMany({
        where: {
          grade: { in: newsletter.gradeLevels },
          isActive: true,
        },
        include: { parent: true },
      });

      return students.map(student => student.parent);
    }

    // Get all active parents
    return await prisma.parent.findMany({ where });
  }

  static async getNewsletterStats(newsletterId: string) {
    const stats = await prisma.newsletterRecipient.groupBy({
      by: ['status'],
      where: { newsletterId },
      _count: { status: true },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);
  }
}
