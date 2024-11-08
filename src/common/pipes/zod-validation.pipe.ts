import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  private readonly logger = new Logger(ZodValidationPipe.name);

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    this.logger.log(JSON.stringify(value));
    const { success, error, data } = this.schema.safeParse(value);
    if (!success) {
      throw new BadRequestException({
        message: '请求参数校验失败',
        data: error.errors,
      });
    }
    return data;
  }
}
