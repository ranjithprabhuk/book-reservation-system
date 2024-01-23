import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/shared/dto/page-options.dto';
import { Auth } from 'src/shared/guards/roles.guard';
import { Role } from '../user/entities/user.entity';

@Controller('book')
@ApiTags('Book Management')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth(true, false, Role.ADMIN)
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Post('/seed-user-data')
  @HttpCode(HttpStatus.OK)
  loadUserData() {
    return this.bookService.loadBooks();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth(true, false, Role.USER)
  findAll() {
    return this.bookService.findAll();
  }

  @Get('/search')
  @Auth(true, false, Role.USER)
  @HttpCode(HttpStatus.OK)
  search(@Query() pageOptionsDto: PageOptionsDto) {
    return this.bookService.search(pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(true, false, Role.USER)
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(true, false, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(true, false, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.bookService.inActivate(id);
  }
}
