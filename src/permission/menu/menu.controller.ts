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
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { GroupDto, groupSchema, MenuDto, menuSchema } from './menu.dto';
import { MenuItemService } from './services/menu.service';
import { MenuGroupService } from './services/group.service';
import { groupBy } from 'lodash';

@Controller('/menu')
export class MenuController {
  constructor(
    private menuService: MenuItemService,
    private groupService: MenuGroupService,
  ) {}

  @Post('/group')
  @UsePipes(new ZodValidationPipe(groupSchema))
  async createMenuGroup(@Body() dto: GroupDto) {
    return this.groupService.createMenuGroup(dto);
  }

  @Put('/group')
  @UsePipes(new ZodValidationPipe(groupSchema))
  async modifyMenuGroup(@Body() dto: GroupDto) {
    return this.groupService.modifyMenuGroup(dto);
  }

  @Delete('/group/:key')
  async deleteMenuGroup(@Param('key') key: string) {
    return this.groupService.deleteMenuGroup(key);
  }

  @Get()
  async allMenus() {
    const groups = await this.groupService.allGroups();
    const menus = await this.menuService.allMenus();
    const data = groupBy(menus, 'group');
    return groups.map((g) => ({ ...g, menus: data[g.key] }));
  }

  @Post()
  @UsePipes(new ZodValidationPipe(menuSchema))
  async createMenu(@Body() dto: MenuDto) {
    return this.menuService.createMenu(dto);
  }

  @Put()
  @UsePipes(new ZodValidationPipe(menuSchema))
  async modifyMenu(@Body() dto: MenuDto) {
    const res = await this.menuService.modifyMenu(dto);
    return { success: res };
  }

  @Delete(':key')
  async deleteMenu(@Param('key') key: string) {
    const res = await this.menuService.deleteMenu(key);
    return { success: res };
  }
}
