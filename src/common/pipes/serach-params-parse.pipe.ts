import { SearchDto, SearchParams } from '@common/interfaces/search.interface';
import { PipeTransform, ArgumentMetadata, Logger } from '@nestjs/common';

export class SearchParamsParsePipe
  implements PipeTransform<SearchDto, SearchParams>
{
  private readonly logger = new Logger(SearchParamsParsePipe.name);
  transform(value: SearchDto, _: ArgumentMetadata) {
    const {
      page = 1,
      size = 10,
      field = 'createTime',
      order = 'DESC',
      ...filter
    } = value;

    const data = {
      filter,
      pagination: { page: Number(page), size: Number(size) },
      sort: { field, order },
    };
    this.logger.log(JSON.stringify(data));
    return data;
  }
}
