'use client';

import { useState } from 'react';

interface Resource {
  id: string;
  title: string;
  dueDate?: Date | string | null;
  status: string;
}

interface CalendarViewProps {
  resources: Resource[];
  onDateChange?: (id: string, date: Date) => void;
}

export function CalendarView({ resources, onDateChange }: CalendarViewProps) {
  const [currentDate] = useState(new Date());

  // Generate calendar days for the current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Padding days for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days in current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const calendarDays = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm overflow-hidden select-none">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 text-md">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex space-x-1.5">
          <button className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs hover:bg-gray-100">&larr; Prev</button>
          <button className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs hover:bg-gray-100">Next &rarr;</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-150">
        {weekDays.map((day) => (
          <div key={day} className="bg-gray-50 py-2.5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="bg-white min-h-[90px] p-2" />;

          // Filter resources matching current date
          const dateStr = day.toDateString();
          const dayResources = resources.filter((r) => r.dueDate && new Date(r.dueDate).toDateString() === dateStr);

          return (
            <div key={day.toISOString()} className="bg-white min-h-[90px] p-2 flex flex-col hover:bg-gray-50/20 transition-colors">
              <span className="text-xs font-bold text-gray-400 self-end mb-1">{day.getDate()}</span>
              <div className="flex-1 space-y-1 overflow-y-auto max-h-[80px]">
                {dayResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-1 text-[10px] font-bold rounded-lg border bg-brand-50/50 text-brand-700 border-brand-100 truncate shadow-sm cursor-pointer"
                  >
                    {res.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
