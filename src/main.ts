import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@common/filters/http-expception.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { ServerExceptionFilter } from '@common/filters/server-exception.filter';
import { routeLogger } from '@common/middlewares/route-logger.middleware';
import { AppService } from './app.service';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.use(routeLogger);

  app.useGlobalFilters(new ServerExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.get(AppService).initData();
  await app.listen(process.env.PORT);
};
bootstrap();
