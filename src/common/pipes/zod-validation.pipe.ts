import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, _: ArgumentMetadata) {
    const { success, error, data } = this.schema.safeParse(value);
    if (success) return data;
    throw new BadRequestException({
      message: '请求参数校验失败',
      data: error.errors,
    });
  }
}
