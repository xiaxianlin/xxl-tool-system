import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from './menu.entity';
import { Repository } from 'typeorm';
import { MenuDto } from './menu.dto';
import { InternalException } from '@common/expceptions/internal.exception';
import { time } from '@common/utils/time';
import { flatToTree } from '@common/utils/data';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
  ) {}

  async initMenu() {
    const menu = await this.menuRepository.findOneBy({ key: 'system' });
    if (menu) {
      return true;
    }
    const createTime = time.current();
    const initData = [
      { key: 'system', name: '系统管理', parent: '', createTime },
      { key: 'system_user', name: '用户管理', parent: 'system', createTime },
      { key: 'system_role', name: '角色管理', parent: 'system', createTime },
      { key: 'system_menu', name: '菜单管理', parent: 'system', createTime },
    ];
    const entities = this.menuRepository.create(initData);
    await this.menuRepository.insert(entities);
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
      { name: dto.name, parent: dto.parent, updateTime: time.current() },
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
    const menus = await this.menuRepository.find({ where: { status: 1 } });
    return flatToTree(menus, 'key', 'parent');
  }
}
