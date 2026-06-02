'use client';

import { useWorkspaceStore } from '../../stores/workspaceStore';
import { useState } from 'react';

export function WorkspaceSwitcher() {
  const { currentWorkspace, workspaces, switchWorkspace } = useWorkspaceStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-60 px-4 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-ai-purple flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {currentWorkspace?.name.charAt(0).toUpperCase() || 'W'}
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-semibold text-gray-800 leading-none mb-1">
              {currentWorkspace?.name || 'Select Workspace'}
            </span>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider leading-none">
              {currentWorkspace?.plan || 'Free'} Plan
            </span>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-60 mt-2 bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] font-bold text-gray-400 px-3 py-1.5 uppercase tracking-wider">
            Your Workspaces
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  switchWorkspace(ws.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors duration-150 ${
                  ws.id === currentWorkspace?.id
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">{ws.name}</span>
                </div>
                {ws.id === currentWorkspace?.id && (
                  <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-2.5 pt-2.5">
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors duration-150 font-medium text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Workspace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
