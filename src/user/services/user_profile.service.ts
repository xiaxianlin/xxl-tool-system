import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfileEntity } from '../entities/user_profile.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfileEntity)
    private usersRepository: Repository<UserProfileEntity>,
  ) {}

  async findOne(uid: string) {
    return await this.usersRepository.findOneBy({ uid });
  }
}
