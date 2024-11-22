import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Role } from '@permission/role/enums/role.enum';
import * as uuid from 'uuid';
import { encodePassword, validatePassword } from '@common/utils/auth';
import { CreateUserDto, ModifyPasswordDto } from '@user/dtos/user.dto';
import { UserMainWhere } from '@user/interfaces/user.interface';
import { UserProfileEntity } from '@user/entities/user-profile.entity';
import { SearchParams } from '@common/interfaces/search.interface';
import { InternalException } from '@common/expceptions/internal.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  private readonly logger = new Logger(UserService.name);

  private async exists(where: UserMainWhere) {
    return this.userRepository.existsBy({ ...where, status: 1 });
  }

  async initAdmin(username: string, password: string) {
    if (await this.exists({ username })) return;
    await this.create({ username, password, role: Role.Admin });
  }

  async findUser(where: UserMainWhere, params?: { includePassword?: boolean }) {
    const user = await this.userRepository.findOne({
      where: { ...where, status: 1 },
      select: {
        uid: true,
        username: true,
        role: true,
        createTime: true,
        updateTime: true,
        password: params?.includePassword,
      },
    });
    if (!user) {
      throw new InternalException('账户不存在或被禁用');
    }
    return user;
  }

  async create(entity: Partial<UserEntity>) {
    if (await this.exists({ username: entity.username })) {
      throw new InternalException('账户不存在或被禁用');
    }
    const user = this.userRepository.create({
      ...entity,
      uid: uuid.v4(),
      password: await encodePassword(entity.password),
      createTime: Date.now().toString(),
    });
    await this.userRepository.insert(user);
    return user.uid;
  }

  async remove(uid: string) {
    const res = await this.userRepository.delete({ uid });
    await this.userProfileRepository.delete({ uid });
    return { success: !!res.affected };
  }

  /** 停用账户 */
  async stop(uid: string) {
    if (!(await this.exists({ uid }))) {
      throw new InternalException('账户不存在或被禁用');
    }

    const res = await this.userRepository.update({ uid }, { status: 0 });
    return { success: !!res.affected };
  }

  /** 修改密码 */
  async modifyPassword(uid: string, params: ModifyPasswordDto) {
    if (!(await this.exists({ uid }))) {
      throw new InternalException('账户不存在或被禁用');
    }

    const user = await this.userRepository.findOneBy({ uid });
    const valid = await validatePassword(params.oldValue, user.password);
    if (!valid) {
      throw new InternalException('原密码错误');
    }

    const res = await this.userRepository.update(
      { uid },
      { password: await encodePassword(params.newValue) },
    );
    return { success: !!res.affected };
  }

  /** 重置密码 */
  async resetPassword(uid: string, password: string) {
    if (!(await this.exists({ uid }))) {
      throw new InternalException('账户不存在或被禁用');
    }
    const res = await this.userRepository.update(
      { uid },
      { password: await encodePassword(password) },
    );
    return { success: !!res.affected };
  }

  /** 重置用户名 */
  async resetUsername(uid: string, username: string) {
    const user = await this.findUser({ uid });
    if (!user) {
      throw new InternalException('账户不存在或被禁用');
    }

    if (user.username === username) {
      return true;
    }

    const res = await this.userRepository.update({ uid }, { username });
    return { success: !!res.affected };
  }

  async search({ filter, pagination, sort }: SearchParams) {
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
