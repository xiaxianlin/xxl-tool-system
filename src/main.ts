import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from '@user/services/user.service';
import { HttpExceptionFilter } from '@common/filters/http-expception.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { ServerExceptionFilter } from '@common/filters/server-exception.filter';
import { routeLogger } from '@common/middlewares/route-logger.middleware';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.use(routeLogger);

  app.useGlobalFilters(new ServerExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT);
  // 初始化超级管理员账户
  await app
    .get(UserService)
    .initAdmin(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
};
bootstrap();
