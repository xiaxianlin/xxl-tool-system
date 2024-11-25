import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Roles } from '@permission/role/role.decorator';
import { Role } from '@permission/role/enums/role.enum';
import {
  CreateUserDto,
  createUserSchema,
  ModifyUserDto,
  modifyUserSchema,
} from '../dtos/user.dto';
import { UserService } from '@user/services/user.service';
import { SearchParamsParsePipe } from '@common/pipes/serach-params-parse.pipe';
import { SearchParams } from '@common/interfaces/search.interface';
import { omit } from 'lodash';

@Roles(Role.Admin)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/search')
  @UsePipes(SearchParamsParsePipe)
  async searchUsers(@Query() params: SearchParams) {
    return this.userService.searchUsers(params);
  }

  @Get('/:uid')
  async getUser(@Param('uid') uid: string) {
    const user = await this.userService.getActiveUser({ uid });
    return omit(user, 'password');
  }

  @Post('/')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Delete('/:uid')
  async remove(@Param('uid') uid: string) {
    const res = await this.userService.deleteUser(uid);
    return { success: res };
  }

  @Put('/:uid')
  @UsePipes(new ZodValidationPipe(modifyUserSchema))
  async modifyUser(@Body() dto: ModifyUserDto, @Param('uid') uid: string) {
    const res = this.userService.modifyUser(uid, dto);
    return { success: res };
  }

  @Patch('/status/:uid/:status')
  async modifyUserStatus(
    @Param('uid') uid: string,
    @Param('status') status: number,
  ) {
    const res = await this.userService.modifyUserStatus(uid, status);
    return { success: res };
  }
}
