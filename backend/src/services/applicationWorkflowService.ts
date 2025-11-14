import { Prisma, PrismaClient } from '@prisma/client';

export type WorkflowStageStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
export type WorkflowStageKey =
  | 'DOCUMENT_VERIFICATION'
  | 'FINANCIAL_REVIEW'
  | 'ASSESSMENT_SCHEDULING'
  | 'ASSESSMENT_OUTCOME'
  | 'FINAL_DECISION'
  | 'ENROLMENT_PACK';

interface StageTemplate {
  stageKey: WorkflowStageKey;
  name: string;
  description: string;
  assignedRole: string;
  sequence: number;
  defaultStatus?: WorkflowStageStatus;
  defaultPayload?: Prisma.JsonValue;
  dueInBusinessDays?: number;
}

export interface StageStatusUpdateOptions {
  actorUserId?: string;
  actorDisplayName?: string;
  notes?: string;
  metadata?: Prisma.JsonValue;
  status: WorkflowStageStatus;
}

export interface StageAssignmentOptions {
  assignedRole?: string;
  assignedUserId?: string | null;
  actorUserId?: string;
  actorDisplayName?: string;
  notes?: string;
  metadata?: Prisma.JsonValue;
}

const prisma = new PrismaClient();

const BUSINESS_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

const STAGE_TEMPLATES: StageTemplate[] = [
  {
    stageKey: 'DOCUMENT_VERIFICATION',
    name: 'Secretary Document Verification',
    description:
      'Secretary verifies application completeness, identity documents, proof of address, birth/baptism certificates, medical notes, and supporting files.',
    assignedRole: 'SECRETARY',
    sequence: 1,
    dueInBusinessDays: 3,
    defaultPayload: {
      checklist: [
        'Birth certificate',
        'Baptism certificate (if applicable)',
        'ID/passport copies (parents/guardians)',
        'Proof of residence',
        'Latest school report',
        'Transfer letter (if applicable)'
      ],
      allowAdditionalNotes: true
    }
  },
  {
    stageKey: 'FINANCIAL_REVIEW',
    name: 'Bursar Financial Review',
    description:
      'Bursar evaluates fee affordability, outstanding balances, and flags requirements for financial assistance documentation.',
    assignedRole: 'BURSAR',
    sequence: 2,
    dueInBusinessDays: 5,
    defaultPayload: {
      checklist: [
        'Fee structure acknowledgement',
        'Outstanding balance checks',
        'Payment plan / bursary requirements'
      ]
    }
  },
  {
    stageKey: 'ASSESSMENT_SCHEDULING',
    name: 'Assessment Scheduling',
    description:
      'Principal or admissions lead coordinates with relevant teacher to book learner assessment date and notify parents.',
    assignedRole: 'PRINCIPAL',
    sequence: 3,
    dueInBusinessDays: 7,
    defaultPayload: {
      requiresAssessmentDate: true,
      emailTemplate: 'ASSESSMENT_INVITE'
    }
  },
  {
    stageKey: 'ASSESSMENT_OUTCOME',
    name: 'Assessment Outcome Capture',
    description:
      'Class teacher records assessment results and recommendations for admission.',
    assignedRole: 'TEACHER',
    sequence: 4,
    dueInBusinessDays: 5,
    defaultPayload: {
      requiresAssessmentReport: true
    }
  },
  {
    stageKey: 'FINAL_DECISION',
    name: 'Principal Final Decision',
    description:
      'Principal reviews all findings, confirms acceptance or rejection, and prepares parent communication.',
    assignedRole: 'PRINCIPAL',
    sequence: 5,
    dueInBusinessDays: 3,
    defaultPayload: {
      expectsDecision: true,
      decisionOptions: ['APPROVED', 'REJECTED', 'WAITLISTED']
    }
  },
  {
    stageKey: 'ENROLMENT_PACK',
    name: 'Enrolment Pack & Onboarding',
    description:
      'Secretary issues enrolment documents, confirms signed contracts, and queues welcome communications.',
    assignedRole: 'SECRETARY',
    sequence: 6,
    dueInBusinessDays: 7,
    defaultPayload: {
      checklist: [
        'Admission letter sent',
        'Acceptance of offer received',
        'Deposit acknowledged',
        'Welcome pack delivered'
      ]
    }
  }
];

const stageOrderMap = new Map(STAGE_TEMPLATES.map((stage) => [stage.stageKey, stage.sequence]));

const addBusinessDays = (start: Date, numberOfDays?: number | null): Date | null => {
  if (!numberOfDays || numberOfDays <= 0) {
    return null;
  }

  const result = new Date(start);
  let addedDays = 0;

  while (addedDays < numberOfDays) {
    result.setTime(result.getTime() + BUSINESS_DAY_MILLISECONDS);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      addedDays += 1;
    }
  }

  return result;
};

const serializeMetadata = (value?: Prisma.JsonValue): string | null => {
  if (value === undefined || value === null) {
    return null;
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Failed to serialize workflow metadata:', error);
    return null;
  }
};

class ApplicationWorkflowService {
  private static instance: ApplicationWorkflowService;

  public static getInstance(): ApplicationWorkflowService {
    if (!ApplicationWorkflowService.instance) {
      ApplicationWorkflowService.instance = new ApplicationWorkflowService();
    }
    return ApplicationWorkflowService.instance;
  }

  private async runWithTransaction<T>(
    handler: (tx: Prisma.TransactionClient) => Promise<T>,
    tx?: Prisma.TransactionClient
  ): Promise<T> {
    if (tx) {
      return handler(tx);
    }

    return prisma.$transaction(handler);
  }

  public async initializeWorkflow(applicationId: number, tx?: Prisma.TransactionClient) {
    const now = new Date();

    return this.runWithTransaction(async (trx) => {
      const stagesPayload = STAGE_TEMPLATES.map((template, index) => ({
        applicationId,
        stageKey: template.stageKey,
        name: template.name,
        description: template.description,
        assignedRole: template.assignedRole,
        assignedUserId: null,
        sequence: template.sequence ?? index + 1,
        status: index === 0 ? 'PENDING' : template.defaultStatus ?? 'PENDING',
        dueDate: addBusinessDays(now, template.dueInBusinessDays ?? null),
        payload: template.defaultPayload ? JSON.stringify(template.defaultPayload) : null
      }));

      await trx.applicationStage.createMany({ data: stagesPayload });

      const firstStage = await trx.applicationStage.findFirst({
        where: { applicationId },
        orderBy: { sequence: 'asc' }
      });

      if (!firstStage) {
        throw new Error('Failed to initialize workflow stages');
      }

      await trx.applicationTimeline.create({
        data: {
          applicationId,
          stageKey: firstStage.stageKey,
          eventType: 'WORKFLOW_INITIALIZED',
          notes: 'Application workflow initialized with default stages.'
        }
      });

      await trx.application.update({
        where: { id: applicationId },
        data: {
          currentStageKey: firstStage.stageKey,
          currentStageStatus: firstStage.status,
          currentAssigneeRole: firstStage.assignedRole,
          currentAssigneeId: firstStage.assignedUserId,
          nextActionDue: firstStage.dueDate ?? null
        }
      });

      return trx.applicationStage.findMany({
        where: { applicationId },
        orderBy: { sequence: 'asc' }
      });
    }, tx);
  }

  public async updateStageStatus(
    applicationId: number,
    stageId: number,
    options: StageStatusUpdateOptions,
    tx?: Prisma.TransactionClient
  ) {
    const allowedStatuses: WorkflowStageStatus[] = [
      'PENDING',
      'IN_PROGRESS',
      'COMPLETED',
      'ON_HOLD'
    ];

    if (!allowedStatuses.includes(options.status)) {
      throw new Error('Invalid stage status update requested');
    }

    return this.runWithTransaction(async (trx) => {
      const stage = await trx.applicationStage.findUnique({
        where: { id: stageId }
      });

      if (!stage || stage.applicationId !== applicationId) {
        throw new Error('Stage not found for application');
      }

      const updates: Prisma.ApplicationStageUpdateInput = {
        status: options.status,
        updatedAt: new Date()
      };

      const now = new Date();

      if (options.status === 'IN_PROGRESS' && !stage.startedAt) {
        updates.startedAt = now;
      }

      if (options.status === 'COMPLETED') {
        updates.completedAt = now;
      }

      const updatedStage = await trx.applicationStage.update({
        where: { id: stageId },
        data: updates
      });

      await trx.applicationTimeline.create({
        data: {
          applicationId,
          stageKey: stage.stageKey,
          eventType: 'STAGE_STATUS_UPDATED',
          performedById: options.actorUserId ?? null,
          performedByName: options.actorDisplayName ?? null,
          notes: options.notes ?? null,
          metadata: serializeMetadata(options.metadata)
        }
      });

      if (options.status === 'COMPLETED') {
        const nextStage = await trx.applicationStage.findFirst({
          where: {
            applicationId,
            sequence: { gt: stage.sequence }
          },
          orderBy: { sequence: 'asc' }
        });

        if (nextStage) {
          await trx.application.update({
            where: { id: applicationId },
            data: {
              currentStageKey: nextStage.stageKey,
              currentStageStatus: nextStage.status,
              currentAssigneeRole: nextStage.assignedRole,
              currentAssigneeId: nextStage.assignedUserId,
              nextActionDue: nextStage.dueDate ?? null
            }
          });

          await trx.applicationTimeline.create({
            data: {
              applicationId,
              stageKey: nextStage.stageKey,
              eventType: 'STAGE_ACTIVATED',
              notes: `Stage ${nextStage.name} activated after completion of ${stage.name}.`
            }
          });
        } else {
          await trx.application.update({
            where: { id: applicationId },
            data: {
              currentStageKey: stage.stageKey,
              currentStageStatus: 'COMPLETED',
              currentAssigneeRole: null,
              currentAssigneeId: null,
              nextActionDue: null
            }
          });

          await trx.applicationTimeline.create({
            data: {
              applicationId,
              stageKey: stage.stageKey,
              eventType: 'WORKFLOW_COMPLETED',
              notes: 'All workflow stages completed.'
            }
          });
        }
      } else {
        await trx.application.update({
          where: { id: applicationId },
          data: {
            currentStageKey: stage.stageKey,
            currentStageStatus: options.status,
            currentAssigneeRole: stage.assignedRole,
            currentAssigneeId: stage.assignedUserId,
            nextActionDue: stage.dueDate ?? null
          }
        });
      }

      return updatedStage;
    }, tx);
  }

  public async assignStage(
    applicationId: number,
    stageId: number,
    options: StageAssignmentOptions,
    tx?: Prisma.TransactionClient
  ) {
    return this.runWithTransaction(async (trx) => {
      const stage = await trx.applicationStage.findUnique({ where: { id: stageId } });

      if (!stage || stage.applicationId !== applicationId) {
        throw new Error('Stage not found for application');
      }

      const updatedStage = await trx.applicationStage.update({
        where: { id: stageId },
        data: {
          assignedRole: options.assignedRole ?? stage.assignedRole,
          assignedUserId: options.assignedUserId ?? null
        }
      });

      await trx.applicationTimeline.create({
        data: {
          applicationId,
          stageKey: stage.stageKey,
          eventType: 'STAGE_ASSIGNED',
          performedById: options.actorUserId ?? null,
          performedByName: options.actorDisplayName ?? null,
          notes: options.notes ?? null,
          metadata: serializeMetadata(options.metadata)
        }
      });

      const currentApplication = await trx.application.findUnique({
        where: { id: applicationId }
      });

      if (currentApplication && currentApplication.currentStageKey === stage.stageKey) {
        await trx.application.update({
          where: { id: applicationId },
          data: {
            currentAssigneeRole: updatedStage.assignedRole,
            currentAssigneeId: updatedStage.assignedUserId
          }
        });
      }

      return updatedStage;
    }, tx);
  }

  public async getWorkflowSummary(applicationId: number) {
    const [stages, timeline, communications] = await Promise.all([
      prisma.applicationStage.findMany({
        where: { applicationId },
        orderBy: { sequence: 'asc' }
      }),
      prisma.applicationTimeline.findMany({
        where: { applicationId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.applicationCommunication.findMany({
        where: { applicationId },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { stages, timeline, communications };
  }

  public async logCommunication(
    applicationId: number,
    data: {
      recipientType: string;
      recipientAddress: string;
      channel: string;
      subject?: string;
      body: string;
      status?: string;
      metadata?: Prisma.JsonValue;
    },
    tx?: Prisma.TransactionClient
  ) {
    return this.runWithTransaction(async (trx) => {
      const communication = await trx.applicationCommunication.create({
        data: {
          applicationId,
          recipientType: data.recipientType,
          recipientAddress: data.recipientAddress,
          channel: data.channel,
          subject: data.subject ?? null,
          body: data.body,
          status: data.status ?? 'QUEUED',
          metadata: serializeMetadata(data.metadata)
        }
      });

      await trx.applicationTimeline.create({
        data: {
          applicationId,
          stageKey: null,
          eventType: 'COMMUNICATION_LOGGED',
          notes: `${data.channel} queued for ${data.recipientAddress}`,
          metadata: serializeMetadata(data.metadata)
        }
      });

      return communication;
    }, tx);
  }

  public getStageTemplates() {
    return STAGE_TEMPLATES;
  }

  public getStageOrder(stageKey: WorkflowStageKey) {
    return stageOrderMap.get(stageKey) ?? null;
  }
}

export default ApplicationWorkflowService.getInstance();
