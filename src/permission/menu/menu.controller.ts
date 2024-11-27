import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { MenuDto, menuSchema } from './menu.dto';
import { MenuService } from './menu.service';

@Controller('/menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  async allMenus() {
    return this.menuService.allMenus();
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
