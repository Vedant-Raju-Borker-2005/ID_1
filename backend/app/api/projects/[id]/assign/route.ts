import { NextRequest, NextResponse } from 'next/server';
import projectTeamRepo from '../../../../models/projectTeamModel';
import { validateAssignmentPermissions } from '../../../../services/assignmentService';
import { verifyAuth } from '../../../../../src/middleware/authMiddleware';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await validateAssignmentPermissions(user.id, params.id);

    const body = await req.json().catch(() => ({}));
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing userId or role in request body' },
        { status: 400 }
      );
    }

    const result = await projectTeamRepo.assignProjectMember({
      projectId: params.id,
      userId,
      role,
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to assign member' },
      { status: 403 }
    );
  }
}
