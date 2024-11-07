import { Role } from 'src/permission/role/enums/role.enum';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn()
  uid: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ name: 'create_time' })
  createTime: string;

  @Column({ name: 'update_time', default: '' })
  updateTime: string;

  @Column({ default: 1 })
  status: number;
}
