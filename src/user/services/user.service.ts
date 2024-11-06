import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '@permission/role/enums/role.enum';
import * as uuid from 'uuid';
import { encodePassword } from '@common/utils/auth';
import { CreateUserDto } from '@user/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async exists(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  async initAdmin(username: string, password: string) {
    const data = await this.findOne({ username });
    if (data) return data;
    const admin = this.usersRepository.create({
      uid: uuid.v4(),
      username,
      password: await encodePassword(password),
      role: Role.Admin,
      createTime: Date.now().toString(),
    });
    await this.usersRepository.insert(admin);
    return admin;
  }

  async findOne(where: { uid?: string; username?: string }) {
    const user = await this.usersRepository.findOne({
      where: { ...where, status: 1 },
      select: {
        uid: true,
        username: true,
        role: true,
        createTime: true,
        updateTime: true,
      },
    });
    return user;
  }

  async findOneWithoutAdmin(where: { uid?: string; username?: string }) {
    const user = await this.findOne(where);
    if (!user || user.role === Role.Admin) {
      throw new InternalServerErrorException({ message: '用户不存在' });
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const uid = uuid.v4();
    const user = this.usersRepository.create({
      ...createUserDto,
      uid,
      password: await encodePassword(createUserDto.password),
      createTime: Date.now().toString(),
    });
    const res = this.usersRepository.insert(user);
    console.log('insert result:', res);
    return uid;
  }
}
