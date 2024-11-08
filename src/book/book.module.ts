import { Module } from '@nestjs/common';
import { BookController } from './controllers/book.controller';
import { DoubanService } from './services/douban.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 6000,
    }),
  ],
  providers: [DoubanService],
  controllers: [BookController],
})
export class BookModule {}
