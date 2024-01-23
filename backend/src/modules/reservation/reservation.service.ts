import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import {
  Between,
  Brackets,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'src/shared/exceptions/validation.exception';
import { UserService } from '../user/user.service';
import { BookService } from '../book/book.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private _reservationRepository: Repository<Reservation>,
    private _userService: UserService,
    private _bookService: BookService,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    try {
      const { bookId, userId, fromDate, toDate } = createReservationDto;
      if (!bookId || !userId || !fromDate || !toDate) {
        throw new ValidationError(
          'Book, User, From date and To date values are required to complete a book reservation',
        );
      }
      // Check if the user exists
      const user = await this._userService.findOne(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      // Check if the book exists
      const book = await this._bookService.findOne(bookId);
      if (!book) {
        throw new NotFoundException(`Book with ID ${bookId} not found.`);
      }

      const queryBuilder =
        this._reservationRepository.createQueryBuilder('reservation');
      const existingReservations = await queryBuilder
        .where('reservation.bookId = :bookId', { bookId })
        .andWhere(
          new Brackets((qb) => {
            qb.where('reservation.fromDate BETWEEN :fromDate AND :toDate', {
              fromDate,
              toDate,
            }).orWhere('reservation.toDate BETWEEN :fromDate AND :toDate', {
              fromDate,
              toDate,
            });
          }),
        )
        .getMany();

      if (existingReservations.length > 0) {
        throw new ConflictException(
          'There are existing reservations for the selected date range.',
        );
      }

      const reservation = this._reservationRepository.save({
        user,
        book,
        fromDate: createReservationDto.fromDate,
        toDate: createReservationDto.toDate,
      });

      return reservation;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findAllByUserId(userId: string) {
    try {
      const response = this._reservationRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'book'],
      });
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findAllByBookId(bookId: string) {
    try {
      const response = this._reservationRepository.find({
        where: { book: { id: bookId } },
        relations: ['user', 'book'],
      });
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
