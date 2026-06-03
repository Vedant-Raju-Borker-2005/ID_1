import { prisma } from '../../src/lib/prisma';
import { TeamRole, MemberStatus } from '@prisma/client';

export class ProjectTeamRepository {
  async getTeamMembers(projectId: string) {
    return prisma.projectTeamMember.findMany({
      where: { projectId, status: 'ACTIVE' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async assignProjectMember(data: { projectId: string; userId: string; role: TeamRole }) {
    const existing = await prisma.projectTeamMember.findFirst({
      where: { projectId: data.projectId, userId: data.userId },
    });

    if (existing && existing.status === 'ACTIVE') {
      return { error: 'User already active on project' };
    }

    const result = await prisma.projectTeamMember.upsert({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: data.userId,
        },
      },
      update: {
        status: 'ACTIVE',
        role: data.role,
      },
      create: {
        projectId: data.projectId,
        userId: data.userId,
        role: data.role,
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Create an assignment log too
    await prisma.projectAssignment.create({
      data: {
        projectId: data.projectId,
        assigneeId: data.userId,
        assignedById: data.userId, // Defaulting to the assigner's ID or user ID
        role: data.role,
      },
    });

    return result;
  }

  async getProjectProgress(projectId: string) {
    const history = await prisma.projectProgressHistory.findMany({
      where: { projectId },
      orderBy: { recordedAt: 'desc' },
      take: 10,
    });

    return history[0] || null;
  }

  async createIssue(data: {
    projectId: string;
    itemId?: string | null;
    type: any;
    priority: any;
    status: any;
    description: string;
    createdById: string;
  }) {
    return prisma.executionIssue.create({
      data: {
        projectId: data.projectId,
        itemId: data.itemId || null,
        type: data.type,
        priority: data.priority,
        status: data.status,
        description: data.description,
        createdById: data.createdById,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getDashboardStats(workspaceId: string, userId: string, role: string) {
    // Standard workspace scoping of projects
    // Execute a standard Prisma call or safe query
    const projects = await prisma.project.findMany({
      where: {
        workspaceId,
        ...(role !== 'MANAGER'
          ? {
              teamMembers: {
                some: {
                  userId,
                  status: 'ACTIVE',
                },
              },
            }
          : {}),
      },
      include: {
        issues: {
          where: {
            status: {
              not: 'CLOSED',
            },
          },
        },
      },
    });

    const totalProjects = projects.length;
    const activeProjects = projects.length; // Simplified active state mapping
    const openIssues = projects.reduce((sum, p) => sum + p.issues.length, 0);

    return {
      totalProjects,
      activeProjects,
      openIssues,
    };
  }
}

export default new ProjectTeamRepository();
