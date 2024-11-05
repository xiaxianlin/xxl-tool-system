import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { UserService } from '@user/services/user.service';

const initAdminAccount = (app: INestApplication) => {
  const userService = app.get(UserService);
  userService.initAdmin(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
};

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  initAdminAccount(app);
  await app.listen(3000);
};
bootstrap();
