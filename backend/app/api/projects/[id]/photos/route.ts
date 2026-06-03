import { NextRequest, NextResponse } from 'next/server';
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

    const photos = await prisma.executionPhoto.findMany({
      where: { projectId: params.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(photos);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch photos' },
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
    const { roomName, category, imageUrl } = body;

    if (!category || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing category or imageUrl' },
        { status: 400 }
      );
    }

    const photo = await prisma.executionPhoto.create({
      data: {
        projectId: params.id,
        roomName: roomName || null,
        category,
        imageUrl,
        uploadedBy: user.id,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add photo' },
      { status: 500 }
    );
  }
}
