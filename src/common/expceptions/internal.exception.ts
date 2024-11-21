import { HttpException } from '@nestjs/common';

export class InternalException extends HttpException {
  constructor(message: string, status = 10000) {
    super(message, status);
  }
}
