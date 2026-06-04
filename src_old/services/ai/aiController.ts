import { aiService } from './aiService';
import { prisma } from '../../lib/prisma';

export const aiController = {
  async complete(req: Request) {
    try {
      const { prompt, context, workspaceId } = await req.json();
      if (!prompt || !workspaceId) {
        return Response.json({ error: 'Missing prompt or workspaceId parameter' }, { status: 400 });
      }
      const result = await aiService.complete(prompt, context || '', workspaceId);
      return Response.json({ content: result });
    } catch (error: any) {
      return Response.json({ error: error.message || 'AI generation failed' }, { status: 500 });
    }
  },

  async summarize(req: Request) {
    try {
      const { resourceId, activityCount } = await req.json();
      if (!resourceId) {
        return Response.json({ error: 'Missing resourceId parameter' }, { status: 400 });
      }
      const result = await aiService.summarizeActivity(resourceId, activityCount || 10);
      return Response.json({ summary: result });
    } catch (error: any) {
      return Response.json({ error: error.message || 'Summarization failed' }, { status: 500 });
    }
  },

  async getUsage(req: Request) {
    try {
      const url = new URL(req.url);
      const workspaceId = url.searchParams.get('workspaceId');
      if (!workspaceId) {
        return Response.json({ error: 'Missing workspaceId parameter' }, { status: 400 });
      }

      const usageLogs = await prisma.aIUsage.findMany({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
      });

      const totalTokens = usageLogs.reduce((acc, curr) => acc + curr.tokensUsed, 0);
      const totalCost = usageLogs.reduce((acc, curr) => acc + Number(curr.cost), 0);

      return Response.json({
        workspaceId,
        totalTokensUsed: totalTokens,
        totalCost,
        history: usageLogs,
      });
    } catch (error: any) {
      return Response.json({ error: error.message || 'Failed to fetch usage metrics' }, { status: 500 });
    }
  },
};
