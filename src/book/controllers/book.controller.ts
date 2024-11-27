import { BookDto, bookSchema } from '@book/dtos/book.dto';
import BookService from '@book/services/book.service';
import { DoubanService } from '@book/services/douban.service';
import { SearchParams } from '@common/interfaces/search.interface';
import { SearchParamsParsePipe } from '@common/pipes/serach-params-parse.pipe';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { Controller, Post, Param, Body, UseInterceptors, UploadedFile, UsePipes, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('book')
export class BookController {
  constructor(private doubanService: DoubanService, private bookService: BookService) {}

  @Get('/get/:isbn')
  async find(@Param('isbn') isbn: string) {
    return this.bookService.find(isbn);
  }

  @Post('/douban/:isbn')
  queryByDouban(@Param('isbn') isbn: string, @Body() data: any) {
    return this.doubanService.parseBySearchPage(isbn, data?.cookie);
  }

  @Post('/cover/:isbn')
  @UseInterceptors(FileInterceptor('file'))
  cover(@UploadedFile() file: Express.Multer.File, @Param('isbn') isbn: string) {
    return this.bookService.updateCover(isbn, file);
  }

  @Post('/add')
  @UsePipes(new ZodValidationPipe(bookSchema))
  async add(@Body() dto: BookDto) {
    return this.bookService.insert(dto);
  }

  @Post('/update')
  @UsePipes(new ZodValidationPipe(bookSchema))
  async update(@Body() dto: BookDto) {
    return this.bookService.update(dto);
  }

  @Get('/search')
  @UsePipes(SearchParamsParsePipe)
  async search(@Query() params: SearchParams) {
    return this.bookService.search(params);
  }

  @Post('/delete/:isbn')
  remove(@Param('isbn') isbn: string) {
    return this.bookService.remove(isbn);
  }
}
