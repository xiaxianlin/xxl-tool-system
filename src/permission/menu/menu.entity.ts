import { Entity, Column, PrimaryColumn, JoinColumn } from 'typeorm';

@Entity({ name: 'menu' })
export class MenuEntity {
  @PrimaryColumn()
  key: string;

  @Column()
  name: string;

  @Column({ default: '' })
  parent: string;

  @Column({ name: 'create_time' })
  createTime: string;

  @Column({ name: 'update_time', default: '' })
  updateTime: string;

  @Column({ default: 1 })
  status: number;
}
