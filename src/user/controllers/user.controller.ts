import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { Roles } from '@permission/role/decorators/role.decorator';
import { Role } from '@permission/role/enums/role.enum';
import { CreateUserDto, createUserSchema } from '../dtos/user.dto';
import { UserService } from '@user/services/user.service';
import { isAdmin } from '@common/utils';

@Roles(Role.Admin, Role.Manager)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get(':uid')
  findByUid(@Req() request: Request, @Param('uid') uid: string) {
    if (isAdmin(request['payload'].user)) {
      return this.userService.findOne({ uid });
    }
    return this.userService.findOneWithoutAdmin({ uid });
  }

  @Get('/username/:username')
  findByUsername(@Req() request: Request, @Param('username') username: string) {
    if (isAdmin(request['payload'].user)) {
      return this.userService.findOne({ username });
    }
    return this.userService.findOneWithoutAdmin({ username });
  }

  @Post('/create')
  @Roles(Role.Admin)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    if (await this.userService.exists(createUserDto.username)) {
      throw new InternalServerErrorException('账号已经存在');
    }
    return this.userService.create(createUserDto);
  }
}
