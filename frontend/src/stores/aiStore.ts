import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIState {
  chatHistory: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearHistory: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  chatHistory: [],
  isLoading: false,

  sendMessage: async (message: string) => {
    set({ isLoading: true });
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    set((state) => ({
      chatHistory: [...state.chatHistory, newMessage],
    }));

    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: `AI Response to: ${message}. Based on modern interior design principles, this space would benefit from balanced functional zoning, contrasting warm neutral textures, and architectural recessed lighting.`,
        timestamp: new Date(),
      };
      set((state) => ({
        chatHistory: [...state.chatHistory, response],
        isLoading: false,
      }));
    }, 1500);
  },

  clearHistory: () => set({ chatHistory: [] }),
}));
