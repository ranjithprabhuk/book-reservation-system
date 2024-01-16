import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    try {
      const response = this.bookRepository.save(createBookDto);
      return response;
    } catch (e) {
      throw e;
    }
  }

  findAll() {
    try {
      const response = this.bookRepository.find({
        where: [{ isActive: true }],
      });
      return response;
    } catch (e) {
      throw e;
    }
  }

  findOne(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(
          'Book ID is required to get the book information',
        );
      }
      const response = this.bookRepository.findOne({ where: [{ id }] });
      return response;
    } catch (e) {
      throw e;
    }
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    try {
      if (!id) {
        throw new BadRequestException(
          'Book ID is required to update the value',
        );
      }
      const response = this.bookRepository.update({ id }, updateBookDto);
      return response;
    } catch (e) {
      throw e;
    }
  }

  inActivate(id: string) {
    try {
      if (!id) {
        throw new BadRequestException('Book ID is required to inactivate it');
      }
      const response = this.bookRepository.update(id, { isActive: false });
      return response;
    } catch (e) {
      throw e;
    }
  }
}
