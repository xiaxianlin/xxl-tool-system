import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { Roles } from './role.decorator';
import { Role } from './enums/role.enum';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { RoleDto, roleSchema } from './role.dto';
import { RoleService } from './role.service';

@Controller('/role')
@Roles(Role.Admin)
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Get('')
  async allRoles() {
    return this.roleService.allRoles();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(roleSchema))
  async createRole(@Body() dto: RoleDto) {
    return this.roleService.createRole(dto);
  }

  @Put()
  @UsePipes(new ZodValidationPipe(roleSchema))
  async modifyRole(@Body() dto: RoleDto) {
    const res = await this.roleService.modifyRole(dto);
    return { success: res };
  }

  @Delete(':key')
  async deleteRole(@Param('key') key: string) {
    const res = await this.roleService.deleteRole(key);
    return { success: res };
  }
}
