'use client';

import { VendorAssignmentTable } from "../../../components/vendor/VendorAssignmentTable";

export default function VendorAssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Assigned Design Elements</h1>
        <p className="text-xs text-gray-400 mt-1">Manage project items, accept or decline layout requests, and trace delivery milestones.</p>
      </div>

      <VendorAssignmentTable />
    </div>
  );
}
