import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { UserService } from '@user/services/user.service';
import { HttpExceptionFilter } from '@common/filters/http-expception.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';

const initAdminAccount = (app: INestApplication) => {
  const userService = app.get(UserService);
  userService.initAdmin(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
};

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  initAdminAccount(app);
  await app.listen(3000);
};
bootstrap();
