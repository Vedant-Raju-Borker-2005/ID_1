'use client';

import { useVendorAssignments } from "../../hooks/vendor/useVendorAssignments";

export function VendorAssignmentTable() {
  const { assignments, loading, handleAccept, handleReject } = useVendorAssignments();

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-xs">Loading assignments...</div>;
  }

  return (
    <div className="overflow-hidden border border-gray-200/60 rounded-2xl bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/70 border-b border-gray-150">
          <tr>
            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Project / Item</th>
            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</th>
            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-150 text-sm">
          {assignments.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
              <td className="p-4 font-semibold text-gray-800">
                {item.project?.name || item.project || "Villa Design"}
              </td>
              <td className="p-4">
                <span
                  className={`px-2.5 py-1 text-[10px] leading-5 font-bold rounded-full uppercase tracking-wider border ${
                    item.status === 'ACCEPTED'
                      ? 'bg-green-50 text-green-700 border-green-150'
                      : item.status === 'REJECTED'
                      ? 'bg-red-50 text-red-750 border-red-150'
                      : 'bg-yellow-50 text-yellow-750 border-yellow-150'
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="p-4 text-gray-500 font-medium">
                {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
              </td>
              <td className="p-4 space-x-2">
                {item.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleAccept(item.id)}
                    className="px-3 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-xs font-bold transition-all shadow-sm"
                  >
                    Accept
                  </button>
                )}
                {item.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleReject(item.id)}
                    className="px-3 py-1.5 border border-gray-250 text-gray-650 rounded-lg hover:bg-gray-55 text-xs font-bold transition-all shadow-sm"
                  >
                    Reject
                  </button>
                )}
                <button
                  className="px-3 py-1.5 border border-brand-200 text-brand-650 rounded-lg hover:bg-brand-50 text-xs font-bold transition-all"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
          {assignments.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-450 text-xs">
                No assignments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
