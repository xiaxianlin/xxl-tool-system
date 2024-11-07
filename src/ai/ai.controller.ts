import { Body, Controller, Post, Res, Header } from '@nestjs/common';
import { XAiService } from './services/x-ai.service';
import { MoonshotService } from './services/moonshot.service';
import { Response } from 'express';

@Controller('ai')
export class AiController {
  constructor(
    private xAiService: XAiService,
    private moonshotService: MoonshotService,
  ) {}

  @Post('counseling')
  @Header('Cache-Control', 'no-store')
  @Header('Content-Type', 'text/event-stream')
  @Header('Connection', 'keep-alive')
  async counseling(@Body() data: { message: string }, @Res() res: Response) {
    await this.moonshotService.sendMessage(data.message, res);
  }
}
