import { AddBookDto, addBookSchema } from '@book/dtos/book.dto';
import BookService from '@book/services/book.service';
import { DoubanService } from '@book/services/douban.service';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  Controller,
  Post,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/permission/role/decorators/role.decorator';
import { Role } from 'src/permission/role/enums/role.enum';
import OssService from 'src/shared/services/oss.service';

@Roles(Role.Admin, Role.Manager)
@Controller('book')
export class BookController {
  constructor(
    private doubanService: DoubanService,
    private ossService: OssService,
    private bookService: BookService,
  ) {}
  @Post('/douban/:isbn')
  queryByDouban(@Param('isbn') isbn: string, @Body() data: any) {
    return this.doubanService.query(isbn, data?.cookie);
  }

  @Post('/upload/:isbn')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('isbn') isbn: string,
  ) {
    const ext = file.originalname.split('.').pop();
    return this.ossService.upload(`${isbn}.${ext}`, file.buffer);
  }

  @Post('/add')
  @UsePipes(new ZodValidationPipe(addBookSchema))
  async add(@Body() dto: AddBookDto) {
    return await this.bookService.insert(dto);
  }
}
