import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

export class AIService {
  private openai: OpenAI;
  private context: ChatCompletionMessageParam[] = [];

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async generateSuggestions(userInput: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          ...this.context,
          { role: 'user', content: userInput }
        ],
        model: 'gpt-4-turbo-preview',
        temperature: 0.7,
      });

      const suggestion = completion.choices[0]?.message?.content || '';
      this.context.push({ role: 'assistant', content: suggestion });
      return suggestion;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      throw new Error('Failed to generate suggestions');
    }
  }

  async analyzeConversation(conversation: string[]): Promise<{
    sentiment: string;
    topics: string[];
    nextActions: string[];
  }> {
    try {
      const analysis = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Analyze this conversation and provide sentiment, main topics, and suggested next actions in JSON format.'
          },
          {
            role: 'user',
            content: conversation.join('\n')
          }
        ],
        model: 'gpt-4-turbo-preview',
        response_format: { type: 'json_object' },
      });

      return JSON.parse(analysis.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Error analyzing conversation:', error);
      throw new Error('Failed to analyze conversation');
    }
  }

  async generateTags(content: string): Promise<string[]> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Generate relevant tags for the following content. Return as JSON array.'
          },
          {
            role: 'user',
            content
          }
        ],
        model: 'gpt-4-turbo-preview',
        response_format: { type: 'json_object' },
      });

      return JSON.parse(completion.choices[0]?.message?.content || '[]').tags;
    } catch (error) {
      console.error('Error generating tags:', error);
      throw new Error('Failed to generate tags');
    }
  }
} 