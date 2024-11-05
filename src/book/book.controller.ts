import { Controller, Get } from '@nestjs/common';
import { Roles } from 'src/permission/role/decorators/role.decorator';
import { Role } from 'src/permission/role/enums/role.enum';

@Roles(Role.Admin, Role.Manager)
@Controller('book')
export class BookController {
  @Get('list')
  list() {
    return [];
  }
}
