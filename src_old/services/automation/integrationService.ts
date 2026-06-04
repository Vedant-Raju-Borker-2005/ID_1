import { prisma } from '../../lib/prisma';

export const integrationService = {
  async addIntegration(workspaceId: string, type: 'slack' | 'jira' | 'github', credentials: any) {
    const existing = await prisma.integration.findFirst({
      where: { workspaceId, type },
    });

    if (existing) {
      return prisma.integration.update({
        where: { id: existing.id },
        data: { credentials },
      });
    }

    return prisma.integration.create({
      data: {
        workspaceId,
        type,
        credentials,
      },
    });
  },

  async getIntegrations(workspaceId: string) {
    return prisma.integration.findMany({
      where: { workspaceId },
    });
  },

  async deleteIntegration(id: string) {
    return prisma.integration.delete({
      where: { id },
    });
  },

  /**
   * Post message or trigger API on external third party.
   */
  async dispatchSlackMessage(workspaceId: string, channelName: string, text: string) {
    const slackIntegration = await prisma.integration.findFirst({
      where: { workspaceId, type: 'slack' },
    });

    if (!slackIntegration) {
      console.warn(`Slack integration not found for workspace ${workspaceId}`);
      return false;
    }

    const credentials = slackIntegration.credentials as any;
    const webhookUrl = credentials.webhookUrl || credentials.url;

    if (!webhookUrl) {
      console.warn(`Slack Webhook URL missing in workspace ${workspaceId}`);
      return false;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: channelName,
          text: `*[Modular Interior Design]* ${text}`,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to post to Slack webhook:', error);
      return false;
    }
  },
};
