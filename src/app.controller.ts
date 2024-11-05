import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './permission/auth/decorators/public.decorator';

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }
}
