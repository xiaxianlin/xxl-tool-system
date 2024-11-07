import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { XAiService } from './services/x-ai.service';
import { MoonshotService } from './services/moonshot.service';

@Module({
  controllers: [AiController],
  providers: [XAiService, MoonshotService],
})
export class AiModule {}
