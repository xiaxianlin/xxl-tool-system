import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Role } from '@permission/role/enums/role.enum';
import * as uuid from 'uuid';
import { encodePassword, validatePassword } from '@common/utils/auth';
import {
  CreateUserDto,
  ModifyPasswordDto,
  ModifyUserDto,
} from '@user/dtos/user.dto';
import { UserMainWhere } from '@user/interfaces/user.interface';
import { UserProfileEntity } from '@user/entities/user-profile.entity';
import { SearchParams } from '@common/interfaces/search.interface';
import { InternalException } from '@common/expceptions/internal.exception';
import { time } from '@common/utils/time';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  async initAdmin(username: string, password: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (user) {
      return true;
    }
    await this.createUser({ username, password, role: Role.Admin });
  }

  async getActiveUser(where: UserMainWhere) {
    return await this.userRepository.findOneBy({ ...where, status: 1 });
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.findOneBy({
      username: dto.username,
    });
    if (user) {
      throw new InternalException('账户已存在');
    }
    const entity = this.userRepository.create({
      ...dto,
      uid: uuid.v4(),
      password: await encodePassword(dto.password),
      createTime: time.current(),
    });
    await this.userRepository.insert(entity);
    return entity.uid;
  }

  async deleteUser(uid: string) {
    const user = await this.userRepository.findOneBy({ uid });
    if (!user) {
      return true;
    }
    const [res] = await Promise.all([
      this.userRepository.delete({ uid }),
      this.userProfileRepository.delete({ uid }),
    ]);
    return !!res.affected;
  }

  /** 修改密码 */
  async modifyPassword(uid: string, params: ModifyPasswordDto) {
    const user = await this.userRepository.findOneBy({ uid, status: 1 });
    if (!user) {
      throw new InternalException('账户不存在或被禁用');
    }

    const valid = await validatePassword(params.oldValue, user.password);
    if (!valid) {
      throw new InternalException('原密码错误');
    }

    const res = await this.userRepository.update(
      { uid },
      {
        password: await encodePassword(params.newValue),
        updateTime: time.current(),
      },
    );
    return !!res.affected;
  }

  /** 修改账户 */
  async modifyUser(uid: string, dto: ModifyUserDto) {
    const user = await this.userRepository.findOneBy({ uid });
    if (!user) {
      throw new InternalException('账户不存在或被禁用');
    }

    if (dto.password) {
      dto.password = await encodePassword(dto.password);
    }

    const res = await this.userRepository.update(
      { uid },
      { ...dto, updateTime: time.current() },
    );
    return !!res.affected;
  }

  /** 修改账户状态 */
  async modifyUserStatus(uid: string, status: number) {
    const user = await this.userRepository.findOneBy({ uid });
    if (!user) {
      throw new InternalException('账户不存在或被禁用');
    }

    const res = await this.userRepository.update(
      { uid },
      { status, updateTime: time.current() },
    );
    return !!res.affected;
  }

  async searchUsers({ filter, pagination, sort }: SearchParams) {
    const where = {
      ...(filter.username ? { username: Like(`%${filter.username}%`) } : {}),
      ...(filter.role ? { role: filter.role } : {}),
      ...(filter.status ? { status: filter.status } : {}),
    };
    const data = await this.userRepository.find({
      select: {
        uid: true,
        username: true,
        role: true,
        status: true,
        createTime: true,
        updateTime: true,
      },
      where,
      order: { [sort.field]: sort.order },
      skip: (pagination.page - 1) * pagination.size,
      take: pagination.size,
      cache: true,
    });
    const total = await this.userRepository.count({ where });
    return { ...pagination, total, data };
  }
}
