import { Module } from '@nestjs/common';
import { MenuItemService } from './services/menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemEntity } from './entities/menu.entity';
import { MenuController } from './menu.controller';
import { MenuGroupEntity } from './entities/group.entity';
import { MenuGroupService } from './services/group.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItemEntity, MenuGroupEntity])],
  providers: [MenuItemService, MenuGroupService],
  controllers: [MenuController],
})
export class MenuModule {}
