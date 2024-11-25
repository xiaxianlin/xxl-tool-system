import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleService, { provide: APP_GUARD, useClass: RolesGuard }],
  controllers: [RoleController],
  exports: [RoleService, TypeOrmModule],
})
export class RoleModule {}
