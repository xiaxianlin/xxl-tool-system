import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    host.switchToHttp().getResponse<Response>().status(200).json({
      status: 500,
      message: '服务器异常，请稍后处理',
      error: exception.message,
    });
  }
}
