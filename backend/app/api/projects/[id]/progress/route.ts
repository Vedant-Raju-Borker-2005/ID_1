import { NextRequest, NextResponse } from 'next/server';
import projectTeamRepo from '@/app/models/projectTeamModel';
import { verifyAuth } from '@/middleware/authMiddleware';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const progress = await projectTeamRepo.getProjectProgress(params.id);
    return NextResponse.json(
      progress || { projectId: params.id, progress: 0, reason: 'Initial State' }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch progress' },
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

    const body = await req.json().catch(() => ({}));
    const { progress, reason } = body;

    if (progress === undefined || progress === null) {
      return NextResponse.json({ error: 'Missing progress value' }, { status: 400 });
    }

    const result = await prisma.projectProgressHistory.create({
      data: {
        projectId: params.id,
        progress: parseFloat(progress),
        reason: reason || 'Progress Update',
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to record progress history' },
      { status: 500 }
    );
  }
}

