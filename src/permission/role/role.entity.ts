import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryColumn()
  key: string;

  @Column()
  name: string;

  @Column({ name: 'create_time' })
  createTime: string;

  @Column({ name: 'update_time', default: '' })
  updateTime: string;
}