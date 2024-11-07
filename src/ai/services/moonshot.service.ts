import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Response } from 'express';

@Injectable()
export class MoonshotService {
  private client: OpenAI;
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.MOONSHOT_API_KEY,
      baseURL: 'https://api.moonshot.cn/v1',
    });
  }

  async sendMessage(message: string, res: Response) {
    const stream = await this.client.chat.completions.create({
      model: 'moonshot-v1-8k',
      messages: [
        {
          role: 'system',
          content: '你是一名专业的心理咨询师，你可以回答任何心理相关的问题.',
        },
        { role: 'user', content: message },
      ],
      stream: true,
    });

    for await (const part of stream) {
      console.log(part.choices[0]);
      const content = part.choices[0]?.delta?.content || '';
      res.write(content);
    }
    res.end();
  }
}
