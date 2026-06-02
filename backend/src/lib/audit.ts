import { prisma } from './prisma';

export const auditService = {
  async log(userId: string, action: string, resourceType: string, resourceId: string, metadata?: any) {
    try {
      const logEntry = await prisma.activityLog.create({
        data: {
          userId,
          action,
          resourceType,
          resourceId,
          metadata: metadata || {},
        },
      });
      return logEntry;
    } catch (error) {
      console.error('Audit Log failed to write to database:', error);
      // Fallback log to console
      console.log(`[AUDIT FALLBACK] User:${userId} Action:${action} Resource:${resourceType}(${resourceId})`, metadata);
    }
  },

  async getLogsForResource(resourceId: string, limit: number = 50) {
    return prisma.activityLog.findMany({
      where: { resourceId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },
};
