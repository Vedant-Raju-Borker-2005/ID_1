'use client';

import { useState } from 'react';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: any[];
  actions: any[];
}

interface AutomationBuilderProps {
  onSave: (rule: Omit<AutomationRule, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function AutomationBuilder({ onSave, onCancel }: AutomationBuilderProps) {
  const [step, setStep] = useState(1);
  const [rule, setRule] = useState({
    name: '',
    trigger: 'status_changed',
    conditions: [] as any[],
    actions: [] as any[],
  });

  const handleSave = async () => {
    await onSave(rule);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-7 border border-gray-100 flex flex-col max-h-[90vh] overflow-y-auto transform scale-95 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Create Automation</h2>
            <p className="text-xs text-gray-500 mt-1">Design rules to automate task updates, webhooks, and Slack alerts.</p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  s === step
                    ? 'bg-automation-orange text-white shadow-lg shadow-automation-orange/20 scale-110'
                    : s < step
                    ? 'bg-automation-orange/10 text-automation-orange'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
                    s < step ? 'bg-automation-orange' : 'bg-gray-100'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Rule Name (Always Visible) */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Automation Name</label>
          <input
            type="text"
            placeholder="e.g. Notify Slack on Layout Status Done"
            value={rule.name}
            onChange={(e) => setRule({ ...rule, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-automation-orange transition-all duration-200"
          />
        </div>

        {/* Step 1: Trigger */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-md font-bold text-gray-700">1. When this happens (Trigger)</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'status_changed', title: 'Status Changed', desc: 'Runs when a resource transitions statuses.' },
                { id: 'date_based', title: 'Due Date Reached', desc: 'Trigger actions on or before the due date.' },
                { id: 'manual', title: 'Manual Button', desc: 'Deploy trigger on-demand from card view.' },
                { id: 'cron', title: 'Scheduled Interval', desc: 'Run routine synchronizations regularly.' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setRule({ ...rule, trigger: t.id })}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                    rule.trigger === t.id
                      ? 'border-automation-orange bg-automation-light shadow-sm'
                      : 'border-gray-200/60 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-sm text-gray-800">{t.title}</div>
                  <div className="text-[11px] text-gray-500 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!rule.name.trim()}
                className="px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Conditions */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-700">2. If these conditions are met</h3>
              <button
                onClick={() =>
                  setRule({
                    ...rule,
                    conditions: [...rule.conditions, { field: 'status', operator: 'equals', value: '' }],
                  })
                }
                className="text-xs font-semibold text-automation-orange hover:underline"
              >
                + Add Condition
              </button>
            </div>

            {rule.conditions.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
                No conditions added. The rule will run unconditionally.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {rule.conditions.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                    <select
                      value={condition.field}
                      onChange={(e) => {
                        const newConditions = [...rule.conditions];
                        newConditions[index].field = e.target.value;
                        setRule({ ...rule, conditions: newConditions });
                      }}
                      className="p-2 border border-gray-200 bg-white rounded-lg text-xs"
                    >
                      <option value="status">Status</option>
                      <option value="assignee">Assignee</option>
                      <option value="type">Resource Type</option>
                    </select>
                    <select
                      value={condition.operator}
                      onChange={(e) => {
                        const newConditions = [...rule.conditions];
                        newConditions[index].operator = e.target.value;
                        setRule({ ...rule, conditions: newConditions });
                      }}
                      className="p-2 border border-gray-200 bg-white rounded-lg text-xs"
                    >
                      <option value="equals">Equals</option>
                      <option value="not_equals">Does Not Equal</option>
                      <option value="contains">Contains</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Value"
                      value={condition.value}
                      onChange={(e) => {
                        const newConditions = [...rule.conditions];
                        newConditions[index].value = e.target.value;
                        setRule({ ...rule, conditions: newConditions });
                      }}
                      className="p-2 border border-gray-200 bg-white rounded-lg text-xs flex-1"
                    />
                    <button
                      onClick={() => {
                        const newConditions = [...rule.conditions];
                        newConditions.splice(index, 1);
                        setRule({ ...rule, conditions: newConditions });
                      }}
                      className="text-red-500 hover:text-red-700 p-1.5"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Actions */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-700">3. Then perform these actions</h3>
              <button
                onClick={() =>
                  setRule({
                    ...rule,
                    actions: [...rule.actions, { type: 'notify', url: '', title: '' }],
                  })
                }
                className="text-xs font-semibold text-automation-orange hover:underline"
              >
                + Add Action
              </button>
            </div>

            {rule.actions.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
                Add at least one action to execute.
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {rule.actions.map((action, index) => (
                  <div key={index} className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <select
                        value={action.type}
                        onChange={(e) => {
                          const newActions = [...rule.actions];
                          newActions[index].type = e.target.value;
                          setRule({ ...rule, actions: newActions });
                        }}
                        className="p-2 border border-gray-200 bg-white rounded-lg text-xs"
                      >
                        <option value="notify">Notify Team Members</option>
                        <option value="update_status">Update Layout Status</option>
                        <option value="webhook">Post JSON Webhook</option>
                      </select>
                      <button
                        onClick={() => {
                          const newActions = [...rule.actions];
                          newActions.splice(index, 1);
                          setRule({ ...rule, actions: newActions });
                        }}
                        className="text-red-500 hover:text-red-700 p-1.5"
                      >
                        ✕
                      </button>
                    </div>

                    {action.type === 'webhook' && (
                      <input
                        type="text"
                        placeholder="Webhook Target URL (https://...)"
                        value={action.url || ''}
                        onChange={(e) => {
                          const newActions = [...rule.actions];
                          newActions[index].url = e.target.value;
                          setRule({ ...rule, actions: newActions });
                        }}
                        className="w-full p-2 border border-gray-200 bg-white rounded-lg text-xs"
                      />
                    )}

                    {action.type === 'notify' && (
                      <input
                        type="text"
                        placeholder="Alert Title"
                        value={action.title || ''}
                        onChange={(e) => {
                          const newActions = [...rule.actions];
                          newActions[index].title = e.target.value;
                          setRule({ ...rule, actions: newActions });
                        }}
                        className="w-full p-2 border border-gray-200 bg-white rounded-lg text-xs"
                      />
                    )}

                    {action.type === 'update_status' && (
                      <select
                        value={action.value || ''}
                        onChange={(e) => {
                          const newActions = [...rule.actions];
                          newActions[index].value = e.target.value;
                          setRule({ ...rule, actions: newActions });
                        }}
                        className="w-full p-2 border border-gray-200 bg-white rounded-lg text-xs"
                      >
                        <option value="">Select Target Status...</option>
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Done">Done</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={rule.actions.length === 0}
                className="px-5 py-2.5 bg-automation-orange text-white rounded-xl hover:bg-automation-orange/95 disabled:opacity-50 transition-colors font-semibold"
              >
                Save Rule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
