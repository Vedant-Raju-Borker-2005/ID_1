'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface ProjectChartProps {
  data: any[];
}

export function ProjectChart({ data }: ProjectChartProps) {
  // Map data to chart structure
  const chartData = data && data.length > 0
    ? data.slice(0, 10).map((item) => ({
        name: item.project?.name || "Project",
        value: item.status === "ACCEPTED" ? 1 : 0.5,
      }))
    : [
        { name: "Villa A", value: 1 },
        { name: "Villa B", value: 0.8 },
        { name: "Office A", value: 0.4 },
        { name: "Office B", value: 1 },
        { name: "Studio A", value: 0.6 },
      ];

  return (
    <div className="bg-white border border-gray-250/50 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-800 text-sm mb-6 uppercase tracking-wider">Monthly Project Activity</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <Tooltip contentStyle={{ background: '#1f2937', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar dataKey="value" fill="#1d4ed8" name="Project Weight" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
