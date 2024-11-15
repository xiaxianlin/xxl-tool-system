import { Module } from '@nestjs/common';
import { BookController } from './controllers/book.controller';
import { DoubanService } from './services/douban.service';
import { HttpModule } from '@nestjs/axios';
import { SharedModule } from 'src/shared/shared.module';
import OssService from 'src/shared/services/oss.service';
import BookService from './services/book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';

@Module({
  imports: [
    HttpModule.register({ timeout: 6000 }),
    TypeOrmModule.forFeature([BookEntity]),
    SharedModule,
  ],
  providers: [DoubanService, OssService, BookService],
  controllers: [BookController],
})
export class BookModule {}
