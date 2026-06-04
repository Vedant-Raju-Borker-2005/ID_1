import { NextRequest, NextResponse } from 'next/server';
import projectTeamRepo from '@/app/models/projectTeamModel';
import { verifyAuth } from '@/middleware/authMiddleware';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const members = await projectTeamRepo.getTeamMembers(params.id);
    return NextResponse.json(members);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
