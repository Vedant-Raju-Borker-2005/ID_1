import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/middleware/authMiddleware';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    
    const { searchParams } = new URL(request.url);
    const unread = searchParams.get('unread') === 'true';

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        ...(unread ? { read: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    
    const body = await request.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing notification id' }, { status: 400 });
    }

    const updated = await prisma.notification.update({
      where: { id, userId: user.id },
      data: { read: !!read },
    });

    return NextResponse.json({ success: true, notification: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
