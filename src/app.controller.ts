import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from './permission/auth/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from '@permission/auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('check_login')
  async checkLogin(@Req() req: Request) {
    return req.user?.['uid'];
  }
}
