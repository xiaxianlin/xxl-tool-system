import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, _: ArgumentMetadata) {
    return value.size < 1024 * 1024;
  }
}
