import { prisma } from '../../lib/prisma';

// A registry mapping triggers to automation rule IDs
const triggerRegistry: Map<string, Set<string>> = new Map();

export const triggerEngine = {
  /**
   * Registers a trigger type to monitor.
   */
  registerTrigger(ruleId: string, triggerType: string) {
    if (!triggerRegistry.has(triggerType)) {
      triggerRegistry.set(triggerType, new Set());
    }
    triggerRegistry.get(triggerType)!.add(ruleId);
    console.log(`Registered trigger: rule [${ruleId}] is listening for [${triggerType}]`);
  },

  /**
   * Initializes triggers by loading active rules from the database.
   */
  async initializeTriggers() {
    try {
      const activeRules = await prisma.automationRule.findMany({
        where: { enabled: true },
      });

      for (const rule of activeRules) {
        this.registerTrigger(rule.id, rule.trigger);
      }
      console.log(`Loaded ${activeRules.length} active automation rules into trigger memory.`);
    } catch (error) {
      console.error('Failed to load automation rules into memory:', error);
    }
  },

  /**
   * Publishes an event that checks rules and dispatches actions asynchronously.
   */
  async publishEvent(triggerType: string, context: any) {
    // Dynamically import automationService to avoid circular dependency
    const { automationService } = await import('./automationService');

    const ruleIds = triggerRegistry.get(triggerType);
    if (!ruleIds || ruleIds.size === 0) return;

    console.log(`Processing event [${triggerType}] for ${ruleIds.size} rules.`);
    
    // Evaluate matching rules asynchronously
    for (const ruleId of Array.from(ruleIds)) {
      // Catch individual errors to prevent blocking subsequent rules
      automationService.executeRule(ruleId, context).catch((err) => {
        console.error(`Error executing rule ${ruleId}:`, err);
      });
    }
  },
};
