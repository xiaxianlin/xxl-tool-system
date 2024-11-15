import { AddBookDto } from '@book/dtos/book.dto';
import { BookEntity } from '@book/entities/book.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OssService from 'src/shared/services/oss.service';

@Injectable()
export default class BookService {
  constructor(
    private ossService: OssService,
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
  ) {}

  async insert(dto: AddBookDto) {
    const book = await this.bookRepository.findOneBy({ isbn: dto.isbn });
    if (book) {
      throw new BadRequestException('当前图书已经录入');
    }

    if (dto?.cover.includes('http')) {
      dto.cover =
        (await this.ossService.uploadByUrl(dto.cover, dto.isbn)) || dto.cover;
    }
    const entity = this.bookRepository.create({
      ...dto,
      createTime: Date.now().toString(),
    });
    const res = await this.bookRepository.insert(entity);
    return res;
  }
}
