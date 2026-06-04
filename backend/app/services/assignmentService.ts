import { prisma } from '@/lib/prisma';
import { ItemStatus } from '@prisma/client';

export async function validateAssignmentPermissions(userId: string, projectId: string) {
  // Check if user is project team MANAGER
  const projectMember = await prisma.projectTeamMember.findFirst({
    where: { projectId, userId, status: 'ACTIVE' },
  });

  if (projectMember && projectMember.role === 'MANAGER') {
    return true;
  }

  // Check if user is Workspace OWNER or ADMIN
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { workspaceId: true },
  });

  if (project) {
    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: project.workspaceId,
          userId,
        },
      },
    });

    if (workspaceMember && (workspaceMember.role === 'OWNER' || workspaceMember.role === 'ADMIN')) {
      return true;
    }
  }

  throw new Error('Only Managers or Workspace Admins can assign team members');
}

export async function calculateProgress(projectId: string, itemStatuses: ItemStatus[]) {
  const map: Record<ItemStatus, number> = {
    ORDERED: 10,
    PRODUCTION: 30,
    READY: 40,
    DISPATCHED: 50,
    DELIVERED: 75,
    INSTALLED: 100,
  };

  let totalProgress = 0;
  itemStatuses.forEach((status) => {
    if (map[status]) {
      totalProgress += map[status];
    }
  });

  const avgProgress =
    itemStatuses.length > 0 ? Math.round(totalProgress / itemStatuses.length) : 0;

  await prisma.projectProgressHistory.create({
    data: {
      projectId,
      progress: avgProgress,
      reason: 'Status Update',
    },
  });

  return avgProgress;
}
