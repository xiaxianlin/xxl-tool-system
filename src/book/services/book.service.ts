import { BookDto } from '@book/dtos/book.dto';
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
    return this.bookRepository.findOneBy({ isbn });
  }

  async insert(dto: BookDto) {
    const book = await this.bookRepository.findOneBy({ isbn: dto.isbn });
    if (book) {
      throw new BadRequestException('当前图书已经录入');
    }

    if (dto?.cover?.includes('http')) {
      dto.cover =
        (await this.ossService.uploadByUrl(dto.cover, dto.isbn)) || dto.cover;
    }
    dto.cover = dto.cover ?? `${process.env.OSS_DIR}/default.jpg`;
    const entity = this.bookRepository.create({
      ...dto,
      createTime: Date.now().toString(),
    });
    const res = await this.bookRepository.insert(entity);
    return !!res?.raw?.affectedRows;
  }

  async update(dto: BookDto) {
    const book = await this.bookRepository.findOneBy({ isbn: dto.isbn });
    if (!book) {
      throw new BadRequestException('当前图书不存在');
    }

    delete dto.cover;
    const res = await this.bookRepository.update({ isbn: dto.isbn }, dto);
    return !!res?.affected;
  }

  async search({ filter, pagination, sort }: SearchParams) {
    const where = {
      ...(filter.title ? { title: Like(`%${filter.title}%`) } : {}),
      ...(filter.author ? { author: Like(`%${filter.author}%`) } : {}),
      ...(filter.publisher ? { publisher: Like(`%${filter.publisher}%`) } : {}),
    };

    const total = await this.bookRepository.count({ where });
    const data = await this.bookRepository.find({
      where,
      order: { [sort.field]: sort.order },
      skip: (pagination.page - 1) * pagination.size,
      take: pagination.size,
      cache: true,
    });

    return { ...pagination, total, data };
  }

  async remove(isbn: string) {
    await this.bookRepository.delete(isbn);
    return true;
  }

  async updateCover(isbn: string, file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop();
    const cover = await this.ossService.upload(`${isbn}.${ext}`, file.buffer);
    await this.bookRepository.update({ isbn }, { cover });
    return cover;
  }
}
