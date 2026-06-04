export interface AICompleteRequest {
  prompt: string;
  context?: string;
  workspaceId: string;
}

export interface AISummarizeRequest {
  resourceId: string;
  activityCount?: number;
}

export interface AIUsageStats {
  workspaceId: string;
  totalTokensUsed: number;
  totalCost: number;
  featureBreakdown: Record<string, number>;
}
