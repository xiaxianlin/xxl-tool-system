import { DoubanService } from '@book/services/douban.service';
import { Controller, Post, Param, Body } from '@nestjs/common';
import { Roles } from 'src/permission/role/decorators/role.decorator';
import { Role } from 'src/permission/role/enums/role.enum';

@Roles(Role.Admin, Role.Manager)
@Controller('book')
export class BookController {
  constructor(private doubanService: DoubanService) {}
  @Post('/douban/:isbn')
  queryByDouban(@Param('isbn') isbn: string, @Body() data: any) {
    return this.doubanService.query(isbn, data?.cookie);
  }
}
