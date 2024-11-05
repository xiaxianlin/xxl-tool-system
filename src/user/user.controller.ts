import { Controller, Get, Param } from '@nestjs/common';
import { Roles } from '@permission/role/decorators/role.decorator';
import { Role } from '@permission/role/enums/role.enum';

@Roles(Role.Admin)
@Controller('user')
export class UserController {
  @Get(':uid')
  find(@Param('uid') uid: string) {
    return 'user ' + uid;
  }
}
