'use client';

import { useEffect } from "react";
import { useVendorStore } from "../../../stores/vendorStore";
import { KpiCard } from "../../../components/vendor/KpiCard";
import { ProjectChart } from "../../../components/vendor/ProjectChart";

export default function VendorDashboardPage() {
  const { dashboard, loadDashboard } = useVendorStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const kpis = [
    { title: "Total Projects", value: dashboard?.kpi?.totalProjects || 8, trend: 12 },
    { title: "Pending Items", value: dashboard?.kpi?.pendingItems || 2, trend: -4 },
    { title: "Completed Items", value: dashboard?.kpi?.completedItems || 6, trend: 18 },
    { title: "Monthly Earnings", value: `$${dashboard?.kpi?.monthlyEarnings || 1540}`, trend: 24 },
  ];

  return (
    <div className="space-y-8 select-none">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Vendor Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">Real-time stats and metrics tracking for layout design execution.</p>
        </div>
        <button 
          onClick={loadDashboard} 
          className="px-4 py-2 border border-gray-250/50 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <KpiCard 
            key={idx} 
            title={kpi.title} 
            value={kpi.value} 
            trend={kpi.trend} 
          />
        ))}
      </div>

      {/* Visual Activity and Recent Assignments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectChart data={dashboard?.assignments || []} />
        
        <div className="bg-white border border-gray-250/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wider">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-500">Order Acceptance Rate</span>
                <span className="text-brand-600">{(dashboard?.kpi?.acceptanceRate || 92).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full rounded-full" style={{ width: `${dashboard?.kpi?.acceptanceRate || 92}%` }} />
              </div>

              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-500">Task Completion Rate</span>
                <span className="text-brand-600">{(dashboard?.kpi?.completionRate || 88).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full rounded-full" style={{ width: `${dashboard?.kpi?.completionRate || 88}%` }} />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4 mt-6 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <span>Calculated weekly</span>
            <span className="text-brand-600">View detailed analytics &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
