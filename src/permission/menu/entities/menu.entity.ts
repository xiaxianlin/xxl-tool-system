import { Entity, Column, PrimaryColumn, JoinColumn } from 'typeorm';

@Entity({ name: 'menu_item' })
export class MenuItemEntity {
  @PrimaryColumn()
  key: string;

  @Column()
  name: string;

  @Column()
  group: string;

  @Column({ name: 'create_time' })
  createTime: string;

  @Column({ name: 'update_time', default: '' })
  updateTime: string;

  @Column({ default: 1 })
  status: number;
}
