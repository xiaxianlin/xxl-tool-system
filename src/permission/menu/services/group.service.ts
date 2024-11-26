import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InternalException } from '@common/expceptions/internal.exception';
import { time } from '@common/utils/time';
import { MenuGroupEntity } from '../entities/group.entity';
import { GroupDto } from '../menu.dto';
import { MenuItemService } from './menu.service';
import { MenuItemEntity } from '../entities/menu.entity';

@Injectable()
export class MenuGroupService {
  constructor(
    @InjectRepository(MenuGroupEntity)
    private groupRepository: Repository<MenuGroupEntity>,
    private dataSource: DataSource,
  ) {}

  async initMenuGroup(key: string, name: string) {
    const group = await this.groupRepository.findOneBy({ key });
    if (group) {
      return true;
    }
    await this.createMenuGroup({ key, name });
  }

  async createMenuGroup(dto: GroupDto) {
    const group = await this.groupRepository.existsBy({ key: dto.key });
    if (group) {
      throw new InternalException('分组 key 已经存在');
    }

    const entity = this.groupRepository.create({
      ...dto,
      createTime: Date.now().toString(),
    });

    const res = await this.groupRepository.insert(entity);
    return !!res.raw.affectedRows;
  }

  async modifyMenuGroup(dto: GroupDto) {
    const group = await this.groupRepository.existsBy({ key: dto.key });
    if (!group) {
      throw new InternalException('分组不存在');
    }

    const res = await this.groupRepository.update(
      { key: dto.key },
      { name: dto.name, updateTime: time.current() },
    );
    return !!res.affected;
  }

  async deleteMenuGroup(key: string) {
    const group = await this.groupRepository.existsBy({ key });
    if (!group) {
      return true;
    }
    const runner = this.dataSource.createQueryRunner();

    await runner.connect();
    await runner.startTransaction();
    try {
      await runner.manager.delete(MenuGroupEntity, { key });
      await runner.manager.delete(MenuItemEntity, { group: key });
      await runner.commitTransaction();
      return true;
    } catch (err) {
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }
    return false;
  }

  async allGroups() {
    return this.groupRepository.find({ where: { status: 1 } });
  }
}
