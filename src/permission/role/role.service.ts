import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { Repository } from 'typeorm';
import { RoleDto } from './role.dto';
import { InternalException } from '@common/expceptions/internal.exception';
import { time } from '@common/utils/time';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async initRole(key: string, name: string) {
    const role = await this.roleRepository.findOneBy({ key });
    if (role) {
      return true;
    }
    await this.createRole({ key, name });
  }

  async createRole(dto: RoleDto) {
    const role = await this.roleRepository.existsBy({ key: dto.key });
    if (role) {
      throw new InternalException('角色 key 已经存在');
    }

    const entity = this.roleRepository.create({
      ...dto,
      createTime: Date.now().toString(),
    });

    const res = await this.roleRepository.insert(entity);
    return !!res.raw.affectedRows;
  }

  async modifyRole(dto: RoleDto) {
    const role = await this.roleRepository.existsBy({ key: dto.key });
    if (!role) {
      throw new InternalException('角色不存在');
    }

    const res = await this.roleRepository.update(
      { key: dto.key },
      { name: dto.name, updateTime: time.current() },
    );
    return !!res.affected;
  }

  async deleteRole(key: string) {
    const role = await this.roleRepository.existsBy({ key });
    if (!role) {
      return true;
    }
    const res = await this.roleRepository.delete({ key });
    return !!res.affected;
  }

  async allRoles() {
    return this.roleRepository.find();
  }
}
