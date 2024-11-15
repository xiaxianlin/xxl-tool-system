import { AddBookDto } from '@book/dtos/book.dto';
import { BookEntity } from '@book/entities/book.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import OssService from 'src/shared/services/oss.service';
import { SearchParams } from '@common/interfaces/search.interface';

@Injectable()
export default class BookService {
  constructor(
    private ossService: OssService,
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
  ) {}

  async find(isbn: string) {
    return this.bookRepository.findBy({ isbn });
  }

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

  async search({ filter, pagination, sort }: SearchParams) {
    return this.bookRepository.find({
      where: {
        ...(filter.title ? { title: Like(`%${filter.title}%`) } : {}),
        ...(filter.author ? { author: Like(`%${filter.author}%`) } : {}),
        ...(filter.publisher
          ? { publisher: Like(`%${filter.publisher}%`) }
          : {}),
      },
      order: { [sort.field]: sort.order },
      skip: (pagination.page - 1) * pagination.size,
      take: pagination.size,
      cache: true,
    });
  }
}
