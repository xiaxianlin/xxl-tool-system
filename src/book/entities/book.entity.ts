import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'book' })
export class BookEntity {
  @PrimaryColumn()
  isbn: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column()
  published: string;

  @Column()
  cover: string;

  @Column({ name: 'create_time' })
  createTime: string;

  @Column({ name: 'update_time', default: '' })
  updateTime: string;
}
