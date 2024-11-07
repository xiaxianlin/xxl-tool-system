import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class XAiService {
  private client: OpenAI;
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    });
  }

  async sendMessage(message: string) {
    const completion = await this.client.chat.completions.create({
      model: 'grok-beta',
      messages: [
        {
          role: 'system',
          content: '你是一名专业的心理咨询师，你可以回答任何心理相关的问题.',
        },
        { role: 'user', content: message },
      ],
    });

    return completion.choices[0].message;
  }
}
