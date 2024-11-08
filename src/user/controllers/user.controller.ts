import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Roles } from '@permission/role/decorators/role.decorator';
import { Role } from '@permission/role/enums/role.enum';
import {
  CreateUserDto,
  createUserSchema,
  UpdatePasswordDto,
  updatePasswordSchema,
  UpdateUsernameDto,
  updateUsernameSchema,
  UserSearchDto,
} from '../dtos/user.dto';
import { UserService } from '@user/services/user.service';
import { z } from 'zod';
import { SearchParamsParsePipe } from '@common/pipes/serach-params-parse.pipe';
import { SearchParams } from '@common/interfaces/search.interface';

@Roles(Role.Admin)
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Post('/create')
  @Roles(Role.Admin)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/get/:uid')
  findByUid(@Param('uid') uid: string) {
    return this.userService.findOne({ uid });
  }

  @Post('/delete/:uid')
  async remove(@Param('uid') uid: string) {
    this.logger.log(`'remove uid: ${uid}'`);
    await this.userService.remove(uid);
    return { success: true };
  }

  @Post('/update_username/:uid')
  @UsePipes(new ZodValidationPipe(updateUsernameSchema))
  async updateUsername(
    @Body() updateUsernameDto: UpdateUsernameDto,
    @Param('uid') uid: string,
  ) {
    return this.userService.updateUsername(uid, updateUsernameDto.username);
  }

  @Post('/update_password/:uid')
  @UsePipes(new ZodValidationPipe(updatePasswordSchema))
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('uid') uid: string,
  ) {
    return this.userService.updatePassword(uid, updatePasswordDto);
  }

  @Get('/search')
  @UsePipes(SearchParamsParsePipe)
  async search(@Query() params: SearchParams) {
    return this.userService.search(params);
  }
}
