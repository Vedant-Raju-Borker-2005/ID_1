import { NextRequest, NextResponse } from 'next/server';
import projectTeamRepo from '../../../../models/projectTeamModel';
import { verifyAuth } from '../../../../../src/middleware/authMiddleware';
import { prisma } from '../../../../../src/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const issues = await prisma.executionIssue.findMany({
      where: { projectId: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json(issues);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user role is COORDINATOR or MANAGER (or workspace admin/owner)
    const projectMember = await prisma.projectTeamMember.findFirst({
      where: { projectId: params.id, userId: user.id, status: 'ACTIVE' },
    });

    const isProjectStaff =
      projectMember &&
      (projectMember.role === 'MANAGER' || projectMember.role === 'COORDINATOR');

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { workspaceId: true },
    });

    let isWorkspaceAdmin = false;
    if (project) {
      const workspaceMember = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: project.workspaceId,
            userId: user.id,
          },
        },
      });
      isWorkspaceAdmin =
        !!workspaceMember &&
        (workspaceMember.role === 'OWNER' || workspaceMember.role === 'ADMIN');
    }

    if (!isProjectStaff && !isWorkspaceAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions to log issues' },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { type, priority, description, itemId } = body;

    if (!type || !priority || !description) {
      return NextResponse.json(
        { error: 'Missing type, priority, or description' },
        { status: 400 }
      );
    }

    const issue = await projectTeamRepo.createIssue({
      projectId: params.id,
      itemId,
      type,
      priority,
      status: 'OPEN',
      description,
      createdById: user.id,
    });

    return NextResponse.json(issue, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create issue' },
      { status: 500 }
    );
  }
}
