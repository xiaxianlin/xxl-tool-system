import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Role } from '@permission/role/enums/role.enum';
import * as uuid from 'uuid';
import { encodePassword, validatePassword } from '@common/utils/auth';
import { CreateUserDto } from '@user/dtos/user.dto';
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

  async findOne(where: UserMainWhere, params?: { includePassword?: boolean }) {
    if (!(await this.exists(where))) {
      throw new InternalException('账户不存在或被禁用');
    }
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
    return user;
  }

  async create(entity: Partial<UserEntity>) {
    if (await this.exists({ username: entity.username })) {
      throw new InternalException('账户不存在或被禁用');
    }

    const uid = uuid.v4();
    const user = this.userRepository.create({
      ...entity,
      uid,
      password: await encodePassword(entity.password),
      createTime: Date.now().toString(),
    });
    const res = this.userRepository.insert(user);
    this.logger.log('insert user: ', res);
    return uid;
  }

  async remove(uid: string) {
    await this.userRepository.delete({ uid });
    await this.userProfileRepository.delete({ uid });
  }

  /** 停用账户 */
  async stop(uid: string) {
    if (!(await this.exists({ uid }))) {
      throw new InternalException('账户不存在或被禁用');
    }

    const res = await this.userRepository.update({ uid }, { status: 0 });
    this.logger.log(`stop user: ${res.affected}`);
    return res.affected;
  }

  /** 修改密码 */
  async updatePassword(
    uid: string,
    params: { oldValue?: string; newValue?: string },
  ) {
    if (!(await this.exists({ uid }))) {
      throw new InternalException('账户不存在或被禁用');
    }

    const user = await this.userRepository.findOneBy({ uid });
    const valid = await validatePassword(params.oldValue, user.password);
    if (!valid) {
      throw new InternalException('原密码错误');
    }

    return this.userRepository.update(
      { uid },
      { password: await encodePassword(params.newValue) },
    );
  }

  /** 修改用户名 */
  async updateUsername(uid: string, username: string) {
    if (!(await this.exists({ uid }))) {
      throw new InternalException('账户不存在或被禁用');
    }
    return this.userRepository.update({ uid }, { username });
  }

  async search({ filter, pagination, sort }: SearchParams) {
    return this.userRepository.find({
      select: {
        uid: true,
        username: true,
        role: true,
        status: true,
        createTime: true,
        updateTime: true,
      },
      where: {
        ...(filter.username ? { username: Like(`%${filter.username}%`) } : {}),
        ...(filter.role ? { role: filter.role } : {}),
        ...(filter.status ? { status: filter.status } : {}),
      },
      order: { [sort.field]: sort.order },
      skip: (pagination.page - 1) * pagination.size,
      take: pagination.size,
      cache: true,
    });
  }
}
