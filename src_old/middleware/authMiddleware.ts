import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface DecodedUser {
  id: string;
  email: string;
}

export async function verifyAuth(req: Request): Promise<DecodedUser> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid authorization header');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'jwt-secret-key-123'
    ) as DecodedUser;
    return decoded;
  } catch (error) {
    throw new Error('Unauthorized: Invalid or expired token');
  }
}

export async function verifyWorkspaceScoping(req: Request, userId: string): Promise<string> {
  const workspaceId = req.headers.get('x-workspace-id');
  if (!workspaceId) {
    throw new Error('Bad Request: Missing x-workspace-id header');
  }

  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new Error('Forbidden: User is not a member of the scoped workspace');
  }

  return workspaceId;
}

export async function verifyRole(userId: string, workspaceId: string, allowedRoles: string[]): Promise<void> {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!membership || !allowedRoles.includes(membership.role)) {
    throw new Error('Forbidden: Insufficient workspace permissions');
  }
}
