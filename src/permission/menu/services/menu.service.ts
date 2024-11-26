import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItemEntity } from '../entities/menu.entity';
import { Repository } from 'typeorm';
import { MenuDto } from '../menu.dto';
import { InternalException } from '@common/expceptions/internal.exception';
import { time } from '@common/utils/time';
import { MenuGroupEntity } from '../entities/group.entity';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItemEntity)
    private menuRepository: Repository<MenuItemEntity>,
  ) {}

  async initMenu(key: string, name: string) {
    const menu = await this.menuRepository.findOneBy({ key });
    if (menu) {
      return true;
    }
    await this.createMenu({ key, name });
  }

  async createMenu(dto: MenuDto) {
    const menu = await this.menuRepository.existsBy({ key: dto.key });
    if (menu) {
      throw new InternalException('菜单 key 已经存在');
    }

    const entity = this.menuRepository.create({
      ...dto,
      createTime: Date.now().toString(),
    });

    const res = await this.menuRepository.insert(entity);
    return !!res.raw.affectedRows;
  }

  async modifyMenu(dto: MenuDto) {
    const menu = await this.menuRepository.existsBy({ key: dto.key });
    if (!menu) {
      throw new InternalException('菜单不存在');
    }

    const res = await this.menuRepository.update(
      { key: dto.key },
      { name: dto.name, group: dto.group, updateTime: time.current() },
    );
    return !!res.affected;
  }

  async deleteMenu(key: string) {
    const menu = await this.menuRepository.existsBy({ key });
    if (!menu) {
      return true;
    }
    const res = await this.menuRepository.delete({ key });
    return !!res.affected;
  }

  async allMenus() {
    return this.menuRepository.find({ where: { status: 1 } });
  }
}
