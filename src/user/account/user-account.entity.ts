import { RoleEntity } from '@permission/role/role.entity';
import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'user_account' })
export class UserAccountEntity {
  @PrimaryColumn()
  uid: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => RoleEntity)
  @JoinColumn({ name: 'role' })
  role: RoleEntity;

  @Column({ name: 'create_time' })
  createTime: string;

  @Column({ name: 'update_time', default: '' })
  updateTime: string;

  @Column({ default: 1 })
  status: number;
}
