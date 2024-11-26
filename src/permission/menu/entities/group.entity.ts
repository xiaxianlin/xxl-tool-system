import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { MenuItemEntity } from './menu.entity';

@Entity({ name: 'menu_group' })
export class MenuGroupEntity {
  @PrimaryColumn()
  key: string;

  @Column()
  name: string;

  @Column({ name: 'create_time' })
  createTime: string;

  @Column({ name: 'update_time', default: '' })
  updateTime: string;

  @Column({ default: 1 })
  status: number;
}
