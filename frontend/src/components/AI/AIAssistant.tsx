'use client';

import { useState } from 'react';
import { useAIStore } from '../../stores/aiStore';
import { AIChat } from './AIChat';

export function AIAssistant() {
  const { chatHistory, sendMessage, isLoading, clearHistory } = useAIStore();

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;
    await sendMessage(messageText);
  };

  return (
    <div className="flex flex-col h-[600px] w-96 bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-brand-600 to-ai-violet text-white flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping absolute" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <h2 className="text-md font-bold tracking-tight pl-3">Design AI Assistant</h2>
        </div>
        <button
          onClick={clearHistory}
          className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition-colors duration-150"
        >
          Clear Chat
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <AIChat messages={chatHistory} onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
