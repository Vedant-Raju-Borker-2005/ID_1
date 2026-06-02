'use client';

import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: number; // percentage
  icon?: React.ReactNode;
}

export function KpiCard({ title, value, trend, icon }: KpiCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-250/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-row items-center justify-between pb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-black text-gray-800 tracking-tight">{value}</div>
        {trend !== undefined && (
          <div className={`flex items-center text-xs mt-2 font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-650'}`}>
            {trend >= 0 ? (
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="mr-1 h-3.5 w-3.5" />
            )}
            <span>{Math.abs(trend)}% from last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
