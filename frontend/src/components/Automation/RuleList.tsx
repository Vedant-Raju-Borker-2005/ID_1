'use client';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  enabled: boolean;
  actionsCount: number;
}

interface RuleListProps {
  rules: AutomationRule[];
  onToggle: (id: string, enabled: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function RuleList({ rules, onToggle, onDelete }: RuleListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-150 bg-gray-50/50 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700 text-sm">Active Automations</h3>
        <span className="text-xs text-gray-500 font-medium">{rules.length} active rules</span>
      </div>

      {rules.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">
          No automation rules configured for this workspace yet.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {rules.map((rule) => (
            <div key={rule.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">{rule.name}</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[10px] bg-automation-orange/10 text-automation-orange px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {rule.trigger.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {rule.actionsCount} actions defined
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Custom Toggle Switch */}
                <button
                  onClick={() => onToggle(rule.id, !rule.enabled)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none ${
                    rule.enabled ? 'bg-automation-orange' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      rule.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>

                <button
                  onClick={() => onDelete(rule.id)}
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
