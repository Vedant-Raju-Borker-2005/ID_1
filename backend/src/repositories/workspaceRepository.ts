import { prisma } from '../lib/prisma';

export const workspaceRepository = {
  async findById(id: string) {
    return prisma.workspace.findUnique({
      where: { id },
      include: {
        members: {
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
        },
      },
    });
  },

  async findBySlug(slug: string) {
    return prisma.workspace.findUnique({
      where: { slug },
    });
  },

  async update(id: string, data: { name?: string; slug?: string }) {
    return prisma.workspace.update({
      where: { id },
      data,
    });
  },

  async listByUser(userId: string) {
    return prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
  },
};
