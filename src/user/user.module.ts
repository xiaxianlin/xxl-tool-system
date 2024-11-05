import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserProfileEntity } from './entities/user_profile.entity';
import { UserService } from './services/user.service';
import { UserProfileService } from './services/user_profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity])],
  controllers: [UserController],
  providers: [UserService, UserProfileService],
  exports: [UserService, UserProfileService, TypeOrmModule],
})
export class UserModule {}
