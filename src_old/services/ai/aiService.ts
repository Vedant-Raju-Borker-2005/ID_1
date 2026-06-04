import { OpenAI } from 'openai';
import { prisma } from '../../lib/prisma';
import { aiProvider } from '../../lib/aiProvider';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'mock-key' });

export const aiService = {
  async complete(prompt: string, context: string, workspaceId: string) {
    const usage = await prisma.aIUsage.findFirst({
      where: { workspaceId, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    });

    if (usage && usage.tokensUsed > 100000) {
      throw new Error('AI quota exceeded');
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: aiProvider.getSystemPrompt() },
        { role: 'user', content: `${prompt}\nContext: ${context}` },
      ],
    });

    const content = response.choices[0].message.content || '';
    
    await prisma.aIUsage.create({
      data: {
        workspaceId,
        feature: 'writing',
        tokensUsed: response.usage?.total_tokens || 0,
        cost: 0.00003 * (response.usage?.total_tokens || 0), // Realistic pricing metric
      },
    });

    return content;
  },

  async summarizeActivity(resourceId: string, activityCount: number) {
    // Fetch activity logs
    const activities = await prisma.activityLog.findMany({
      where: { resourceId },
      take: activityCount,
      orderBy: { createdAt: 'desc' },
    });

    const prompt = `Summarize these activity logs for a user: ${JSON.stringify(activities)}`;
    return await this.complete(prompt, '', 'workspace-id');
  },
};
