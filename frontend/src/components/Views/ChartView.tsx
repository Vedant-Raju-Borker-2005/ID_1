'use client';

interface StatusDistribution {
  status: string;
  count: number;
  color: string;
}

interface CostHistory {
  month: string;
  tokens: number;
  cost: number;
}

interface ChartViewProps {
  statusData?: StatusDistribution[];
  costHistory?: CostHistory[];
}

export function ChartView({ statusData, costHistory }: ChartViewProps) {
  // Fallback mock analytics data
  const defaultStatus = statusData || [
    { status: 'Todo', count: 12, color: 'bg-gray-400' },
    { status: 'In Progress', count: 8, color: 'bg-brand-500' },
    { status: 'Review', count: 4, color: 'bg-ai-purple' },
    { status: 'Done', count: 15, color: 'bg-green-500' },
  ];

  const defaultCost = costHistory || [
    { month: 'March', tokens: 42000, cost: 1.26 },
    { month: 'April', tokens: 68000, cost: 2.04 },
    { month: 'May', tokens: 95000, cost: 2.85 },
  ];

  const maxCount = Math.max(...defaultStatus.map((s) => s.count));

  return (
    <div className="grid grid-cols-2 gap-6 select-none">
      {/* Status Distribution */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-6 uppercase tracking-wider">Status Distribution</h3>
        <div className="space-y-4">
          {defaultStatus.map((item) => {
            const percentage = (item.count / maxCount) * 100;
            return (
              <div key={item.status} className="flex flex-col space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-gray-700">{item.status}</span>
                  <span className="text-gray-400">{item.count} items</span>
                </div>
                <div className="w-full bg-gray-150 h-3 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Usage Billing */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-6 uppercase tracking-wider">AI Operations Billing</h3>
        <div className="flex justify-between items-end h-40 pt-4 border-b border-gray-150">
          {defaultCost.map((history) => {
            const maxCost = Math.max(...defaultCost.map((c) => c.cost));
            const barHeight = (history.cost / maxCost) * 100;
            return (
              <div key={history.month} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-[10px] py-1 px-2.5 rounded-lg shadow font-semibold">
                  ${history.cost.toFixed(2)} ({history.tokens} tokens)
                </div>
                
                <div
                  className="w-10 bg-gradient-to-t from-ai-purple to-ai-fuchsia rounded-t-lg transition-all duration-500 shadow-sm"
                  style={{ height: `${barHeight}%` }}
                />
                <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wide">
                  {history.month}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-between items-center text-xs text-gray-500 font-semibold">
          <span>YTD Total Budget: $6.15</span>
          <span className="text-ai-purple">Tokens quota: 205k / 1M</span>
        </div>
      </div>
    </div>
  );
}
