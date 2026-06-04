import { prisma } from '../../lib/prisma';
import { triggerEngine } from './triggerEngine';

export const automationService = {
  async createRule(workspaceId: string, ruleData: any) {
    const rule = await prisma.automationRule.create({
      data: {
        workspaceId,
        name: ruleData.name,
        trigger: ruleData.trigger,
        conditions: ruleData.conditions || {},
        actions: ruleData.actions || [],
        enabled: true,
      },
    });

    // Register trigger in our memory hook list
    triggerEngine.registerTrigger(rule.id, ruleData.trigger);

    return rule;
  },

  async executeRule(ruleId: string, context: any) {
    const rule = await prisma.automationRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule || !rule.enabled) return;

    // Evaluate conditions
    const conditionsMet = this.evaluateConditions(rule.conditions, context);

    if (!conditionsMet) return;

    // Execute actions
    for (const action of rule.actions as any[]) {
      await this.executeAction(action, rule.workspaceId, context);
    }
  },

  evaluateConditions(conditions: any, context: any): boolean {
    if (!conditions || Object.keys(conditions).length === 0) return true;

    // Simple expression evaluation for status or assignee fields
    // conditions format: { field: "status", operator: "equals", value: "Done" }
    try {
      const { field, operator, value } = conditions;
      const contextValue = context[field];

      if (operator === 'equals') {
        return contextValue === value;
      }
      if (operator === 'not_equals') {
        return contextValue !== value;
      }
      if (operator === 'contains') {
        return typeof contextValue === 'string' && contextValue.includes(value);
      }
    } catch (e) {
      console.error('Error evaluating conditions:', e);
      return false;
    }

    return true;
  },

  async executeAction(action: any, workspaceId: string, context: any) {
    if (action.type === 'webhook') {
      await this.triggerWebhook(action.url, context);
    } else if (action.type === 'notify') {
      // Create user notification
      const members = await prisma.workspaceMember.findMany({
        where: { workspaceId },
      });

      const promises = members.map((member) =>
        prisma.notification.create({
          data: {
            userId: member.userId,
            title: `Automation Triggered: ${action.title || 'Rule Alert'}`,
            message: `The rule action updated your environment: status is ${context.status || 'unknown'}.`,
            type: 'info',
          },
        })
      );
      await Promise.all(promises);
    } else if (action.type === 'update_status') {
      if (context.id) {
        await prisma.resource.update({
          where: { id: context.id },
          data: { status: action.value },
        });
      }
    }
  },

  async triggerWebhook(url: string, context: any) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'automation_webhook',
          timestamp: new Date().toISOString(),
          data: context,
        }),
      });
      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to dispatch webhook to URL: ${url}`, error);
    }
  },
};
