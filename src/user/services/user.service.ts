import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '@permission/role/enums/role.enum';
import * as uuid from 'uuid';
import { encodePassword } from '@common/utils/auth';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  async initAdmin(username: string, password: string) {
    const data = await this.findByUsername(username);
    if (data) return data;
    const admin = this.usersRepository.create({
      uid: uuid.v4(),
      username,
      password: await encodePassword(password),
      role: Role.Admin,
      createTime: Date.now().toString(),
    });
    const res = await this.usersRepository.insert(admin);
    console.log(res);
    return admin;
  }
}
