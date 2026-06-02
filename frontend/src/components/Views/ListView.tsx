'use client';

interface Resource {
  id: string;
  title: string;
  status: string;
  assignee?: string;
}

interface ListViewProps {
  resources: Resource[];
  onEdit: (id: string) => void;
}

export function ListView({ resources, onEdit }: ListViewProps) {
  return (
    <div className="overflow-hidden border border-gray-200/60 rounded-2xl shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50/70 backdrop-blur-sm">
          <tr>
            <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Assignee</th>
            <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-150">
          {resources.map((resource) => (
            <tr key={resource.id} className="hover:bg-gray-50/50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                {resource.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs">
                <span
                  className={`px-2.5 py-1 inline-flex text-[10px] leading-5 font-bold rounded-full uppercase tracking-wide ${
                    resource.status === 'Done'
                      ? 'bg-green-50 text-green-700 border border-green-150'
                      : resource.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700 border border-blue-150'
                      : 'bg-gray-50 text-gray-600 border border-gray-150'
                  }`}
                >
                  {resource.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                {resource.assignee || 'Unassigned'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(resource.id)}
                  className="text-brand-650 hover:text-brand-700 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
