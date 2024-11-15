import { Module } from '@nestjs/common';
import OssService from './services/oss.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({ timeout: 6000 })],
  providers: [OssService],
  exports: [OssService],
})
export class SharedModule {}
