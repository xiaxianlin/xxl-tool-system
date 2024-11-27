import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes } from '@nestjs/common';
import { CreateUserDto, createUserSchema, ModifyUserDto, modifyUserSchema } from './user-account.dto';
import { SearchParamsParsePipe } from '@common/pipes/serach-params-parse.pipe';
import { SearchParams } from '@common/interfaces/search.interface';
import { omit } from 'lodash';
import { UserAccountService } from './user-account.service';

@Controller('user')
export class UserController {
  constructor(private userAccountService: UserAccountService) {}

  @Get('/search')
  @UsePipes(SearchParamsParsePipe)
  async searchUsers(@Query() params: SearchParams) {
    return this.userAccountService.searchUsers(params);
  }

  @Get('/:uid')
  async getUser(@Param('uid') uid: string) {
    const user = await this.userAccountService.getActiveUser({ uid });
    return omit(user, 'password');
  }

  @Post('/')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userAccountService.createUser(createUserDto);
  }

  @Delete('/:uid')
  async remove(@Param('uid') uid: string) {
    const res = await this.userAccountService.deleteUser(uid);
    return { success: res };
  }

  @Put('/:uid')
  @UsePipes(new ZodValidationPipe(modifyUserSchema))
  async modifyUser(@Body() dto: ModifyUserDto, @Param('uid') uid: string) {
    const res = this.userAccountService.modifyUser(uid, dto);
    return { success: res };
  }

  @Patch('/status/:uid/:status')
  async modifyUserStatus(@Param('uid') uid: string, @Param('status') status: number) {
    const res = await this.userAccountService.modifyUserStatus(uid, status);
    return { success: res };
  }
}
