import { OpenAI } from 'openai';

const openAIApiKey = process.env.OPENAI_API_KEY || 'mock-key';

export const openaiClient = new OpenAI({
  apiKey: openAIApiKey,
});

export const aiProvider = {
  getClient() {
    return openaiClient;
  },
  
  getSystemPrompt() {
    return 'You are an elite, modern interior design and architectural design visualization assistant. Provide precise, creative, and structured guidance on spatial planning, color palettes, materials, lighting, and layout optimization.';
  },

  async estimateTokens(text: string): Promise<number> {
    // Basic fallback estimation (approx 4 chars per token)
    return Math.ceil(text.length / 4);
  }
};
