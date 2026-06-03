'use client';

import { useEffect, useState } from 'react';
import { useProjectTeamStore } from '../../../../stores/projectTeamStore';

export default function ProjectTeamPage({ params }: { params: { id: string } }) {
  const { members, fetchMembers, assignMember, isLoading, error, clearError } =
    useProjectTeamStore();

  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('TECHNICIAN');
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchMembers(params.id);
  }, [params.id, fetchMembers]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    clearError();
    setSuccessMsg('');
    try {
      await assignMember(params.id, userId, role);
      setUserId('');
      setSuccessMsg('Member assigned successfully!');
      setShowAssignForm(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {}
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'MANAGER':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'COORDINATOR':
        return 'bg-brand-50 text-brand-700 border-brand-200';
      default:
        return 'bg-teal-50 text-teal-700 border-teal-200';
    }
  };

  const managerCount = members.filter((m) => m.role === 'MANAGER').length;
  const coordinatorCount = members.filter((m) => m.role === 'COORDINATOR').length;
  const technicianCount = members.filter((m) => m.role === 'TECHNICIAN').length;

  return (
    <div className="p-8 bg-gray-50/50 min-h-screen space-y-8 select-none">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Project Team</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage roles, workspace coordination, and technical executors.
          </p>
        </div>
        <button
          onClick={() => {
            setShowAssignForm(!showAssignForm);
            clearError();
          }}
          className="px-4 py-2 border border-gray-250/50 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          {showAssignForm ? '✕ Close' : 'Assign Team Member'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Total active team
          </span>
          <div className="text-2xl font-black text-gray-800 mt-1">{members.length}</div>
        </div>

        <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Managers
          </span>
          <div className="text-2xl font-black text-purple-700 mt-1">{managerCount}</div>
        </div>

        <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Coordinators
          </span>
          <div className="text-2xl font-black text-brand-650 mt-1">{coordinatorCount}</div>
        </div>

        <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Technicians
          </span>
          <div className="text-2xl font-black text-teal-700 mt-1">{technicianCount}</div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-2xl text-xs text-green-700 font-bold">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl text-xs text-red-700 font-bold">
          {error}
        </div>
      )}

      {/* Assign Member Form */}
      {showAssignForm && (
        <div className="bg-white border border-gray-200/60 p-6 rounded-2xl shadow-sm max-w-md">
          <h3 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wider">
            Assign New Member
          </h3>
          <form onSubmit={handleAssign} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                User ID
              </label>
              <input
                type="text"
                placeholder="Enter User UUID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-brand-500 outline-none font-medium text-gray-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Project Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-brand-500 outline-none font-semibold text-gray-700"
              >
                <option value="MANAGER">Manager</option>
                <option value="COORDINATOR">Coordinator</option>
                <option value="TECHNICIAN">Technician</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Confirm Assignment
            </button>
          </form>
        </div>
      )}

      {/* Team List Table */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400 text-xs font-bold">Loading...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/70 border-b border-gray-200/50">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Member
                </th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Project Role
                </th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 text-sm">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-4 flex items-center space-x-3.5">
                    <img
                      src={
                        member.user?.avatarUrl ||
                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
                      }
                      alt={member.user?.name || 'Avatar'}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {member.user?.name || 'Anonymous User'}
                      </div>
                      <div className="text-[10px] text-gray-400">{member.user?.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${getRoleBadge(
                        member.role
                      )}`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-semibold ${
                        member.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}

              {members.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-gray-400 text-xs font-semibold">
                    No team members assigned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
