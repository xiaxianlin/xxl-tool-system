import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Roles } from '@permission/role/decorators/role.decorator';
import { Role } from '@permission/role/enums/role.enum';
import {
  CreateUserDto,
  createUserSchema,
  ModifyUsernameDto,
  modifyUsernameSchema,
  ResetPasswordDto,
  resetPasswordSchema,
} from '../dtos/user.dto';
import { UserService } from '@user/services/user.service';
import { z } from 'zod';
import { SearchParamsParsePipe } from '@common/pipes/serach-params-parse.pipe';
import { SearchParams } from '@common/interfaces/search.interface';

@Roles(Role.Admin)
@Controller('user')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private userService: UserService) {}

  @Get('/search')
  @UsePipes(SearchParamsParsePipe)
  async search(@Query() params: SearchParams) {
    return this.userService.search(params);
  }

  @Get('/:uid')
  findByUid(@Param('uid') uid: string) {
    return this.userService.findUser({ uid });
  }

  @Post('/')
  @Roles(Role.Admin)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Delete('/:uid')
  async remove(@Param('uid') uid: string) {
    this.logger.log(`'remove uid: ${uid}'`);
    await this.userService.remove(uid);
    return { success: true };
  }

  @Patch('/username/:uid')
  @UsePipes(new ZodValidationPipe(modifyUsernameSchema))
  async resetUsername(
    @Body() dto: ModifyUsernameDto,
    @Param('uid') uid: string,
  ) {
    return this.userService.resetPassword(uid, dto.username);
  }

  @Patch('/password/:uid')
  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Param('uid') uid: string,
  ) {
    return this.userService.resetPassword(uid, dto.password);
  }
}
