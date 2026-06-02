'use client';

import { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-250/30 rounded-full transition-colors focus:outline-none"
      >
        <svg
          className="w-5 h-5 text-gray-650"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-550 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center animate-bounce shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 w-96 mt-2 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-200/50 p-4.5 z-50 max-h-[500px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-155">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && onMarkAsRead(notification.id)}
                  className={`p-3 rounded-xl border-l-4 cursor-pointer transition-all duration-200 ${
                    notification.read ? 'bg-gray-50/50 hover:bg-gray-50' : 'bg-brand-50/30 hover:bg-brand-50/50'
                  } ${
                    notification.type === 'warning'
                      ? 'border-yellow-500'
                      : notification.type === 'error'
                      ? 'border-red-500'
                      : notification.type === 'success'
                      ? 'border-green-500'
                      : 'border-brand-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-gray-800">{notification.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismiss(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 p-0.5 rounded"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notification.message}</p>
                  <div className="text-[9px] text-gray-400 mt-1.5 font-medium">
                    {new Date(notification.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                  {notification.actionUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = notification.actionUrl!;
                      }}
                      className="mt-2 text-[11px] text-brand-600 font-semibold hover:underline flex items-center"
                    >
                      View Details &rarr;
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
