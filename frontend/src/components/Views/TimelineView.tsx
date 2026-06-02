'use client';

interface Resource {
  id: string;
  title: string;
  status: string;
  createdAt: Date | string;
  dueDate?: Date | string | null;
}

interface TimelineViewProps {
  resources: Resource[];
}

export function TimelineView({ resources }: TimelineViewProps) {
  // Simple representation of layout tasks over weeks
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm overflow-hidden select-none">
      <h3 className="font-bold text-gray-800 text-sm mb-6 uppercase tracking-wider">Project Timeline (Gantt)</h3>
      
      <div className="flex flex-col border border-gray-150 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex border-b border-gray-150 bg-gray-50/70">
          <div className="w-1/3 p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-r border-gray-150">
            Design Resource / Milestone
          </div>
          <div className="w-2/3 flex">
            {weeks.map((week, idx) => (
              <div key={idx} className="flex-1 text-center p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-r border-gray-150 last:border-r-0">
                {week}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-150">
          {resources.map((res, index) => {
            // Mocking span of weeks based on resource indices to create a beautiful demo timeline
            const spanClass =
              index % 4 === 0
                ? 'col-start-1 col-span-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white'
                : index % 4 === 1
                ? 'col-start-2 col-span-3 bg-gradient-to-r from-ai-purple to-ai-violet text-white'
                : index % 4 === 2
                ? 'col-start-3 col-span-2 bg-gradient-to-r from-automation-orange to-automation-amber text-white'
                : 'col-start-1 col-span-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white';

            return (
              <div key={res.id} className="flex items-center hover:bg-gray-50/40 transition-colors">
                <div className="w-1/3 p-4 text-sm font-semibold text-gray-700 border-r border-gray-150 truncate">
                  {res.title}
                </div>
                <div className="w-2/3 p-4">
                  <div className="grid grid-cols-4 gap-2">
                    <div className={`${spanClass} text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-sm truncate flex items-center justify-between`}>
                      <span>{res.status}</span>
                      <span className="opacity-75">ID: {res.id.substring(0, 4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
