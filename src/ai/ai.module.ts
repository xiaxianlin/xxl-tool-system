import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { XAiService } from './services/x-ai.service';
import { MoonshotService } from './services/moonshot.service';
import { OpenAIService } from './services/openai.service';

@Module({
  controllers: [AiController],
  providers: [XAiService, MoonshotService, OpenAIService],
})
export class AiModule {}
