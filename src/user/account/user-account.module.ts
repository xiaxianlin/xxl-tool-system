import { Module } from '@nestjs/common';
import { UserController } from './user-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountEntity } from './user-account.entity';
import { UserAccountService } from './user-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccountEntity])],
  controllers: [UserController],
  providers: [UserAccountService],
  exports: [UserAccountService, TypeOrmModule],
})
export class UserAccountModule {}
