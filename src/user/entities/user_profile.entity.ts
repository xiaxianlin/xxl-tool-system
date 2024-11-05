import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_profile' })
export class UserProfileEntity {
  @PrimaryColumn()
  uid: string;

  @Column()
  nickname: string;

  @Column()
  avatar: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ name: 'create_time' })
  createTime: string;

  @Column({ name: 'update_time', default: '' })
  updateTime: string;
}
