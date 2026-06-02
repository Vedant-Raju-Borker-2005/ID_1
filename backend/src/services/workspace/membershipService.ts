import { prisma } from '../../lib/prisma';

export const membershipService = {
  async addMember(workspaceId: string, email: string, role: 'ADMIN' | 'MEMBER' | 'VIEWER' = 'MEMBER') {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User with this email does not exist. Please register them first.');
    }

    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      throw new Error('User is already a member of this workspace');
    }

    return prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: user.id,
        role,
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
  },

  async updateRole(workspaceId: string, userId: string, role: 'ADMIN' | 'MEMBER' | 'VIEWER') {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new Error('Membership not found');
    }

    if (membership.role === 'OWNER') {
      throw new Error('Cannot update the role of the workspace owner');
    }

    return prisma.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      data: { role },
    });
  },

  async removeMember(workspaceId: string, userId: string) {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new Error('Membership not found');
    }

    if (membership.role === 'OWNER') {
      throw new Error('Cannot remove the workspace owner. Transfer ownership first.');
    }

    return prisma.workspaceMember.delete({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
  },

  async getMembers(workspaceId: string) {
    return prisma.workspaceMember.findMany({
      where: { workspaceId },
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
  },
};
