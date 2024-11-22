import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserProfileEntity } from './entities/user-profile.entity';
import { UserService } from './services/user.service';
import { UserProfileService } from './services/user-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity])],
  controllers: [AdminController],
  providers: [UserService, UserProfileService],
  exports: [UserService, UserProfileService, TypeOrmModule],
})
export class UserModule {}
