import { Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Public } from './permission/auth/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from '@permission/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import OssService from './shared/services/oss.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService, private ossService: OssService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('check_login')
  async checkLogin(@Req() req: Request) {
    const user: any = req.user;
    delete user?.password;
    return user;
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const path = await this.ossService.upload(file.originalname, file.buffer, 'image');
    return `http://img.ixxl.me/${path}`;
  }

  @Get('/configs')
  async configs() {
    return {
      adminRoleKey: process.env.ADMIN_ROLE_KEY,
    };
  }
}
