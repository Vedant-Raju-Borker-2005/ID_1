'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '../../stores/aiStore';

interface AIChatProps {
  messages: Message[];
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function AIChat({ messages, onSend, isLoading }: AIChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await onSend(input);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[460px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 mt-8">
            <div className="w-12 h-12 rounded-2xl bg-ai-light flex items-center justify-center text-ai-purple text-xl font-bold mb-3 shadow-inner">
              ✦
            </div>
            <h3 className="text-sm font-semibold text-gray-700">AI Architectural Agent</h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1">
              Ask about spatial spacing, material selection, mood boards, or render settings to optimize your floor plan.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-50 duration-200`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[9px] mt-1 text-right select-none ${
                    msg.role === 'user' ? 'text-white/60' : 'text-gray-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-ai-purple rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-ai-purple rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-ai-purple rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI for design insights..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-all duration-200 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors duration-150 disabled:bg-gray-200 disabled:text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
