import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserProfileEntity } from './entities/user-profile.entity';
import { UserService } from './services/user.service';
import { UserProfileService } from './services/user-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity])],
  controllers: [UserController],
  providers: [UserService, UserProfileService],
  exports: [UserService, UserProfileService, TypeOrmModule],
})
export class UserModule {}
