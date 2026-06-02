'use client';

interface Resource {
  id: string;
  type: string;
  title: string;
  content?: string | null;
  status: string;
  assignee?: { name: string; email: string } | null;
  dueDate?: Date | string | null;
  createdAt: Date | string;
}

interface ResourceViewProps {
  resource: Resource;
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
}

export function ResourceView({ resource, onClose, onDelete }: ResourceViewProps) {
  return (
    <div className="bg-white border border-gray-200/60 rounded-3xl p-6 shadow-xl w-full max-w-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] bg-brand-50 text-brand-700 border border-brand-150 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {resource.type}
          </span>
          <h2 className="text-xl font-bold text-gray-800 mt-2 leading-tight">{resource.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-650 hover:bg-gray-100 transition-all duration-150"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Details</label>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100">
            {resource.content || 'No details provided for this resource.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              {resource.status}
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Assignee</label>
            <div className="flex items-center space-x-2 text-sm text-gray-700 font-semibold">
              <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] font-bold">
                {resource.assignee?.name.charAt(0) || 'U'}
              </div>
              <span>{resource.assignee?.name || 'Unassigned'}</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Due Date</label>
            <p className="text-xs text-gray-600 font-medium">
              {resource.dueDate ? new Date(resource.dueDate).toLocaleDateString() : 'No due date'}
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Created At</label>
            <p className="text-xs text-gray-600 font-medium">
              {new Date(resource.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {onDelete && (
        <div className="border-t border-gray-100 pt-4 flex justify-end">
          <button
            onClick={() => onDelete(resource.id)}
            className="px-4 py-2 text-xs font-bold text-red-500 hover:text-red-755 hover:bg-red-50/50 rounded-xl transition-all duration-150"
          >
            Delete Resource
          </button>
        </div>
      )}
    </div>
  );
}
