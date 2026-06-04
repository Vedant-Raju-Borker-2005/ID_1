import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/ai/aiService';
import { verifyAuth, verifyWorkspaceScoping } from '@/middleware/authMiddleware';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    const workspaceId = await verifyWorkspaceScoping(request, user.id);

    const body = await request.json().catch(() => ({}));
    const { message, conversationId, context } = body;

    if (!message) {
      return NextResponse.json({ error: 'Missing message parameter' }, { status: 400 });
    }

    const response = await aiService.complete(message, context || '', workspaceId);
    return NextResponse.json({ content: response, conversationId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI Service Error' }, { status: 500 });
  }
}
