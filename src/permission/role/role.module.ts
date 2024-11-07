import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role.guard';

@Module({
  providers: [RoleService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class RoleModule {}
