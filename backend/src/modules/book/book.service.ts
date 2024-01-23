import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'src/shared/exceptions/validation.exception';
import { PageOptionsDto } from 'src/shared/dto/page-options.dto';
import { PageDto } from 'src/shared/dto/page.dto';
import { PageMetaDto } from 'src/shared/dto/page-meta.dto';
import { SqlUtility } from 'src/shared/utility/sql.utility';
import * as bookData from '../../seed-data/books.json';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private _bookRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    try {
      if (
        !createBookDto.name ||
        !createBookDto.description ||
        !createBookDto.ISBN
      ) {
        throw new ValidationError(
          'Name, Description and ISBN values are required to add a book',
        );
      }
      const response = this._bookRepository.save(createBookDto);
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async loadBooks() {
    try {
      const count = await this._bookRepository.count();
      if (count === 0) {
        const books = await this._bookRepository.create(bookData);
        await this._bookRepository.save(books);

        return 'Success';
      } else {
        return 'Book information is already seeded in the system';
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findAll() {
    try {
      const response = this._bookRepository.findAndCount({
        where: [{ isActive: true }],
      });
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async search(pageOptionsDto: PageOptionsDto): Promise<PageDto<any>> {
    try {
      const queryBuilder = this._bookRepository.createQueryBuilder('book');
      const whereClause = pageOptionsDto.searchText
        ? SqlUtility.getSearchTextWhereClause('book', [
            'name',
            'description',
            'ISBN',
          ])
        : '';

      queryBuilder
        .select()
        .where(whereClause)
        .andWhere('book.isActive = true')
        .orderBy(`book.${pageOptionsDto.orderBy}`, pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .setParameters({
          searchText: `%${decodeURIComponent(pageOptionsDto.searchText)}%`,
          isActive: true,
        });

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findOne(id: string) {
    try {
      if (!id) {
        throw new ValidationError(
          'Book ID is required to get the book information',
        );
      }

      const queryBuilder = this._bookRepository.createQueryBuilder('book');
      return queryBuilder
        .leftJoinAndSelect('book.bookReservations', 'reservation')
        .leftJoinAndSelect('reservation.user', 'user')
        .where('book.id = :bookId', { bookId: id })
        .select([
          'book.id',
          'book.name',
          'book.author',
          'book.ISBN',
          'book.description',
          'reservation.id',
          'reservation.fromDate',
          'reservation.toDate',
          'user.id',
          'user.firstName',
          'user.lastName',
        ])
        .getOne();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    try {
      if (!id) {
        throw new ValidationError('Book ID is required to update the value');
      }
      const response = this._bookRepository.update({ id }, updateBookDto);
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  inActivate(id: string) {
    try {
      if (!id) {
        throw new ValidationError('Book ID is required to inactivate it');
      }
      const response = this._bookRepository.update(id, { isActive: false });
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
