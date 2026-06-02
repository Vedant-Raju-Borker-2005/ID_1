import { prisma } from '../../lib/prisma';
import { workspaceRepository } from '../../repositories/workspaceRepository';

export const workspaceService = {
  async createWorkspace(ownerId: string, name: string, slug: string) {
    // Ensure slug uniqueness
    const existing = await workspaceRepository.findBySlug(slug);
    if (existing) {
      throw new Error('Workspace slug already taken');
    }

    return prisma.$transaction(async (tx) => {
      // Create Workspace
      const workspace = await tx.workspace.create({
        data: {
          name,
          slug,
          ownerId,
          plan: 'FREE',
        },
      });

      // Add owner as a member with OWNER role
      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: ownerId,
          role: 'OWNER',
        },
      });

      return workspace;
    });
  },

  async getWorkspaceById(id: string) {
    return workspaceRepository.findById(id);
  },

  async getUserWorkspaces(userId: string) {
    return prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async updateWorkspacePlan(id: string, plan: string) {
    return prisma.workspace.update({
      where: { id },
      data: { plan },
    });
  },

  async deleteWorkspace(id: string) {
    // Soft delete can be simulated by renaming slug or status, here we perform a direct transaction deletion
    return prisma.$transaction(async (tx) => {
      await tx.workspaceMember.deleteMany({ where: { workspaceId: id } });
      await tx.resource.deleteMany({ where: { workspaceId: id } });
      await tx.automationRule.deleteMany({ where: { workspaceId: id } });
      await tx.integration.deleteMany({ where: { workspaceId: id } });
      return tx.workspace.delete({ where: { id } });
    });
  },
};
