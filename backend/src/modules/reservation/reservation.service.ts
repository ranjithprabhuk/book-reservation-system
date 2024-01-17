import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'src/shared/exceptions/validation.exception';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private _reservationRepository: Repository<Reservation>,
  ) {}

  create(createReservationDto: CreateReservationDto) {
    try {
      if (
        !createReservationDto.bookId ||
        !createReservationDto.userId ||
        !createReservationDto.fromDate ||
        !createReservationDto.toDate
      ) {
        throw new ValidationError(
          'Book, User, From date and To date values are required to complete a book reservation',
        );
      }
      const response = this._reservationRepository.save(createReservationDto);
      return response;
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
